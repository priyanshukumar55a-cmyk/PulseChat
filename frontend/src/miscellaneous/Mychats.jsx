import api from "@/api/axios";
import { ChatState } from "@/context/chatProvider";
import { useAuth } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";
import MySingleChat from "./MySingleChat";

const Mychats = () => {
  const [loading, setLoading] = useState(false);
  const { chats, setChats, selectedChat, setSelectedChat } = ChatState();
  const { user } = useAuth();

  const fetchChats = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/chat");
      setChats(data);
    } catch (error) {
      toast.error("Failed to load the chats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-3xl p-4 shadow-xl h-[calc(100vh-5rem)] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">My Chats</h2>

        <span className="px-3 py-1 text-sm rounded-full bg-indigo-500/20 text-indigo-300">
          {chats?.length || 0}
        </span>
      </div>
      {/* Loading */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="animate-pulse w-full h-14 rounded-2xl bg-white/3"
            />
          ))}
        </div>
      ) : chats?.length > 0 ? (
        <div className="space-y-2">
          {chats.map((chat) => (
            <MySingleChat
              key={chat._id}
              chat={chat}
              user={user}
              isSelected={selectedChat?._id === chat._id}
              setSelectedChat={setSelectedChat}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <MessageCircle className="h-10 w-10 text-white/30 mb-3" />

          <p className="text-white/70 font-medium">No chats yet</p>

          <p className="text-sm text-white/40 mt-1">
            Search for users to start chatting
          </p>
        </div>
      )}
    </div>
  );
};

export default Mychats;
