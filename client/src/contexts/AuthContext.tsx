import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { loginUser, registerUser, getCurrentUser } from "@/lib/auth";
import { queryClient } from "@/lib/queryClient";
import { AUTH_TOKEN_KEY } from "@/lib/constants";

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

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in (JWT in localStorage)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        if (token) {
          const userData = await getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        // Token is invalid or expired
        localStorage.removeItem(AUTH_TOKEN_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { user, token } = await loginUser(email, password);
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      setUser(user);
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(
        error.message || "Login failed. Please check your credentials."
      );
    }
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setUser(null);
    // Clear all queries from the cache
    queryClient.clear();
  };

  const register = async (data: any) => {
    try {
      const { user, token } = await registerUser(data);
      localStorage.setItem(AUTH_TOKEN_KEY, token);
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
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
