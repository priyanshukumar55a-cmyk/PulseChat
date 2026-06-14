import { useState, useRef } from "react";
import { Menu, X, MessageCircle, Search } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import SearchBox from "@/components/navbar/SearchBox";
import ProfileMenu from "@/components/navbar/ProfileMenu";
import Notifications from "@/components/navbar/Notifications";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/30 backdrop-blur-2xl border-b border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
        <div className="grid md:h-16 h-14 grid-cols-[auto_1fr_auto] items-center gap-6">
          {/* Logo */}
          <Link
            to="/"
            className="group flex items-center gap-3 justify-self-start"
          >
            <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg transition-all duration-300 group-hover:scale-105">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>

            <span className="text-xl lg:text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              PulseChat
            </span>
          </Link>

          {/* Search */}
          <div className="hidden sm:flex justify-center w-full">
            {isAuthenticated && (
              <div className="w-full max-w-xl">
                <SearchBox />
              </div>
            )}
          </div>

          {/* Right Section */}
          <div className="items-center justify-self-end gap-3">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-all duration-300"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3 px-3 py-1.5 md:ml-0 ml-10">
                <Notifications />
                <ProfileMenu />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
