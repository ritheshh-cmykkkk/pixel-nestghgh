import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

type Role = "admin" | "worker";

interface UseRoleReturn {
  role: Role;
  setRole: (role: Role) => void;
  isAdmin: boolean;
  isWorker: boolean;
  canDelete: (createdAt: string) => boolean;
  canAccess: (createdAt: string) => boolean;
  hasFullAccess: boolean;
}

export function useRole(): UseRoleReturn {
  const { user } = useAuth();
  const [role, setRoleState] = useState<Role>(() => {
    // Get role from authenticated user or fallback to localStorage for demo
    if (user?.role) {
      return user.role;
    }
    const savedRole = localStorage.getItem("role");
    return savedRole === "admin" || savedRole === "worker"
      ? savedRole
      : "admin";
  });

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    localStorage.setItem("role", newRole);
  };

  // Worker can only access/delete items within 24 hours
  const canAccess = (createdAt: string): boolean => {
    if (role === "admin") return true;

    const created = new Date(createdAt);
    const now = new Date();
    const hoursDiff = (now.getTime() - created.getTime()) / (1000 * 60 * 60);

    return hoursDiff <= 24;
  };

  const canDelete = (createdAt: string): boolean => {
    if (role === "admin") return true;

    const created = new Date(createdAt);
    const now = new Date();
    const hoursDiff = (now.getTime() - created.getTime()) / (1000 * 60 * 60);

    return hoursDiff <= 24;
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
        if (newRole === "admin" || newRole === "worker") {
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
    isWorker: role === "worker",
    canDelete,
    canAccess,
    hasFullAccess: role === "admin",
  };
}
