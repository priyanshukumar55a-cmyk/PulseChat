import { useSocket } from "@/context/SocketProvider";
import React, { useEffect, useState } from "react";

const MySingleChat = ({ chat, user, isSelected, setSelectedChat }) => {
  const { activeUsers } = useSocket();
  const [latestMsg, setLatestMsg] = useState(chat.latestMessage);

  useEffect(() => setLatestMsg(chat.latestMessage), [chat.latestMessage]);

  const otherUser =
    !chat.isGroupChat && chat.users?.find((u) => u._id !== user?._id);
  const isOnline = activeUsers.includes(otherUser?._id);

  const grpName = chat.isGroupChat
    ? chat.chatName
    : otherUser?.username || chat.chatName || "Unknown";

  const senderPrefix = latestMsg?.sender?.username
    ? chat?.latestMessage?.sender._id === user._id
      ? "You: "
      : chat?.isGroupChat
        ? `${chat?.latestMessage?.sender.username}: `
        : ""
    : "";

  const preview = chat?.latestMessage
    ? `${senderPrefix}${chat?.latestMessage?.content.slice(0, 40)}${
        chat?.latestMessage?.content.length > 40 ? "..." : ""
      }`
    : "No messages yet";

  return (
    <button
      onClick={() => setSelectedChat(chat)}
      className={`group w-full flex items-center gap-4 px-3 rounded-2xl text-left py-2.5
    transition-all duration-300 border cursor-pointer ${
      isSelected
        ? "bg-gradient-to-r from-violet-600 to-fuchsia-600/60 border-violet-400/60 shadow-lg shadow-violet-500/30"
        : "bg-slate-900/60 border-slate-700 hover:border-violet-500 hover:bg-slate-800/80 hover:shadow-md hover:shadow-violet-500/20"
    }`}
    >
      <div className="relative h-10 w-10 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-md shadow-violet-500/30">
        {otherUser?.pic ? (
          <img
            src={otherUser.pic}
            alt={otherUser.username}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-white font-bold text-lg">
            {grpName?.[0]?.toUpperCase()}
          </span>
        )}

        {isOnline && (
          <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p
            className={`font-semibold truncate ${
              isSelected ? "text-white" : "text-slate-100"
            }`}
          >
            {grpName}
          </p>

          {chat.unreadCount > 0 && (
            <span
              className={`
        min-w-5 h-5 px-1
        rounded-full
        flex items-center justify-center
        text-[11px] font-semibold
        ${isSelected ? "bg-white text-violet-600" : "bg-fuchsia-500 text-white"}
      `}
            >
              {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-1">
          <p
            className={`text-sm truncate ${
              isSelected
                ? "text-violet-100"
                : chat.unreadCount > 0
                  ? "text-white font-medium"
                  : "text-slate-400"
            }`}
          >
            {preview}
          </p>
        </div>
      </div>
    </button>
  );
};

export default MySingleChat;
