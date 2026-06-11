import { useAuth } from "@/context/AuthContext";
import ChatBox from "@/miscellaneous/ChatBox";
import Mychats from "@/miscellaneous/Mychats";
import React, { useEffect } from "react";

const ChatPage = () => {
  const { user } = useAuth();

  return (
    <div className="mt-18 h-[calc(100vh-4.5rem)] flex gap-3 px-3">
      {user && (
        <>
          <div className="w-full md:w-[350px] lg:w-[400px] flex-shrink-0">
            <Mychats />
          </div>

          <div className="flex-1 min-w-0">
            <ChatBox />
          </div>
        </>
      )}
    </div>
  );
};

export default ChatPage;
