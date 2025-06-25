import { AppLayout } from "@/components/layout/AppLayout";
import { useRole } from "@/hooks/use-role";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Shield, User, Info } from "lucide-react";
import { RoleSwitcher } from "@/components/RoleSwitcher";

export default function RoleDemo() {
  const { role, permissions, isAdmin, isWorker } = useRole();

  const permissionsList = [
    { key: "canAccessSettings", label: "Access Settings Page" },
    { key: "canAccessReports", label: "Access Reports Page" },
    { key: "canAccessExpenditures", label: "Access Expenditures Page" },
    { key: "canEditInventory", label: "Edit/Delete Inventory Items" },
    { key: "canDeleteTransactions", label: "Edit/Delete Transactions" },
    { key: "canViewProfits", label: "View Profit Information" },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Role-Based Access Control Demo
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Test and understand how different roles affect system access
            </p>
          </div>
          <RoleSwitcher />
        </div>

        {/* Current Role Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isAdmin ? (
                <Shield className="h-5 w-5 text-blue-600" />
              ) : (
                <User className="h-5 w-5 text-green-600" />
              )}
              Current Role
            </CardTitle>
            <CardDescription>
              Your current role determines what features you can access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Badge
                variant={isAdmin ? "default" : "secondary"}
                className="text-lg px-4 py-2"
              >
                {role.toUpperCase()}
              </Badge>
              <div className="text-sm text-muted-foreground">
                {isAdmin
                  ? "Full administrative access to all features"
                  : "Limited access with read-only permissions on certain features"}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Permissions Matrix */}
        <Card>
          <CardHeader>
            <CardTitle>Permission Matrix</CardTitle>
            <CardDescription>
              Compare what each role can and cannot access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Headers */}
              <div className="grid grid-cols-3 gap-4 pb-2 border-b">
                <div className="font-medium">Permission</div>
                <div className="text-center font-medium flex items-center justify-center gap-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  Admin
                </div>
                <div className="text-center font-medium flex items-center justify-center gap-2">
                  <User className="h-4 w-4 text-green-600" />
                  Worker
                </div>
              </div>

              {/* Permission Rows */}
              {permissionsList.map((permission) => (
                <div
                  key={permission.key}
                  className="grid grid-cols-3 gap-4 py-2"
                >
                  <div className="text-sm">{permission.label}</div>
                  <div className="text-center">
                    <Check className="h-4 w-4 text-green-600 mx-auto" />
                  </div>
                  <div className="text-center">
                    {permission.key === "maxTransactionsView" ||
                    permissions[permission.key as keyof typeof permissions] ? (
                      <Check className="h-4 w-4 text-green-600 mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-red-500 mx-auto" />
                    )}
                  </div>
                </div>
              ))}

              {/* Special case for transaction limits */}
              <div className="grid grid-cols-3 gap-4 py-2">
                <div className="text-sm">Transaction View Limit</div>
                <div className="text-center text-sm">Unlimited</div>
                <div className="text-center text-sm">
                  {permissions.maxTransactionsView || "Unlimited"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Permissions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Your Current Permissions
              <Badge variant={isAdmin ? "default" : "secondary"}>{role}</Badge>
            </CardTitle>
            <CardDescription>
              What you can access with your current role
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {permissionsList.map((permission) => {
                const hasPermission =
                  permissions[permission.key as keyof typeof permissions];
                return (
                  <div
                    key={permission.key}
                    className="flex items-center gap-3 p-3 rounded-lg border"
                  >
                    {hasPermission ? (
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                    ) : (
                      <X className="h-4 w-4 text-red-500 flex-shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        hasPermission
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {permission.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              How to Test
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5">
                  1
                </Badge>
                <span>
                  Use the role switcher in the top-right corner to change
                  between Admin and Worker roles
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5">
                  2
                </Badge>
                <span>
                  Navigate to different pages (Dashboard, Transactions,
                  Inventory) to see role-based restrictions
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5">
                  3
                </Badge>
                <span>
                  Notice that Workers cannot access Settings, Reports, or
                  Expenditures from the sidebar
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5">
                  4
                </Badge>
                <span>
                  Workers have read-only access to Inventory (no edit/delete
                  buttons) and limited transactions view
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
