"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

// Create axios instance with proper configuration
const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  withCredentials: true,
});

interface User {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
  user_id: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (email: string, password: string, fullName: string) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser(token);
    }
  }, []);

  const fetchUser = async (token: string) => {
    try {
      const response = await api.get<User>("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error fetching user:", error);
      logout();
    }
  };

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);

      const response = await api.post<AuthResponse>("/api/auth/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const { access_token, user_id } = response.data;
      
      // Store token and update auth state
      localStorage.setItem("token", access_token);
      await fetchUser(access_token);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Login error details:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        throw new Error(error.response?.data?.detail || "Login failed");
      }
      throw error;
    }
  };

  const register = async (email: string, password: string, fullName: string): Promise<User> => {
    try {
      const response = await api.post<User>("/api/auth/register", {
        email,
        password,
        full_name: fullName,
      });

      // After registration, log the user in
      await login(email, password);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || error.message);
      }
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};