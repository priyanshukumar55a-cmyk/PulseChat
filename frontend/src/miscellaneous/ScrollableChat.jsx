import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import defaultAvatar from "@/assets/default-avatar.png";

const ScrollableChat = ({ messages }) => {
  const { user } = useAuth();

  return (
    <>
      {messages &&
        messages.map((m, i) => {
          const isSender = m.sender._id === user._id;
          const shouldShowAvatar =
            !isSender &&
            (i === messages.length - 1 ||
              messages[i + 1]?.sender?._id !== m.sender._id);
          const sameSenderAsPrev =
            i > 0 && messages[i - 1].sender._id === m.sender._id;
          const isLastInGroup =
            i === messages.length - 1 ||
            messages[i + 1].sender._id !== m.sender._id;
          const formatTime = (timestamp) => {
            return new Date(timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
          };

          return (
            <div
              key={m._id}
              className={`flex ${isSender ? "justify-end" : "justify-start"} mb-1`}
            >
              {!isSender && (
                <div
                  className={`${shouldShowAvatar && "w-10"} flex justify-center ${sameSenderAsPrev ? "pt-2" : "pt-4"}`}
                >
                  {shouldShowAvatar && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={m.sender?.pic || defaultAvatar} />
                      <AvatarFallback>
                        {m.sender?.username?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              )}

              <div
                className={`flex flex-col ${
                  isSender ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`px-4 py-2 max-w-xs md:max-w-md break-words rounded-lg ${
                    sameSenderAsPrev ? "mt-1" : "mt-3"
                  } ${
                    isSender
                      ? "bg-yellow-300 text-black rounded-br-sm"
                      : "bg-green-600 text-white rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </div>

                {isLastInGroup && (
                  <span className="text-xs mt-1 opacity-70 px-1">
                    {formatTime(m.createdAt)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
    </>
  );
};

export default ScrollableChat;
