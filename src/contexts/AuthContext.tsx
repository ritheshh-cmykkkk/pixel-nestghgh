import React, { createContext, useContext, useState, useEffect } from "react";
import { apiClient } from "@/lib/api";

export type UserRole = "admin" | "owner" | "worker";

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasAccess: (requiredRoles: UserRole[]) => boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Role permissions mapping
const rolePermissions: Record<UserRole, UserRole[]> = {
  admin: ["admin", "owner", "worker"], // Admin can access everything
  owner: ["owner", "worker"], // Owner can access owner and worker features
  worker: ["worker"], // Worker can only access worker features
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const savedUser = localStorage.getItem("expenso_user");
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          // Verify with backend
          try {
            const currentUser = await apiClient.getCurrentUser();
            setUser(currentUser);
          } catch (error) {
            // Fallback to saved user if backend is not available
            setUser(parsedUser);
          }
        } catch (error) {
          localStorage.removeItem("expenso_user");
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Try backend authentication first
      const response = await apiClient.login(email, password);
      const userData: User = {
        id: response.id || response.user?.id,
        email: response.email || response.user?.email,
        name: response.name || response.user?.name,
        role: response.role || response.user?.role,
      };

      setUser(userData);
      localStorage.setItem("expenso_user", JSON.stringify(userData));
      setLoading(false);
      return true;
    } catch (error) {
      // Fallback to local authentication if backend is not available
      console.warn("Backend login failed, using local auth:", error);

      // Auto-detect role based on email
      let role: UserRole = "worker"; // default
      if (email.includes("admin")) role = "admin";
      else if (email.includes("owner")) role = "owner";

      const fixedUsers = {
        admin: {
          id: "ADM001",
          email: "admin@expenso.com",
          name: "System Admin",
        },
        owner: { id: "OWN001", email: "owner@expenso.com", name: "Shop Owner" },
        worker: {
          id: "WRK001",
          email: "worker@expenso.com",
          name: "Shop Worker",
        },
      };

      if (email && password) {
        const mockUser: User = {
          ...fixedUsers[role],
          role,
        };

        setUser(mockUser);
        localStorage.setItem("expenso_user", JSON.stringify(mockUser));
        setLoading(false);
        return true;
      }

      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("expenso_user");
  };

  const hasAccess = (requiredRoles: UserRole[]): boolean => {
    if (!user) return false;
    const userPermissions = rolePermissions[user.role];
    return requiredRoles.some((role) => userPermissions.includes(role));
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    hasAccess,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
