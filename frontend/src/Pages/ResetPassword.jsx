import React from "react";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle2, Circle, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;
  
  const [loading, setLoading] = useState(false);

  const isPasswordValid =
    password.length >= 8 &&
    /\d/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password) &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password);

  const canSubmit = isPasswordValid && password === confirmPassword && !loading;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password != confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);

      const { data } = await api.post(`/user/reset-password/${token}`, {
        password,
      });

      toast.success(data?.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
    };
    
    const checks = [
      {
        label: "At least 8 characters",
        valid: password.length >= 8,
      },
      {
        label: "Contains a number",
        valid: /\d/.test(password),
      },
      {
        label: "Contains a special character",
        valid: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      },
      {
        label: "Contains uppercase letter",
        valid: /[A-Z]/.test(password),
      },
      {
        label: "Contains lowercase letter",
        valid: /[a-z]/.test(password),
      },
    ];

  return (
    <div className="min-h-[calc(100dvh)] mt-8 flex items-center justify-center px-4 py-8 bg-muted/10">
      <Card className="w-full max-w-lg shadow-xl bg-white">
        <CardContent className="px-4 py-2 md:px-6 md:py-2">
          <div className="flex flex-col items-center gap-4">
            <div className="h-14 w-14 md:h-16 md:w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-8 w-8 text-primary" />
            </div>

            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold">Reset Password</h1>

              <p className="text-muted-foreground mt-2">
                Enter your new password below.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 mt-8">
            <div className="space-y-2">
              <Label>New Password</Label>

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  disabled={loading}
                  className={"border-violet-300"}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Confirm Password</Label>

              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  disabled={loading}
                  className={"border-violet-300"}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {confirmPassword && (
                <p
                  className={`text-sm ${
                    passwordsMatch ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {passwordsMatch
                    ? "Passwords match"
                    : "Passwords do not match"}
                </p>
              )}
            </div>

            <div className="rounded-lg border p-2 md:p-4 space-y-2 border-gray-300 mb-2">
              {checks.map((check) => (
                <div
                  key={check.label}
                  className={`flex items-center gap-2 text-sm ${
                    check.valid ? "text-green-600" : "text-muted-foreground"
                  }`}
                >
                  {check.valid ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <Circle size={16} />
                  )}
                  {check.label}
                </div>
              ))}
            </div>

            <Button className="w-full h-9" disabled={!canSubmit}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>

          <div className="mt-3 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
