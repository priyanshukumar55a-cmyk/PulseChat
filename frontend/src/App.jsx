import { Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./Pages/Navbar";
import Background from "./Pages/Background";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <div className="App min-h-screen bg-cover bg-center bg-no-repeat">
        <Toaster richColors position="top-right" />
        <Background />
        <Navbar />
          <Outlet />
      </div>
    </AuthProvider>
  );
}

export default App;
