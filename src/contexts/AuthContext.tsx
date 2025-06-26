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
  login: (username: string, password: string) => Promise<boolean>;
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
      const savedUser = localStorage.getItem("callmemobiles_user");
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
          localStorage.removeItem("callmemobiles_user");
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    setLoading(true);
    try {
      // Try backend authentication first
      const response = await apiClient.login(username, password);
      const userData: User = {
        id: response.id || response.user?.id,
        email: response.email || response.user?.email,
        name: response.name || response.user?.name,
        role: response.role || response.user?.role,
      };

      setUser(userData);
      localStorage.setItem("callmemobiles_user", JSON.stringify(userData));
      setLoading(false);
      return true;
    } catch (error) {
      // Fallback to local authentication with fixed usernames
      console.warn("Backend login failed, using local auth:", error);

      // Fixed usernames and credentials
      const fixedUsers = {
        admin: {
          id: "ADMIN001",
          email: "admin@callmemobiles.com",
          name: "System Administrator",
          username: "admin",
          password: "admin123",
        },
        owner: {
          id: "OWNER001",
          email: "owner@callmemobiles.com",
          name: "Shop Owner",
          username: "owner",
          password: "owner123",
        },
        worker: {
          id: "WORKER001",
          email: "worker@callmemobiles.com",
          name: "Shop Worker",
          username: "worker",
          password: "worker123",
        },
      };

      // Check if username and password match any fixed user
      const userEntry = Object.entries(fixedUsers).find(
        ([role, user]) =>
          user.username === username.toLowerCase() &&
          user.password === password,
      );

      if (userEntry) {
        const [role, userInfo] = userEntry;
        const mockUser: User = {
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.name,
          role: role as UserRole,
        };

        setUser(mockUser);
        localStorage.setItem("callmemobiles_user", JSON.stringify(mockUser));
        setLoading(false);
        return true;
      }

      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("callmemobiles_user");
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
