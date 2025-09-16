"use client";

import {
  clearAuthData,
  getCurrentUser,
  setAuthToken,
  setUserData,
} from "@/lib/rbac-config/auth-local";
import { User } from "@/types/user.types";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User, token: string) => void; // Fixed: now accepts token
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Fix hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Only check auth on client-side after hydration
  useEffect(() => {
    if (!isClient) return;
    checkAuth();
  }, [isClient]);

  const checkAuth = async () => {
    try {
      console.log("🔍 AuthContext: Checking authentication...");

      // Debug localStorage state
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("auth-token")
          : null;
      const userData =
        typeof window !== "undefined"
          ? localStorage.getItem("user-data")
          : null;

      console.log("🔍 AuthContext: localStorage state", {
        hasToken: !!token,
        hasUserData: !!userData,
        tokenLength: token?.length,
        userDataLength: userData?.length,
      });

      const currentUser = await getCurrentUser();
      console.log("🔍 AuthContext: getCurrentUser result", {
        user: !!currentUser,
      });

      setUser(currentUser);
    } catch (error) {
      console.error("❌ AuthContext: Auth check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
      console.log("🔍 AuthContext: Auth check completed");
    }
  };

  // FIXED: Now properly handles both user and token
  const login = (userData: User, token: string) => {
    console.log("✅ AuthContext: Login called with:", {
      user: userData,
      hasToken: !!token,
      tokenLength: token?.length,
    });

    try {
      // Store in localStorage with error handling
      setAuthToken(token);
      setUserData(userData);

      // Verify storage immediately
      const storedToken = localStorage.getItem("auth-token");
      const storedData = localStorage.getItem("user-data");

      console.log("✅ AuthContext: Storage verification:", {
        tokenStored: !!storedToken,
        dataStored: !!storedData,
        tokensMatch: storedToken === token,
        dataMatches: storedData === JSON.stringify(userData),
      });

      setUser(userData);
    } catch (error) {
      console.error("❌ AuthContext: Login storage failed:", error);
    }
  };

  const logout = () => {
    console.log("🚪 AuthContext: Logout called");
    clearAuthData();
    setUser(null);
    window.location.replace("/login");
  };

  const refreshUser = async () => {
    console.log("🔄 AuthContext: Refreshing user...");
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  };

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
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
