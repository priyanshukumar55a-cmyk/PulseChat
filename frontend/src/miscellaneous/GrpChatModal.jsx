import api from "@/api/axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ChatState } from "@/context/chatProvider";
import { Loader2, Users } from "lucide-react";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const GrpChatModal = ({setOpen}) => {
  const [grpChatName, setGrpChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { chats, setChats, setSelectedChat } = ChatState();
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
  const handleRemoveUser = (userToRemove) => {
    const newUpdatedUsers = selectedUsers.filter(
      (user) => user._id !== userToRemove._id,
    );

    setSelectedUsers(newUpdatedUsers);
    return;
  };
  const handleGroup = (userToAdd) => {
    if (selectedUsers.some((user) => user._id === userToAdd._id)) {
      return toast.warning("User already added");
    }

    setSelectedUsers((prev) => [userToAdd, ...prev]);
    setSearch("");
    setSearchResult([]);
  };

  const handleSubmit = async () => {
    if (!grpChatName.trim() || selectedUsers.length == 0) {
      return toast.warning("Please fill all the fields");
    }

    try {
      const { data } = await api.post("/chat/group", {
        name: grpChatName,
        users: JSON.stringify(selectedUsers.map((u) => u._id)),
      });
      setGrpChatName("");
      setSelectedUsers([]);
      setSearch("");
      setSearchResult([]);

      setChats([data, ...chats])
      setOpen(false)
      setSelectedChat(data)
      toast.success("Group created successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create group");
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center justify-center gap-2 text-xl">
          <Users className="h-5 w-5" />
          Create New Group
        </DialogTitle>
      </DialogHeader>

      <div className="relative flex flex-col gap-4 py-4">
        <Input
          className="border-purple-400 px-4 py-5"
          placeholder="Group name"
          value={grpChatName}
          onChange={(e) => setGrpChatName(e.target.value)}
        />
        <Input
          className="border-purple-400 px-4 py-5"
          placeholder="Search users by name or email"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          autoComplete="new-password"
        />
        {loading && (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {selectedUsers.map((user) => (
            <Badge
              key={user._id}
              onClick={() => handleRemoveUser(user)}
              className="cursor-pointer rounded-md px-3 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:opacity-90"
            >
              {user.username} ✕
            </Badge>
          ))}
        </div>
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
                onClick={() => handleGroup(user)}
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
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            className="bg-yellow-500 hover:bg-yellow-600 px-3 py-5 hover:cursor-pointer text-[15px]"
          >
            Create Group
          </Button>
        </div>
      </div>
    </>
  );
};

export default GrpChatModal;
