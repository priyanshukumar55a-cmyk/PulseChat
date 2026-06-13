import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChatState } from "@/context/chatProvider";
import { Input } from "@/components/ui/input";
import api from "@/api/axios";
import { toast } from "sonner";

const UpdateGrpChatModal = () => {
  const [open, setOpen] = useState(false);

  const [grpChatName, setGrpChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const { chats, setChats, selectedChat, setSelectedChat } = ChatState();

  const handleRemoveUser = () => {};
  const handleRename = async () => {
    try {
      setRenameLoading(true);
      const { data } = api.put("/chat/rename", {
        chatId: selectedChat._id,
        chatName: grpChatName,
      });

        setSelectedChat(data);
        toast.success("Group name updated successfully")
    } catch (error) {
      toast.error(error.response?.data?.message || "Error occurred!");
    } finally {
      setRenameLoading(false);
    }

    setGrpChatName("");
  };
  const handleSearch = () => {};

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
          {selectedChat?.users?.map((u) => (
            <Badge
              key={u._id}
              onClick={() => handleRemoveUser(u)}
              className="cursor-pointer rounded-md px-3 bg-gradient-to-r  from-violet-500  to-fuchsia-500  text-white hover:opacity-90 transition py-3"
            >
              {u.username}
              <span className="ml-2 font-bold">×</span>
            </Badge>
          ))}
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
          placeholder="Search users by name or email"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          autoComplete="new-password"
        />
        <Button
          onClick={() => handleRemoveUser(u)}
          className="bg-red-600 hover:bg-red-700 cursor-pointer px-4 py-5"
        >
          {renameLoading ? "Leaving..." : "Leave Group"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateGrpChatModal;
