import { useAuth } from "@/context/AuthContext";
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

const HomePage = () => {
  const { loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast.message("Please login to continue");
    }
  }, [loading, isAuthenticated]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold">PulseChat</h1>
          <p className="mt-4 text-xl text-white/80">Feel Every Conversation</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
