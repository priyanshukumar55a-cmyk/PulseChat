import { Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./Pages/Navbar";
import Background from "./Pages/Background";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import ChatProvider from "./context/chatProvider";
import SocketProvider from "./context/SocketProvider";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const updateViewport = () => {
      document.documentElement.style.setProperty(
        "--vvh",
        `${window.visualViewport?.height || window.innerHeight}px`,
      );
    };

    updateViewport();

    window.visualViewport?.addEventListener("resize", updateViewport);

    return () => {
      window.visualViewport?.removeEventListener("resize", updateViewport);
    };
  }, []);

  return (
    <AuthProvider>
      <SocketProvider>
        <ChatProvider>
          <Toaster richColors position="top-right" />
          <Background />
          <Navbar />
          <Outlet /> 
        </ChatProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
