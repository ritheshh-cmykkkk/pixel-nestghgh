import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "admin" | "owner" | "worker";

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasAccess: (requiredRoles: UserRole[]) => boolean;
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

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("expenso_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem("expenso_user");
      }
    }
  }, []);

  const login = async (
    email: string,
    password: string,
    role: UserRole,
  ): Promise<boolean> => {
    // Fixed user credentials - users cannot change these
    const fixedUsers = {
      admin: { id: "ADM001", email: "admin@expenso.com", name: "System Admin" },
      owner: { id: "OWN001", email: "owner@expenso.com", name: "Shop Owner" },
      worker: {
        id: "WRK001",
        email: "worker@expenso.com",
        name: "Shop Worker",
      },
    };

    // Simple authentication - in production, this would be more secure
    if (email && password && fixedUsers[role]) {
      const mockUser: User = {
        ...fixedUsers[role],
        role,
      };

      setUser(mockUser);
      localStorage.setItem("expenso_user", JSON.stringify(mockUser));
      return true;
    }
    return false;
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
