import api from "@/api/axios";
import { ChatState } from "@/context/chatProvider";
import { useAuth } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";

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
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-4 shadow-xl h-[calc(100vh-5rem)] overflow-y-auto">
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
            {chats.map((chat) => {
              const isSelected = selectedChat?._id === chat._id;

              // derive display name and avatar for 1:1 chats
              const otherUser =
                !chat.isGroupChat &&
                chat.users?.find((u) => u._id !== user?._id);

              const title = chat.isGroupChat
                ? chat.chatName
                : otherUser?.username || chat.chatName || "Unknown";

              const latest = chat.latestMessage;

              const preview = latest
                ? `${latest.sender?.username ? latest.sender.username + ": " : ""}${latest.content}`
                : "No messages yet";

              const showUnread =
                latest && latest.sender && latest.sender._id !== user?._id;

              return (
                <button
                  key={chat._id}
                  onClick={() => setSelectedChat(chat)}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 text-left focus:outline-none ${
                    isSelected
                      ? "bg-indigo-600/20 ring-1 ring-indigo-400"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="h-12 w-12 rounded-full bg-indigo-500/10 flex items-center justify-center overflow-hidden">
                    {otherUser?.pic ? (
                      // user avatar
                      // using img tag in case Avatar component not available here
                      <img
                        src={otherUser.pic}
                        alt={otherUser.username}
                        className="h-12 w-12 object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 flex items-center justify-center text-indigo-300 font-semibold">
                        {title?.[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-white truncate">{title}</p>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-white/60 truncate">
                        {preview}
                      </p>

                      {showUnread ? (
                        <span className="ml-auto inline-flex items-center justify-center h-5 w-5 rounded-full bg-amber-400 text-xs text-black font-medium">
                          •
                        </span>
                      ) : null}
                    </div>
                  </div>
                </button>
              );
            })}
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
