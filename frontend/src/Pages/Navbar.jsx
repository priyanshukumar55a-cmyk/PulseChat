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
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg hover:rotate-12 hover:shadow-[0_0_20px_rgba(139,92,246,0.6)] transition-all duration-300 ">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>

            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              PulseChat
            </span>
          </Link>

          {/* Search (authenticated only) */}
          {isAuthenticated && <SearchBox />}

          {/* Desktop Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-xl border border-white/20 text-white hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-300"
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
              <div className="flex items-center gap-3">
                <Notifications />
                <ProfileMenu />
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="sm:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-700/20 backdrop-blur-xl border-t border-white/10">
          <div className="flex flex-col px-6 py-5 gap-4 text-center">
            <NavLink
              to="/"
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition font-medium"
            >
              Home
            </NavLink>

            {isAuthenticated && (
              <>
                <Link
                  to="/chats"
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition font-medium"
                >
                  Chats
                </Link>

                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition font-medium"
                >
                  Profile
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition font-medium"
                >
                  Settings
                </Link>
              </>
            )}

            <div className="flex flex-col gap-3 pt-2">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="px-5 py-2 rounded-xl border border-white/20 text-white hover:bg-white/10 hover:border-indigo-400/50 transition-all duration-300 text-center shadow-lg"
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center shadow-lg"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="px-5 py-2 rounded-xl border border-white/20 text-white hover:bg-white/10 hover:border-indigo-400/50 transition-all duration-300 text-center shadow-lg"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
