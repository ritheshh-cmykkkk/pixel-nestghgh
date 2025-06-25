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
  };
}
