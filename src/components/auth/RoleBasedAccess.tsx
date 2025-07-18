import { ReactNode } from "react";
import { useRole } from "@/hooks/use-role";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Clock } from "lucide-react";

interface RoleBasedAccessProps {
  children: ReactNode;
  requiredRole?: "admin" | "worker";
  itemCreatedAt?: string;
  action?: "view" | "delete" | "edit";
  fallback?: ReactNode;
}

export function RoleBasedAccess({
  children,
  requiredRole,
  itemCreatedAt,
  action = "view",
  fallback,
}: RoleBasedAccessProps) {
  const { role, canAccess, canDelete, hasFullAccess } = useRole();

  // Check role requirement
  if (requiredRole && role !== requiredRole && !hasFullAccess) {
    return (
      fallback || (
        <Alert className="border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Access Restricted:</strong> This feature requires{" "}
            {requiredRole} privileges.
          </AlertDescription>
        </Alert>
      )
    );
  }

  // Check time-based access for workers
  if (itemCreatedAt && role === "worker") {
    const hasAccess =
      action === "delete" ? canDelete(itemCreatedAt) : canAccess(itemCreatedAt);

    if (!hasAccess) {
      const created = new Date(itemCreatedAt);
      const now = new Date();
      const hoursDiff = Math.round(
        (now.getTime() - created.getTime()) / (1000 * 60 * 60),
      );

      return (
        fallback || (
          <Alert className="border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
            <Clock className="h-4 w-4" />
            <AlertDescription>
              <strong>Time Restriction:</strong> Workers can only {action} items
              created within the last 24 hours. This item was created{" "}
              {hoursDiff} hours ago.
            </AlertDescription>
          </Alert>
        )
      );
    }
  }

  return <>{children}</>;
}

interface WorkerRestrictedButtonProps {
  children: ReactNode;
  itemCreatedAt: string;
  action: "delete" | "edit";
  disabled?: boolean;
  className?: string;
}

export function WorkerRestrictedButton({
  children,
  itemCreatedAt,
  action,
  disabled = false,
  className,
}: WorkerRestrictedButtonProps) {
  const { role, canDelete, canAccess } = useRole();

  if (role === "admin") {
    return <>{children}</>;
  }

  const hasPermission =
    action === "delete" ? canDelete(itemCreatedAt) : canAccess(itemCreatedAt);

  if (!hasPermission) {
    return null; // Hide button if no permission
  }

  return <>{children}</>;
}

interface TimeBasedAccessProps {
  children: ReactNode;
  createdAt: string;
  maxHours?: number;
}

export function TimeBasedAccess({
  children,
  createdAt,
  maxHours = 24,
}: TimeBasedAccessProps) {
  const created = new Date(createdAt);
  const now = new Date();
  const hoursDiff = (now.getTime() - created.getTime()) / (1000 * 60 * 60);

  if (hoursDiff > maxHours) {
    return null;
  }

  return <>{children}</>;
}
