import api from "@/api/axios";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("userInfo");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (userData) => {
    localStorage.setItem("userInfo", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
      setUser(null);
      toast.success("Logged out successfully!")
  };

  useEffect(() => {
    const verifyUser = async () => {
      try {
        await api.get("/user/profile", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
      } catch (error) {
        logout();
      } finally {
        setLoading(false)
      }
    };

    if (user?.token) {
      verifyUser();
    } else {
      setLoading(false)
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
