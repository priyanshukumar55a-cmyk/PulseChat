import api from "@/api/axios";
import { ChatState } from "@/context/chatProvider";
import { useAuth } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { MessageCircle, Plus } from "lucide-react";
import MySingleChat from "./MySingleChat";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import GrpChatModal from "./GrpChatModal";
import SearchBox from "@/components/navbar/SearchBox";

const Mychats = () => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const { chats, setChats, selectedChat, setSelectedChat } = ChatState();
  const [open, setOpen] = useState(false);
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
    <div className="backdrop-blur-sm bg-white/5 border border-white/10 sm:rounded-3xl p-3.5 md:p-4 shadow-xl h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">My Chats</h2>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="md:py-5 md:px-3 py-4 bg-fuchsia-500 hover:bg-fuchsia-500/70 cursor-pointer">
              <Plus className="h-5 w-5" />
              Create New Group
            </Button>
          </DialogTrigger>

          <DialogContent>
            <GrpChatModal setOpen={setOpen} />
          </DialogContent>
        </Dialog>
      </div>
      {/* Loading */}
      {/* Search (authenticated only) */}
      <div className="sm:hidden mt-0.5 mb-3 ml-1">
        {isAuthenticated && <SearchBox />}
      </div>
      <div className="overflow-y-auto scrollbar-none flex-1">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="animate-pulse w-full h-14 rounded-2xl bg-white/12"
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
    </div>
  );
};

export default Mychats;
