import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import defaultAvatar from "@/assets/default-avatar.png";

const ScrollableChat = ({ messages }) => {
  const { user } = useAuth();
  const shouldShowDate = (messages, i) => {
    if (i === 0) return true;

    const currentDate = new Date(messages[i].createdAt).toDateString();
    const previousDate = new Date(messages[i - 1].createdAt).toDateString();

    return currentDate !== previousDate;
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "today";
    if (date.toDateString() === yesterday.toDateString()) return "yesterday";

    return new Date(timestamp).toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

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

          return (
            <React.Fragment key={m._id}>
              {shouldShowDate(messages, i) && (
                <div className="flex justify-center my-3">
                  <span className="bg-muted px-3 py-1 rounded-full text-sm opacity-80">
                    {formatDate(m.createdAt)}
                  </span>
                </div>
              )}
              <div
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
            </React.Fragment>
          );
        })}
    </>
  );
};

export default ScrollableChat;
