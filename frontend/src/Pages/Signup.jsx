import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, MessageCircle } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "sonner";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3001/api/user/register", {
        username: formData.name,
        email: formData.email,
        password: formData.password,
      });
      
      toast.success("Registration Successfull")
      console.log(res.data);
    } catch (err) {
      toast.error("Error Occured!");
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 pt-24 pb-10">
      <div className="relative z-10 w-full max-w-md">
        <div
          className="
          backdrop-blur-2xl
          border border-white/20
          rounded-3xl
          p-8
          shadow-[0_0_40px_rgba(139,92,246,0.25)]
        "
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="
              p-3 rounded-2xl
              bg-gradient-to-r
              from-indigo-500
              to-purple-600
              hover:rotate-12
              transition-all duration-300
            "
            >
              <MessageCircle className="w-8 h-8 text-white" />
            </div>

            <h1 className="mt-4 text-3xl font-bold text-white">
              Create Account
            </h1>

            <p className="text-white/75 mt-2 text-center">
              Join PulseChat and start connecting instantly
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <label className="block text-sm text-white mb-2">Full Name</label>

              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />

                <input
                  required
                  type="text"
                  placeholder="Enter your name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="
                    w-full
                    pl-12 pr-4 py-3
                    rounded-xl
                    bg-white/10
                    border border-white/20
                    text-white
                    placeholder:text-white/60
                    outline-none
                    focus:ring-2
                    focus:ring-indigo-500
                  "
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-white/80 mb-2">Email</label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />

                <input
                  required
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="
                    w-full
                    pl-12 pr-4 py-3
                    rounded-xl
                    bg-white/10
                    border border-white/20
                    text-white
                    placeholder:text-white/60
                    outline-none
                    focus:ring-2
                    focus:ring-indigo-500
                  "
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
                  className="
                    w-full
                    pl-12 pr-12 py-3
                    rounded-xl
                    bg-white/10
                    border border-white/20
                    text-white
                    placeholder:text-white/60
                    outline-none
                    focus:ring-2
                    focus:ring-indigo-500
                  "
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
                  className="
                    w-full
                    pl-12 pr-12 py-3
                    rounded-xl
                    bg-white/10
                    border border-white/20
                    text-white
                    placeholder:text-white/60
                    outline-none
                    focus:ring-2
                    focus:ring-indigo-500
                  "
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
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2 text-sm text-white/70 hover:cursor-pointer">
              <input required type="checkbox" className="mt-1 accent-indigo-500" />

              <span>
                I agree to the{" "}
                <button
                  type="button"
                  className="text-indigo-600 hover:text-indigo-300"
                >
                  Terms of Service
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  className="text-indigo-600 hover:text-indigo-300"
                >
                  Privacy Policy
                </button>
              </span>
            </label>

            {/* Signup Button */}
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
                hover:cursor-pointer
              "
            >
              Create Account
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-white/20" />
              <span className="text-white/50 text-sm">or</span>
              <div className="h-px flex-1 bg-white/20" />
            </div>

            {/* Google Signup */}
            <button
              type="button"
              className="
                w-full
                py-3
                rounded-xl
                bg-white/10
                border border-white/20
                text-white
                flex items-center justify-center gap-3
                hover:bg-white/15
                transition-all duration-300
                hover:cursor-pointer
              "
            >
              <FcGoogle className="text-xl" />
              Continue with Google
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-white/70 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline"
            >
              Sign In
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
