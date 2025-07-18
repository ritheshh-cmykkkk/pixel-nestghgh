import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

type Role = "admin" | "owner" | "worker" | "demo";

interface UseRoleReturn {
  role: Role;
  setRole: (role: Role) => void;
  isAdmin: boolean;
  isOwner: boolean;
  isWorker: boolean;
  isDemo: boolean;
  canDelete: (createdAt: string) => boolean;
  canAccess: (createdAt: string) => boolean;
  hasFullAccess: boolean;
  hasEditAccess: boolean;
}

export function useRole(): UseRoleReturn {
  const { user } = useAuth();
  const [role, setRoleState] = useState<Role>(() => {
    // Get role from authenticated user or fallback to localStorage for demo
    if (user?.role) {
      return user.role as Role;
    }
    const savedRole = localStorage.getItem("role") as Role;
    const validRoles: Role[] = ["admin", "owner", "worker", "demo"];
    return validRoles.includes(savedRole) ? savedRole : "demo";
  });

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    localStorage.setItem("role", newRole);
  };

  // Access control based on roles
  const canAccess = (createdAt: string): boolean => {
    // Full access roles
    if (role === "admin" || role === "owner") return true;

    // Demo has full access to all mock data for complete expo experience
    if (role === "demo") return true;

    // Worker has 24-hour access limit
    if (role === "worker") {
      const created = new Date(createdAt);
      const now = new Date();
      const hoursDiff = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
      return hoursDiff <= 24;
    }

    return false;
  };

  const canDelete = (createdAt: string): boolean => {
    // Full delete access
    if (role === "admin" || role === "owner") return true;

    // Demo can simulate delete operations for expo (with mock data)
    if (role === "demo") return true;

    // Worker has 24-hour delete limit
    if (role === "worker") {
      const created = new Date(createdAt);
      const now = new Date();
      const hoursDiff = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
      return hoursDiff <= 24;
    }

    return false;
  };

  useEffect(() => {
    // Update role when user changes
    if (user?.role) {
      setRoleState(user.role);
    }
  }, [user]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "role" && e.newValue && !user?.role) {
        const newRole = e.newValue as Role;
        const validRoles: Role[] = ["admin", "owner", "worker", "demo"];
        if (validRoles.includes(newRole)) {
          setRoleState(newRole);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [user]);

  return {
    role,
    setRole,
    isAdmin: role === "admin",
    isOwner: role === "owner",
    isWorker: role === "worker",
    isDemo: role === "demo",
    canDelete,
    canAccess,
    hasFullAccess: role === "admin" || role === "owner",
    hasEditAccess: role === "admin", // Only admin can edit/develop
  };
}
