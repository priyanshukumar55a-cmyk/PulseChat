import { useState } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `transition-all duration-300 hover:text-white hover:-translate-y-0.5 ${
      isActive ? "text-white font-semibold" : "text-white/80"
    }`;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg">
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
        <div className="md:hidden bg-black/40 backdrop-blur-xl border-t border-white/10">
          <div className="flex flex-col px-6 py-5 gap-4">
            <NavLink
              to="/"
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition"
            >
              Home
            </NavLink>

            <a
              href="#features"
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition"
            >
              Features
            </a>

            <a
              href="#technology"
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition"
            >
              Technology
            </a>

            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition"
            >
              Contact
            </a>

            <div className="flex flex-col gap-3 pt-2">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-xl border border-white/20 text-white text-center hover:bg-white/10 transition"
              >
                Login
              </Link>

              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center shadow-lg"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
