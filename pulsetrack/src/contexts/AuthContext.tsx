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

// Add response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Call refresh token endpoint with form data
        const formData = new URLSearchParams();
        formData.append("refresh_token", refreshToken);
        
        const response = await api.post("/api/v1/auth/refresh", formData.toString(), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });

        const { access_token, refresh_token } = response.data as AuthResponse;

        // Update tokens in localStorage
        localStorage.setItem("token", access_token);
        localStorage.setItem("refreshToken", refresh_token);

        // Update the failed request's authorization header
        if (originalRequest.headers) {
          originalRequest.headers["Authorization"] = `Bearer ${access_token}`;
        }

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh token fails, logout user
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Add request interceptor to add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

interface User {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user_id: number;
  redirect_url: string;
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
      const response = await api.get<User>("/api/v1/auth/me");
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error fetching user:", error);
      // Don't call logout here as the interceptor will handle it
    }
  };

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const formData = new URLSearchParams();
      formData.append("email", email);
      formData.append("password", password);

      const response = await api.post<AuthResponse>("/api/v1/auth/login", formData.toString(), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const { access_token, refresh_token, user_id } = response.data;
      
      // Store tokens and update auth state
      localStorage.setItem("token", access_token);
      localStorage.setItem("refreshToken", refresh_token);
      
      // Set auth state immediately
      setIsAuthenticated(true);
      
      // Fetch user data
      try {
        const userResponse = await api.get<User>("/api/v1/auth/me");
        setUser(userResponse.data);
      } catch (error) {
        console.error("Error fetching user after login:", error);
      }

      return response.data;
    } catch (error: any) {
      // Clear any existing tokens on error
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      setIsAuthenticated(false);
      setUser(null);
      
      if (error?.response) {
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
      const response = await api.post<User>("/api/v1/auth/register", {
        email,
        password,
        full_name: fullName,
      });

      // After registration, log the user in
      await login(email, password);

      return response.data;
    } catch (error: any) {
      if (error?.response) {
        throw new Error(error.response?.data?.detail || error.message);
      }
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
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