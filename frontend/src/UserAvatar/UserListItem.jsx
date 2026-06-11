import React from "react";
import { MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import defaultAvatar from "../assets/default-avatar.png";

const UserListItem = ({ user }) => {
  return (
    <div className="w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 group">
      <Avatar className="h-11 w-11 border border-white/10">
        <AvatarImage src={user?.pic || defaultAvatar} />
        <AvatarFallback>
          {user?.username?.[0]?.toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0 text-left">
        <p className="font-medium text-white group-hover:text-indigo-500 transition-colors ">
          {user?.username}
        </p>

        <p className="text-xs text-white/60 truncate group-hover:text-indigo-400">
          {user?.email}
        </p>
      </div>

      <MessageCircle
        size={18}
        className="shrink-0 text-white/40 group-hover:text-indigo-400 transition-colors"
      />
    </div>
  );
};

export default UserListItem;
