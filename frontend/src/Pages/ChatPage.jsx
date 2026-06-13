import { useAuth } from "@/context/AuthContext";
import { ChatState } from "@/context/chatProvider";
import ChatBox from "@/miscellaneous/ChatBox";
import Mychats from "@/miscellaneous/Mychats";
import React, { useEffect } from "react";

const ChatPage = () => {
  const { user } = useAuth();
  const { selectedChat } = ChatState();

  return (
    <div className="mt-18 h-[calc(100vh-5rem)] flex gap-3 px-3">
      {user && (
        <>
          {/* mobile */}
          <div className="md:hidden h-full w-full">
            {!selectedChat ? <Mychats /> : <ChatBox />}
          </div>

          {/* desktop */}
          <div className="hidden md:flex h-full gap-3 flex-1">
            <div className="w-[350px] lg:w-[400px] flex-shrink-0">
              <Mychats />
            </div>

            <div className="flex-1 min-w-0">
              <ChatBox />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatPage;
