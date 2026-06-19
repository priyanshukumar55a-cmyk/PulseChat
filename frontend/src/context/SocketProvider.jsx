import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { io } from "socket.io-client";

const SocketContext = createContext();
const ENDPOINT = "http://localhost:3001";

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    if (!user) return;

    const newSocket = io(ENDPOINT);
    newSocket.on("connect", () => {
      setConnected(true);
      newSocket.emit("setup", user);
    });

    newSocket.on("disconnect", () => {
      setConnected(false);
    });

    newSocket.on("active users", (users) => {
      setActiveUsers(users);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      setConnected(false);
      setActiveUsers([]);
      setSocket(null);
    };
  }, [user]);
  return (
    <SocketContext.Provider value={{ socket, connected, activeUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

export default SocketProvider;
