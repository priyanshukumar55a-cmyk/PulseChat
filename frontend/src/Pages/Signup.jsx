import { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, User, MessageCircle, Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

export default function Signup() {
  const navigate = useNavigate();
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const password = formData.password;
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&]/.test(password),
  };

  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const nameRegex = /^[A-Za-z ]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nameRegex.test(formData.name)) {
      toast.error("Name can only contain letters");
      return;
    }

    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3001/api/user/register", {
        username: formData.name,
        email: formData.email,
        password: formData.password,
      });

      toast.success("Registration Successfull!");
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      toast.error("Error Occured!");
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="relative flex items-center justify-center px-4 py-6 mt-16 min-h-[calc(100vh-4rem)]">
      <div className="relative z-10 w-full max-w-3xl px-4">
        <div
          className={
            "backdrop-blur-2xl border border-white/20 rounded-3xl p-6 md:p-8 shadow-[0_0_40px_rgba(139,92,246,0.25)] max-h-[calc(100vh-6rem)]"
          }
        >
          <div className="overflow-auto max-h-[calc(100vh-9rem)] pr-2 scrollbar-none">
            {/* Logo */}
            <div className="flex flex-col items-center mb-6">
              <div className="p-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>

              <h1 className="mt-3 text-2xl font-bold text-white">
                Create Account
              </h1>

              <p className="text-white/75 mt-1 text-center text-sm">
                Join PulseChat and start connecting
              </p>
            </div>

            <form
              className="grid gap-4 md:grid-cols-2 md:gap-5"
              onSubmit={handleSubmit}
            >
              {/* Name */}
              <div>
                <label className="block text-sm text-white mb-2">
                  Full Name
                </label>

                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />

                  <input
                    required
                    type="text"
                    placeholder="Enter your name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/60 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm text-white/80 mb-2">
                  Email
                </label>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />

                  <input
                    required
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
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
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-10 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/60 outline-none focus:ring-2 focus:ring-indigo-500"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="md:col-span-2 mt-3 grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                <p
                  className={
                    passwordChecks.length ? "text-green-400" : "text-red-400"
                  }
                >
                  {passwordChecks.length ? "✓" : "✗"} 8+ chars
                </p>
                <p
                  className={
                    passwordChecks.uppercase ? "text-green-400" : "text-red-400"
                  }
                >
                  {passwordChecks.uppercase ? "✓" : "✗"} Uppercase
                </p>
                <p
                  className={
                    passwordChecks.lowercase ? "text-green-400" : "text-red-400"
                  }
                >
                  {passwordChecks.lowercase ? "✓" : "✗"} Lowercase
                </p>
                <p
                  className={
                    passwordChecks.number ? "text-green-400" : "text-red-400"
                  }
                >
                  {passwordChecks.number ? "✓" : "✗"} Number
                </p>
                <p
                  className={
                    passwordChecks.special ? "text-green-400" : "text-red-400"
                  }
                >
                  {passwordChecks.special ? "✓" : "✗"} Special
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm text-white mb-2">
                  Confirm Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />

                  <input
                    required
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-12 pr-10 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/60 outline-none focus:ring-2 focus:ring-indigo-500"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <div className="mt-2 text-xs">
                  <p
                    className={
                      password && password === formData.confirmPassword
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {password && password === formData.confirmPassword
                      ? "✓"
                      : "✗"}{" "}
                    Passwords match
                  </p>
                </div>
              </div>

              {/* Signup Button */}
                <button
                  type="submit"
                  disabled={!isPasswordValid || loading}
                  className={`w-full md:col-span-2 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] transition-all duration-300 ${isPasswordValid ? "hover:scale-[1.02] hover:cursor-pointer" : " cursor-not-allowed opacity-60"}`}
                >
                {loading ? (
                  <div className="justify-center flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 md:col-span-2">
                <div className="h-px flex-1 bg-white/20" />
                <span className="text-white/50 text-sm">or</span>
                <div className="h-px flex-1 bg-white/20" />
              </div>

              {/* Google Signup */}
              <button
                type="button"
                className="w-full md:col-span-2 py-2 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center gap-3 hover:bg-white/15 transition-all duration-300 hover:cursor-pointer"
              >
                <FcGoogle className="text-xl" />
                Continue with Google
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-white/70 mt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline"
              >
                Sign In
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
