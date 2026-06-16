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
import { io } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";

const ENDPOINT = "http://localhost:3001";
var socket, selectedChatCompare;

const SingleChat = forwardRef((props, ref) => {
  const { user } = useAuth();
  const chatContainerRef = useRef(null);
  const { selectedChat } = ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));

    return () => {
      socket.disconnect();
    }
  }, []);

  useEffect(() => {
    if (!selectedChat) return;

    if (socketConnected) {
      socket.emit("join chat", selectedChat._id);
    }
  }, [selectedChat]);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    container.scrollTop = container.scrollHeight;
  }, [messages]);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      const { data } = await api.get(`/message/${selectedChat._id}`);
      console.log(data);
      setMessages(data);
    } catch (error) {
      toast.error("Failed to Load the Messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMessages([]);
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        // give notification
      }
      else {
        setMessages((prev) => [...prev, newMessageReceived])
      }
    });
  },[]);

  useImperativeHandle(ref, () => ({
    fetchMessages,
  }));

  const sendMessage = async () => {
    if (!selectedChat?._id) return;
    if (!newMessage.trim()) return;
    try {
      const messageToSend = newMessage;
      setNewMessage("");

      const { data } = await api.post("/message", {
        content: messageToSend,
        chatId: selectedChat._id,
      });

      socket.emit('new message', data)
      setMessages((prev) => [...prev, data]);
    } catch (error) {
      toast.error("Error Occured!");
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // typing indicator logic
  };
  return (
    <div className="flex h-full min-h-0 flex-col scrollbar-thumb-gray-300">
      <div
        ref={chatContainerRef}
        className="flex-1 min-h-0 overflow-y-auto scrollbar scrollbar-w-2 scrollbar-thumb-rounded-full scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/35"
      >
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-12 w-12 md:h-16 md:w-16 animate-spin text-white" />
          </div>
        ) : (
          <div className="flex-1 min-h-0 p-3">
            <ScrollableChat messages={messages} />
          </div>
        )}
      </div>

      <div className="flex-shrink-0 rounded-b-2xl bg-slate-950/40 border-t border-white/10 backdrop-blur-xl p-2">
        <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/10 py-1 shadow-lg shadow-black/10 pl-2">
          <Textarea
            value={newMessage}
            onChange={typingHandler}
            disabled={loading}
            placeholder="Type a message..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault(); // Prevent newline
                sendMessage();
              }
            }}
            rows={1}
            className="min-h-[40px] resize-none flex-1 min-w-0 rounded-2xl border-none bg-transparent px-3 text-white placeholder:text-white/60 focus:ring-0"
          />

          <Button
            disabled={loading || !newMessage.trim()}
            onClick={sendMessage}
            size="icon"
            className="h-12 w-12 rounded-2xl bg-violet-600 text-white hover:bg-violet-500"
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
});

export default SingleChat;
