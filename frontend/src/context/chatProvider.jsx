import { createContext, useEffect } from "react";
import { useContext, useState } from "react";
import { useSocket } from "./SocketProvider";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const { socket } = useSocket();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!socket) return;

    const handleMessageReceived = (newMessageReceived) => {
      setChats((prev) => {
        const updatedChat = prev.find(
          (chat) => chat._id === newMessageReceived.chat._id,
        );

        if (!updatedChat) return prev;

        const newChat = {
          ...updatedChat,
          latestMessage: newMessageReceived,
        };

        return [
          newChat,
          ...prev.filter((chat) => chat._id !== newMessageReceived.chat._id),
        ];
      })
      
      if (selectedChat && selectedChat._id === newMessageReceived.chat._id) {
        return;
      }

      setNotifications((prev) => {
        if (prev.some((msg) => msg._id === newMessageReceived._id)) return prev;

        return [newMessageReceived, ...prev];
      });
    };

    socket.on("message received", handleMessageReceived);

    return () => {
      socket.off("message received", handleMessageReceived);
    };
  }, [socket, selectedChat]);

  useEffect(() => {
    if (!selectedChat) return;

    setNotifications((prev) =>
      prev.filter((n) => n.chat._id !== selectedChat._id),
    );
  }, [selectedChat]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
