import { createContext } from "react";
import { useContext, useState } from "react";

const ChatContext = createContext();

const ChatProvider = ({ Children }) => {

  return <ChatContext.Provider value={{}}>{Children}</ChatContext.Provider>;
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
