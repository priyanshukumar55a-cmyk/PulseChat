import React from "react";
import { isLastMessage, isSameSender } from "./ChatLogics";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import defaultAvatar from "@/assets/default-avatar.png";

const ScrollableChat = ({ messages }) => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-2 p-3 overflow-y-auto">
      {messages &&
        messages.map((m, i) => {
          const isSender = m.sender._id === user._id;
          const showAvatar =
            isSameSender(messages, m, i, user._id) ||
            isLastMessage(messages, i, user);

          return (
            <div
              className={`flex items-end ${isSender ? "justify-end" : "justify-start"}`}
              key={m._id}
            >
              {/* Avatar on left for received, on right for sent */}
              {!isSender && showAvatar && (
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={m.sender?.pic || defaultAvatar} />
                  <AvatarFallback>
                    {m.sender?.username?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`px-4 py-2 m-1 max-w-[70%] break-words shadow-sm rounded-lg ${
                  isSender
                    ? "bg-yellow-300 text-black rounded-br-none"
                    : "bg-green-600 text-white rounded-bl-none"
                }`}
              >
                {m.content}
              </div>

              {isSender && showAvatar && (
                <Avatar className="h-8 w-8 ml-2">
                  <AvatarImage src={m.sender?.pic || defaultAvatar} />
                  <AvatarFallback>
                    {m.sender?.username?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default ScrollableChat;
