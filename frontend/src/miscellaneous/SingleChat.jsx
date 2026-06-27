import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatState } from "@/context/chatProvider";
import { Loader2, Send } from "lucide-react";
import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { toast } from "sonner";
import ScrollableChat from "./ScrollableChat";
import { useSocket } from "@/context/SocketProvider";

const SingleChat = forwardRef((props, ref) => {
  const { socket, connected } = useSocket();
  const { selectedChat } = ChatState();

  const chatContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const typingRef = useRef(false);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const socketConnected = connected;
  const [isTyping, setIsTyping] = useState(false);

  // =========================
  // SOCKET SETUP
  // =========================

  useEffect(() => {
    if (!socket) return;

    const handleTyping = () => setIsTyping(true);
    const handleStopTyping = () => setIsTyping(false);
    const handleMessageReceived = (newMessageReceived) => {
      if (!selectedChat || selectedChat._id !== newMessageReceived.chat._id) {
        return;
      }

      setMessages((prev) => {
        if (prev.some((m) => m._id === newMessageReceived._id)) {
          return prev;
        }

        return [...prev, newMessageReceived];
      });
    };

    socket.on("typing", handleTyping);
    socket.on("stop typing", handleStopTyping);
    socket.on("message received", handleMessageReceived);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stop typing", handleStopTyping);
      socket.off("message received", handleMessageReceived);
    };
  }, [socket, selectedChat]);

  // =========================
  // JOIN CHAT ROOM
  // =========================

  useEffect(() => {
    if (!selectedChat || !socketConnected) return;

    socket.emit("join chat", selectedChat._id);
  }, [selectedChat, socketConnected]);

  // =========================
  // FETCH MESSAGES
  // =========================

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);

      const { data } = await api.get(`/message/${selectedChat._id}`);

      setMessages(data);
    } catch (error) {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMessages([]);
    fetchMessages();
  }, [selectedChat]);

  useImperativeHandle(ref, () => ({
    fetchMessages,
  }));

  // =========================
  // AUTO SCROLL
  // =========================

  useEffect(() => {
    const container = chatContainerRef.current;

    if (!container) return;

    container.scrollTop = container.scrollHeight;
  }, [messages, isTyping]);

  // =========================
  // SEND MESSAGE
  // =========================

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    if (!selectedChat) return;

    try {
      if (typingRef.current) {
        socket.emit("stop typing", selectedChat._id);

        typingRef.current = false;

        clearTimeout(typingTimeoutRef.current);
      }

      const content = newMessage;

      setNewMessage("");

      const { data } = await api.post("/message", {
        content,
        chatId: selectedChat._id,
      });

      setMessages((prev) => [...prev, data]);

      socket.emit("new message", data);
    } catch (error) {
      toast.error("Error occurred");
    }
  };

  // =========================
  // TYPING HANDLER
  // =========================

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected || !selectedChat) return;

    if (!typingRef.current) {
      typingRef.current = true;

      socket.emit("typing", selectedChat._id);
    }

    clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop typing", selectedChat._id);

      typingRef.current = false;
    }, 2000);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div
        ref={chatContainerRef}
        className="flex-1 min-h-0 overflow-y-auto scrollbar scrollbar-w-2 scrollbar-thumb-rounded-full scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/35"
      >
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-white" />
          </div>
        ) : (
          <div className="p-3">
            <ScrollableChat messages={messages} />

            {isTyping && (
              <div className="flex items-center gap-1 px-2 py-1">
                <span className="h-2 w-2 rounded-full bg-white/60 animate-bounce" />
                <span
                  className="h-2 w-2 rounded-full bg-white/60 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="h-2 w-2 rounded-full bg-white/60 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex-shrink-0 sm:rounded-b-2xl border-t border-white/10 bg-slate-950/40 p-2 backdrop-blur-xl">
        <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/10 py-1 pl-2 shadow-lg shadow-black/10">
          <Textarea
            value={newMessage}
            onChange={typingHandler}
            disabled={loading}
            placeholder="Type a message..."
            rows={1}
            className="min-h-[40px] flex-1 resize-none border-none bg-transparent px-3 text-white placeholder:text-white/60 focus:ring-0"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />

          <Button
            size="icon"
            disabled={loading || !newMessage.trim()}
            onClick={sendMessage}
            className="h-12 w-12 rounded-2xl bg-violet-600 text-white hover:bg-violet-500"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
});

export default SingleChat;
