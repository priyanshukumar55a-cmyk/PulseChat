import { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, MessageCircle } from "lucide-react";
import {  Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import axios from "axios";
import { Loader2 } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password:"",
  })
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
  
      try {
        const res = await axios.post("http://localhost:3001/api/user/login", {
          email: formData.email,
          password: formData.password,
        });

        toast.success("Login Successfull!");
        // Store token if using JWT
        localStorage.setItem("token", res.data.token);
        navigate("/");
        console.log(res.data);
      } catch (err) {
        toast.error("Error Occured!");
        console.error(err.response?.data || err.message);
      } finally {
        setLoading(false)
      }
    };

  return (
    <div className="relative flex items-center justify-center px-4 mt-16 min-h-[calc(100vh-4rem)] overflow-hidden">
      <div className="relative z-10 w-140 max-w-3xl px-4">
        <div className="backdrop-blur-2xl border border-white/20 rounded-3xl p-6 md:px-8 shadow-2xl max-h-[calc(100vh-6rem)]">
          <div className="overflow-y-auto max-h-[calc(100vh-9rem)] pr-2">
            {/* Logo */}
            <div className="flex flex-col items-center mb-6">
              <div className="p-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>

              <h1 className="mt-3 text-2xl font-bold text-white">
                Welcome Back
              </h1>

              <p className="text-white/75 mt-1 text-center text-sm">
                Sign in to continue your conversations
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm text-white/80 mb-2">
                  Email
                </label>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />

                  <input
                    required
                    name="email"
                    onChange={handleChange}
                    value={formData.email}
                    type="email"
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/60 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm text-white/80 mb-2">
                  Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />

                  <input
                    required
                    name="password"
                    onChange={handleChange}
                    value={formData.password}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-10 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/60 outline-none focus:ring-2 focus:ring-indigo-500"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-white/70 hover:cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-white/20 hover:cursor-pointer text-indigo-500 focus:ring-indigo-500"
                  />
                  Remember me
                </label>

                <button
                  type="button"
                  className="text-indigo-400 hover:text-indigo-300 font-medium hover:cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] transition-all duration-300"
              >
                {loading ? (
                  <div className="justify-center flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Signing In...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-white/20" />
                <span className="text-white/50 text-sm">or</span>
                <div className="h-px flex-1 bg-white/20" />
              </div>

              {/* Google Login */}
              <button
                type="button"
                className="w-full py-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/15 transition hover:cursor-pointer flex items-center justify-center gap-2"
              >
                <FcGoogle className="w-5 h-5" />
                Continue with Google
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-white/70 mt-4">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline"
              >
                Sign Up
              </Link>
            </p>
            <p className="text-white/50 text-sm text-center mt-3">
              Secure • Real-time • End-to-End Conversations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
