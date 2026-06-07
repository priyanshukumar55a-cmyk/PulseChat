import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, MessageCircle } from "lucide-react";
import { Form, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import axios from "axios";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password:"",
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit clicked");
  
      try {
        const res = await axios.post("http://localhost:3001/api/user/login", {
          email: formData.email,
          password: formData.password,
        });
        
        toast.success("Login Successfull")
        console.log(res.data);
      } catch (err) {
        toast.error("Error Occured!");
        console.error(err.response?.data || err.message);
      }
    };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 pt-25 pb-10">
      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-2xl  border border-white/20 rounded-3xl p-8 shadow-2xl ">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>

            <h1 className="mt-4 text-3xl font-bold text-white">Welcome Back</h1>

            <p className="text-white/75 mt-2 text-center">
              Sign in to continue your conversations
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm text-white/80 mb-2">Email</label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />

                <input
                  required
                  name="email"
                  onChange={handleChange}
                  value={formData.email}
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/60 outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/60 outline-none focus:ring-2 focus:ring-indigo-500"
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
              className="
                w-full
                py-3
                rounded-xl
                bg-gradient-to-r
                from-indigo-500
                to-purple-600
                text-white
                font-semibold
                hover:scale-[1.02]
                hover:shadow-[0_0_25px_rgba(139,92,246,0.5)]
                transition-all
                duration-300
              "
            >
              Sign In
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
              className="
                w-full
                py-3
                rounded-xl
                bg-white/10
                border
                border-white/20
                text-white
                hover:bg-white/15
                transition
                hover:cursor-pointer
                flex
                items-center
                justify-center
                gap-2
              "
            >
              <FcGoogle className="w-5 h-5" />
              Continue with Google
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-white/70 mt-6">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline"
            >
              Sign Up
            </Link>
          </p>
          <p className="text-white/50 text-sm text-center mt-4">
            Secure • Real-time • End-to-End Conversations
          </p>
        </div>
      </div>
    </div>
  );
}
