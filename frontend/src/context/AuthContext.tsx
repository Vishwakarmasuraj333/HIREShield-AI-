"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types";
import { api } from "../lib/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const currentUser = await api.getMe();
      setUser(currentUser);
      localStorage.setItem("hireshield_user", JSON.stringify(currentUser));
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("hireshield_user");
    const token = localStorage.getItem("hireshield_token");

    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        // Fallback
      }
      refreshUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token: string, newUser: User) => {
    api.setToken(token);
    setUser(newUser);
    localStorage.setItem("hireshield_user", JSON.stringify(newUser));
  };

  const logout = () => {
    api.removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === "ADMIN",
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
