import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return toast.error("Please enter your email");
    }

    try {
      setLoading(true);

      const { data } = await api.post("/user/forgot-password", {
        email,
      });

      toast.success(data.message);
      setEmailSent(true);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send reset email",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="pt-8">
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-8 w-8 text-primary" />
            </div>

            <div className="text-center">
              <h1 className="text-3xl font-bold">Forgot Password?</h1>

              <p className="text-muted-foreground mt-2">
                Enter your email address and we'll send you a password reset
                link.
              </p>
            </div>
          </div>

          {!emailSent ? (
            <form onSubmit={handleSubmit} className="space-y-5 mt-8">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>

                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <Button className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          ) : (
            <div className="mt-8 rounded-lg border p-4 text-center">
              <p className="text-sm text-muted-foreground">
                If an account exists with{" "}
                <span className="font-medium text-foreground">{email}</span>, a
                password reset link has been sent.
              </p>
            </div>
          )}

          <div className="mt-6 text-center">
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

export default ForgotPassword;
