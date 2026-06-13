import { Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./Pages/Navbar";
import Background from "./Pages/Background";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import ChatProvider from "./context/chatProvider";

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <Toaster richColors position="top-right" />
        <Background />
        <Navbar />
        <Outlet />
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
