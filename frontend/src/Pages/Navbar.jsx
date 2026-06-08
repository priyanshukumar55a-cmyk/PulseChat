import { useState } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout()
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `relative transition-all duration-300 hover:text-white
   ${isActive ? "text-white font-semibold" : "text-white/80"}`;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/30 backdrop-blur-2xl border-b border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div
              className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg hover:rotate-12 hover:shadow-[0_0_20px_rgba(139,92,246,0.6)] transition-all duration-300 "
            >
              <MessageCircle className="h-5 w-5 text-white" />
            </div>

            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              PulseChat
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>

            <a
              href="#features"
              className="text-white/80 hover:text-white hover:-translate-y-0.5 transition-all duration-300"
            >
              Features
            </a>

            <a
              href="#technology"
              className="text-white/80 hover:text-white hover:-translate-y-0.5 transition-all duration-300"
            >
              Technology
            </a>

            <a
              href="#contact"
              className="text-white/80 hover:text-white hover:-translate-y-0.5 transition-all duration-300"
            >
              Contact
            </a>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
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
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-all duration-300"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
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
            

            <a
              href="#features"
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition font-medium"
            >
              Features
            </a>

            <a
              href="#technology"
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition font-medium"
            >
              Technology
            </a>

            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition font-medium"
            >
              Contact
            </a>

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
