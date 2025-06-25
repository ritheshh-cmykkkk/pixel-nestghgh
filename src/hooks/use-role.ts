import { useEffect, useState } from "react";

export type UserRole = "admin" | "worker";

export interface RolePermissions {
  canAccessSettings: boolean;
  canAccessReports: boolean;
  canAccessExpenditures: boolean;
  canEditInventory: boolean;
  canDeleteTransactions: boolean;
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
    canViewProfits: true,
    maxTransactionsView: null,
  },
  worker: {
    canAccessSettings: false,
    canAccessReports: false,
    canAccessExpenditures: false,
    canEditInventory: false,
    canDeleteTransactions: false,
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

  const isAdmin = role === "admin";
  const isWorker = role === "worker";

  return {
    role,
    permissions,
    hasPermission,
    isAdmin,
    isWorker,
  };
}
