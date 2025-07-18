<<<<<<< HEAD
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
=======
import { useEffect, useState } from "react";

export type UserRole = "admin" | "worker";

export interface RolePermissions {
  canAccessSettings: boolean;
  canAccessReports: boolean;
  canAccessExpenditures: boolean;
  canEditInventory: boolean;
  canDeleteTransactions: boolean;
  canDeleteWithinHours: number | null; // null means unlimited, number means hours limit
  canViewProfits: boolean;
  maxTransactionsView: number | null; // null means unlimited
}

const rolePermissions: Record<UserRole, RolePermissions> = {
  admin: {
    canAccessSettings: true,
    canAccessReports: true,
    canAccessExpenditures: true,
    canEditInventory: true,
    canDeleteTransactions: true,
    canDeleteWithinHours: null, // unlimited
    canViewProfits: true,
    maxTransactionsView: null,
  },
  worker: {
    canAccessSettings: false,
    canAccessReports: false,
    canAccessExpenditures: false,
    canEditInventory: false,
    canDeleteTransactions: true, // workers can delete but with time limit
    canDeleteWithinHours: 24, // can only delete within 24 hours
    canViewProfits: false,
    maxTransactionsView: 10,
  },
};

export function useRole() {
  const [role, setRole] = useState<UserRole>("worker");
  const [permissions, setPermissions] = useState<RolePermissions>(
    rolePermissions.worker,
  );

  useEffect(() => {
    // Get role from localStorage, default to "worker" for security
    const storedRole = localStorage.getItem("role") as UserRole;
    const userRole =
      storedRole && (storedRole === "admin" || storedRole === "worker")
        ? storedRole
        : "worker";

    setRole(userRole);
    setPermissions(rolePermissions[userRole]);
  }, []);

  const hasPermission = (permission: keyof RolePermissions): boolean => {
    return Boolean(permissions[permission]);
  };

  const canDeleteTransaction = (transactionDate: Date): boolean => {
    if (!permissions.canDeleteTransactions) return false;
    if (permissions.canDeleteWithinHours === null) return true; // unlimited for admin

    const now = new Date();
    const hoursDiff =
      (now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60);
    return hoursDiff <= permissions.canDeleteWithinHours;
  };

  const isAdmin = role === "admin";
  const isWorker = role === "worker";

  return {
    role,
    permissions,
    hasPermission,
    canDeleteTransaction,
    isAdmin,
    isWorker,
>>>>>>> 52b5be12cb1add3e38352bfbd00fc725eee8d6cb
  };
}
