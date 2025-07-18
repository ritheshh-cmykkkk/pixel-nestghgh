import { ReactNode } from "react";
import { useRole } from "@/hooks/use-role";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RoleProtectedRouteProps {
  children: ReactNode;
  allowedRoles: Array<"admin" | "worker">;
  fallbackMessage?: string;
}

export function RoleProtectedRoute({
  children,
  allowedRoles,
  fallbackMessage,
}: RoleProtectedRouteProps) {
  const { role } = useRole();
  const navigate = useNavigate();

  if (!allowedRoles.includes(role)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <Alert className="border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Access Denied:</strong>{" "}
              {fallbackMessage ||
                `This page requires ${allowedRoles.join(" or ")} privileges. Your current role is "${role}".`}
            </AlertDescription>
          </Alert>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="w-full"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
