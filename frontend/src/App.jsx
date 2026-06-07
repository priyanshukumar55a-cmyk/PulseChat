import { Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./Pages/Navbar";
import Background from "./Pages/Background";

function App() {
  return (
    <div className="App min-h-screen bg-cover bg-center bg-no-repeat">
      <Background />
      <Navbar />
      <div className="">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
