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

const SingleChat = forwardRef((props, ref) => {
  const chatContainerRef = useRef(null);
  const { selectedChat } = ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
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
  }, [selectedChat]);

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
    <>
      <div className="flex flex-1 flex-col min-h-0 w-full">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-12 w-12 md:h-16 md:w-16 animate-spin text-white" />
          </div>
        ) : (
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto min-h-0 p-3"
          >
            <div className="min-h-full flex flex-col justify-end">
              <ScrollableChat messages={messages} />
            </div>
          </div> 
        )}
      </div>
      <div className="flex items-end gap-2 p-3 border-t bg-background rounded-b-xl">
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
          className="min-h-[40px] max-h-32 resize-none flex-1 min-w-0 break-all"
        />

        <Button
          disabled={loading || !newMessage.trim()}
          onClick={sendMessage}
          size="icon"
          className="cursor-pointer mb-1"
        >
          <Send className="h-4 w-4 " />
        </Button>
      </div>
    </>
  );
});

export default SingleChat;
