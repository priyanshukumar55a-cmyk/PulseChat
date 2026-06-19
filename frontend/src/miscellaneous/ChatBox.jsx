import { ChatState } from "@/context/chatProvider";
import { ArrowLeft, Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ConnectedProfileModel from "./ConnectedProfileModel";
import UpdateGrpChatModal from "./UpdateGrpChatModal";
import SingleChat from "./SingleChat";

import { io } from "socket.io-client";
const ENDPOINT = "http://localhost:3001";

const ChatBox = () => {
  const chatRef = useRef();
  const {  selectedChat, setSelectedChat } = ChatState();
  const { user } = useAuth();
  const [active, setActive] = useState(false);

  const otherUser =
    !selectedChat?.isGroupChat && selectedChat?.users?.find((u) => u._id !== user?._id);

  useEffect(() => {
    if (!otherUser) return;

    const socket = io(ENDPOINT, { transports: ["websocket"] });
    socket.emit("setup", user);

    const handleActive = (activeList) => {
      if (!Array.isArray(activeList)) return;
      setActive(activeList.includes(otherUser._id));
    };

    socket.on("active users", handleActive);

    // optionally request current active users (server broadcasts on setup)

    return () => {
      socket.off("active users", handleActive);
      socket.disconnect();
    };
  }, [otherUser, user]);

  return (
    <div className="h-full flex flex-col backdrop-blur-sm bg-white/5 border border-white/10 rounded-3xl">
      {selectedChat ? (
        <div className="flex-1 min-h-0 flex flex-col">
          <div className="border-b border-white/15 px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedChat(null)}
                className="md:hidden p-2 rounded-lg hover:bg-white/10 transition"
              >
                <ArrowLeft className="text-white" size={20} />
              </button>

              <div className="h-11 w-11 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">
                  {selectedChat?.isGroupChat
                    ? selectedChat.chatName?.[0]?.toUpperCase()
                    : otherUser?.username?.[0]?.toUpperCase()}
                </span>
              </div>

              <div className="min-w-0">
                <h2 className="font-semibold text-white text-lg md:text-xl truncate">
                  {selectedChat?.isGroupChat
                    ? selectedChat.chatName
                    : otherUser?.username}
                </h2>

                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      active ? "bg-green-500" : "bg-gray-500"
                    }`}
                  />
                  <p className="text-xs text-white/60">
                    {active ? "Active Now" : "Offline"}
                  </p>
                </div>
              </div>
              <div className="ml-auto">
                {!selectedChat?.isGroupChat ? (
                  <ConnectedProfileModel user={otherUser} />
                ) : (
                  <UpdateGrpChatModal
                    fetchMessages={() => chatRef.current?.fetchMessages()}
                  />
                )}
              </div>
            </div>
          </div>
          {/* messages here */}
          <div className="flex-1 min-h-0">
            <SingleChat ref={chatRef} />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mb-4 shadow-lg">
            <Send className="h-8 w-8 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">
            Welcome to PulseChat
          </h2>

          <p className="text-white/70 max-w-md">
            Select a chat from the sidebar to start messaging or create a new
            group to begin a conversation.
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
