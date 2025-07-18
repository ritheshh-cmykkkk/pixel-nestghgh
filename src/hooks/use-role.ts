import { useState, useEffect } from "react";

type Role = "admin" | "worker";

interface UseRoleReturn {
  role: Role;
  setRole: (role: Role) => void;
  isAdmin: boolean;
  isWorker: boolean;
}

export function useRole(): UseRoleReturn {
  const [role, setRoleState] = useState<Role>(() => {
    const savedRole = localStorage.getItem("role");
    return savedRole === "admin" || savedRole === "worker"
      ? savedRole
      : "admin";
  });

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    localStorage.setItem("role", newRole);
  };

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "role" && e.newValue) {
        const newRole = e.newValue as Role;
        if (newRole === "admin" || newRole === "worker") {
          setRoleState(newRole);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return {
    role,
    setRole,
    isAdmin: role === "admin",
    isWorker: role === "worker",
  };
}
