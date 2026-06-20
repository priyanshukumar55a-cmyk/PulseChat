import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChatState } from "@/context/chatProvider";
import { Input } from "@/components/ui/input";
import api from "@/api/axios";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";

const UpdateGrpChatModal = ({ fetchMessages }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const [grpChatName, setGrpChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const { selectedChat, setSelectedChat } = ChatState();

  const handleRemoveUser = async (userToRemove) => {
    if (
      selectedChat.groupAdmin._id !== user._id &&
      userToRemove._id !== user._id
    ) {
      return toast.warning("Only admins can remove someone!");
    }

    try {
      setLoading(true);
      const { data } = await api.put("chat/groupRemove", {
        chatId: selectedChat._id,
        userId: userToRemove._id,
      });

      setOpen(false);
      toast.success("User removed successfully");
      userToRemove._id === user._id ? setSelectedChat() : setSelectedChat(data);
      fetchMessages();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error occurred!");
    } finally {
      setLoading(false);
    }
  };
  const handleRename = async () => {
    try {
      setRenameLoading(true);
      const { data } = await api.put("/chat/rename", {
        chatId: selectedChat._id,
        chatName: grpChatName,
      });

      setOpen(false);
      setSelectedChat(data);
      toast.success("Group name updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error occurred!");
    } finally {
      setRenameLoading(false);
    }

    setGrpChatName("");
  };
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResult([]);
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.get(`/user?search=${query}`);
      setSearchResult(data);
    } catch (error) {
      toast.error("Falied to Load the Search Results");
    } finally {
      setLoading(false);
    }
  };
  const handleAddUser = async (userToAdd) => {
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      return toast.warning("User already in group!");
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      return toast.warning("Only admins can add someone!");
    }

    try {
      setLoading(true);
      const { data } = await api.put("chat/groupAdd", {
        chatId: selectedChat._id,
        userId: userToAdd._id,
      });
      setOpen(false);
      toast.success("User added successfully");
      setSelectedChat(data);
      setSearch("");
      setSearchResult([]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error occurred!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="py-5 px-3 bg-fuchsia-500 hover:bg-fuchsia-500/70 cursor-pointer">
          <Pencil className="h-5 w-5" />
          Update Group
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2 text-xl md:text-3xl">
            {selectedChat.chatName}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-wrap gap-2">
          {selectedChat?.users?.map((u) => {
            const isAdmin = selectedChat.groupAdmin._id === u._id;
            const isYou = user._id === u._id;

            return (
              <Badge
                key={u._id}
                onClick={() => handleRemoveUser(u)}
                className={`
          cursor-pointer rounded-lg px-3 py-3.5 text-white transition
          ${
            isAdmin
              ? "bg-amber-500 hover:bg-amber-400"
              : isYou
                ? "bg-emerald-600 hover:bg-emerald-500"
                : "bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:opacity-90"
          }
        `}
              >
                <div className="flex items-center gap-2">
                  <span>{u.username}</span>

                  {isAdmin && (
                    <span className="rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-semibold">
                      👑 Admin
                    </span>
                  )}

                  {!isAdmin && isYou && (
                    <span className="rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-semibold">
                      You
                    </span>
                  )}

                  <span className="ml-1 font-bold">×</span>
                </div>
              </Badge>
            );
          })}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Enter new group name"
            value={grpChatName}
            onChange={(e) => setGrpChatName(e.target.value)}
            className="flex-1 px-4 py-5 border-purple-400"
          />

          <Button
            onClick={handleRename}
            disabled={!grpChatName.trim() || renameLoading}
            className="bg-green-600 hover:bg-green-700 px-4 py-5 cursor-pointer"
          >
            {renameLoading ? "Renaming..." : "Rename"}
          </Button>
        </div>
        <Input
          className="border-purple-400 px-4 py-5"
          placeholder="Search users to add them to the group"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          autoComplete="new-password"
        />
        {loading && (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
        {search.length > 0 && searchResult.length == 0 && !loading ? (
          <button
            type="button"
            className="w-full flex items-center gap-3 px-4 py-2 text-left transition border-2 rounded-md border-black/15 hover:cursor-pointer bg-cyan-300 hover:bg-cyan-200"
          >
            No Users Found
          </button>
        ) : (
          searchResult?.slice(0, 4).map((user) => {
            return (
              <button
                key={user._id}
                type="button"
                onClick={() => handleAddUser(user)}
                className="w-full flex items-center gap-3 px-4 py-2 text-left transition border-2 rounded-md border-black/15 hover:cursor-pointer bg-cyan-300 hover:bg-cyan-200"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.pic} alt={user?.username} />
                  <AvatarFallback>
                    {user?.username?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="font-medium">{user.username}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </button>
            );
          })
        )}
        <Button
          onClick={() => handleRemoveUser(user)}
          className="bg-red-600 hover:bg-red-700 cursor-pointer px-4 py-5"
        >
          {renameLoading ? "Leaving..." : "Leave Group"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateGrpChatModal;
