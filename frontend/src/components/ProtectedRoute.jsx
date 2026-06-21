import { useAuth } from "@/context/AuthContext";
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({children}) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
