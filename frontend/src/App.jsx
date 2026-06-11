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
        <div className="App h-[calc(100vh-5rem)] bg-cover bg-center bg-no-repeat">
          <Toaster richColors position="top-right" />
          <Background />
          <Navbar />
          <Outlet />
        </div>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
