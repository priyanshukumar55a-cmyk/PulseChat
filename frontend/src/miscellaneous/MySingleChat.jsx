import React from "react";

const MySingleChat = ({ chat, user, isSelected, setSelectedChat }) => {
  const otherUser =
    !chat.isGroupChat && chat.users?.find((u) => u._id !== user?._id);

  const grpName = chat.isGroupChat
    ? chat.chatName
    : otherUser?.username || chat.chatName || "Unknown";

  const latest = chat.latestMessage;

  const preview = latest
    ? `${latest.sender?.username ? latest.sender.username + ": " : ""}${latest.content}`
    : "No messages yet";

  const showUnread = latest && latest.sender && latest.sender._id !== user?._id;

  return (
    <button
      onClick={() => setSelectedChat(chat)}
      className={`group w-full flex items-center gap-4 p-3 rounded-2xl text-left
    transition-all duration-300 border ${
      isSelected
        ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 border-violet-400 shadow-lg shadow-violet-500/30 scale-[1.02]"
        : "bg-slate-900/60 border-slate-700 hover:border-violet-500 hover:bg-slate-800/80 hover:shadow-md hover:shadow-violet-500/20"
    }`}
    >
      <div className="h-12 w-12 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-md shadow-violet-500/30">
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
