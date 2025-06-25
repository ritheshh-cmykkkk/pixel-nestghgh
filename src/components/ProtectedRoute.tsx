import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useRole, UserRole } from "@/hooks/use-role";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = "/worker",
}: ProtectedRouteProps) {
  const { role } = useRole();

  if (!allowedRoles.includes(role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
