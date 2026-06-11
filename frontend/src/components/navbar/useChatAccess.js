import api from "@/api/axios";
import { ChatState } from "@/context/chatProvider";
import { useState } from "react";
import { toast } from "sonner";

export const useChatAccess = () => {
  const { setSelectedChat, chats, setChats } = ChatState();
  const [loadingChat, setLoadingChat] = useState(false);

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const { data } = await api.post("/chat", { userId });

      console.log(data)

      if (!chats?.some((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
    } catch (error) {
      toast.error("Error fetching the chat");
      console.error(error);
    } finally {
      setLoadingChat(false);
    }
  };

  return { accessChat, loadingChat };
};
