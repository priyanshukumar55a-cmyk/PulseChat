import { useAuth } from "@/context/AuthContext";
import { ChatState } from "@/context/chatProvider";
import ChatBox from "@/miscellaneous/ChatBox";
import Mychats from "@/miscellaneous/Mychats";
import React from "react";

const ChatPage = () => {
  const { user } = useAuth();
  const { selectedChat } = ChatState();

  return (
    <div className="pt-14 md:pt-18 overflow-hidden">
      {user && (
        <>
          {/* mobile */}
          <div
            className="md:hidden min-h-0 w-full overflow-hidden scrollbar-none"
            style={{
              touchAction: "pan-y",
              height: "calc(var(--vvh) - 56px)", // 56px = h-14 navbar
            }}
          >
            {!selectedChat ? <Mychats /> : <ChatBox />}
          </div>

          {/* desktop */}
          <div
            className="hidden md:flex h-[calc(100vh-5rem)] w-full gap-3 px-3"
            style={{ touchAction: "pan-y" }}
          >
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
