import { useAuth } from "@/context/AuthContext";
import ChatBox from "@/miscellaneous/ChatBox";
import Mychats from "@/miscellaneous/Mychats";
import SideDrawer from "@/miscellaneous/SideDrawer";
import React, { useEffect } from "react";

const ChatPage = () => {
  const { user } = useAuth();

  return <div style={{ width: "100%" }}>
    {user && <SideDrawer/>}
    <div className="flex justify-between w-full h-full p-10">
      {user && <Mychats/>}
      {user && <ChatBox/>}
    </div>
  </div>;
};

export default ChatPage;
