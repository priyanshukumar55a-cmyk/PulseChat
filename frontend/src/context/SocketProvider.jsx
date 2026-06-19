import React, { createContext,useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext';
import { io } from 'socket.io-client';

const SocketContext = createContext();
const ENDPOINT = "http://localhost:3001";

export const SocketProvider = ({ children }) => {
    const { user } = useAuth()
    const [socket, setSocket] = useState(null)

    useEffect(() => {
        if (!user) return;

        const newSocket = io(ENDPOINT);
        newSocket.on("connect", () => {
          newSocket.emit("setup", user);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
            setSocket(null)
        };
    },[user])
  return (
      <SocketContext.Provider value={{socket}}>{ children}</SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext);

export default SocketProvider