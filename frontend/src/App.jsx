import { Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./Pages/Navbar";
import Background from "./Pages/Background";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import ChatProvider from "./context/chatProvider";
import SocketProvider from "./context/SocketProvider";

function App() {
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
