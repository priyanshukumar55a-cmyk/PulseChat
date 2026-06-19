import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const ENDPOINT = "http://localhost:3001";

const MySingleChat = ({ chat, user, isSelected, setSelectedChat }) => {
  const [latestMsg, setLatestMsg] = useState(chat.latestMessage);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => setLatestMsg(chat.latestMessage), [chat.latestMessage]);

  const otherUser =
    !chat.isGroupChat && chat.users?.find((u) => u._id !== user?._id);

  const grpName = chat.isGroupChat
    ? chat.chatName
    : otherUser?.username || chat.chatName || "Unknown";

  const preview = latestMsg
    ? `${latestMsg.sender?.username ? (latestMsg.sender._id != user._id ? "user" : "you") + ": " : ""}${latestMsg.content.slice(0, 40)}${
        latestMsg.content.length > 40 ? "..." : ""
      }`
    : "No messages yet";

  const showUnread =
    latestMsg && latestMsg.sender && latestMsg.sender._id !== user?._id;

  // listen for active users from socket server to determine online status
  useEffect(() => {
    if (!otherUser) return;

    const socket = io(ENDPOINT, { transports: ["websocket"] });

    socket.emit("setup", user);

    const handleActive = (activeList) => {
      if (!Array.isArray(activeList)) return;
      setIsOnline(activeList.includes(otherUser._id));
    };

    socket.on("active users", handleActive);

    // optionally request current active users (server broadcasts on setup)

    return () => {
      socket.off("active users", handleActive);
      socket.disconnect();
    };
  }, [otherUser, user]);

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
        </div>

        <div className="flex items-center gap-2 mt-1">
          <p
            className={`text-sm truncate ${
              isSelected ? "text-violet-100" : "text-slate-400"
            }`}
          >
            {preview}
          </p>

          {showUnread && (
            <span className="ml-auto h-3 w-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/60 animate-pulse" />
          )}
        </div>
      </div>
    </button>
  );
};

export default MySingleChat;
