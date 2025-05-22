import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiRequest } from "@/lib/queryClient";
import { loginUser, registerUser, getCurrentUser } from "@/lib/auth";
import { queryClient } from "@/lib/queryClient";

interface User {
  id: number;
  uuid: string;
  username: string;
  email: string;
  name: string;
  profileImage?: string;
  role: string;
  location: string;
  visibility?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: any) => Promise<void>;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in (JWT in localStorage)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (token) {
          const userData = await getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        // Token is invalid or expired
        localStorage.removeItem("auth_token");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { user, token } = await loginUser(email, password);
      localStorage.setItem("auth_token", token);
      setUser(user);
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(
        error.message || "Login failed. Please check your credentials."
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
    // Clear all queries from the cache
    queryClient.clear();
  };

  const register = async (data: any) => {
    try {
      const { user, token } = await registerUser(data);
      localStorage.setItem("auth_token", token);
      setUser(user);
    } catch (error: any) {
      console.error("Registration error:", error);
      throw new Error(
        error.message || "Registration failed. Please try again."
      );
    }
  };

  const refreshUser = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error("Error refreshing user:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register, refreshUser, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
