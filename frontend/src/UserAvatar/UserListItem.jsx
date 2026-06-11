import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import defaultAvatar from "../assets/default-avatar.png";
import { MessageCircle } from 'lucide-react';


const UserListItem = ({user, handleFunction }) => {
  return (
    <button
      onClick={handleFunction}
      className="bg-gray-800 w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-700 transition-all duration-300 group hover:cursor-pointer"
    >
      <Avatar className="h-11 w-11 border border-white/10">
        <AvatarImage src={user?.pic || defaultAvatar} />
        <AvatarFallback>{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className="flex-1 text-left">
        <p className="font-medium text-white group-hover:text-indigo-300 transition-colors">
          {user.username}
        </p>

        <p className="text-xs text-white/50 truncate">{user.email}</p>
      </div>

      <MessageCircle
        size={18}
        className="text-white/40 group-hover:text-indigo-400 transition-colors"
      />
    </button>
  );
}

export default UserListItem