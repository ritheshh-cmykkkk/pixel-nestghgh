import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, User, Crown, Wrench } from "lucide-react";

type DemoRole = "admin" | "owner" | "worker";

interface DemoRoleSwitcherProps {
  currentRole: DemoRole;
  onRoleChange: (role: DemoRole) => void;
}

export function DemoRoleSwitcher({
  currentRole,
  onRoleChange,
}: DemoRoleSwitcherProps) {
  const isDemoMode = localStorage.getItem("demo_mode") === "true";

  if (!isDemoMode) {
    return null; // Only show in demo mode
  }

  const roleConfig = {
    admin: {
      label: "Admin",
      icon: Shield,
      description: "Full development and editing access",
      color: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
    },
    owner: {
      label: "Owner",
      icon: Crown,
      description: "Full business operational access",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
    },
    worker: {
      label: "Worker",
      icon: User,
      description: "Limited access with 24-hour restrictions",
      color:
        "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200",
    },
  };

  return (
    <Card className="border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Wrench className="h-4 w-4" />
          Demo Experience Controls
        </CardTitle>
        <CardDescription className="text-xs">
          Switch between role views to experience different access levels
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium">Current View:</span>
          <Badge className={roleConfig[currentRole].color}>
            {React.createElement(roleConfig[currentRole].icon, {
              className: "h-3 w-3 mr-1",
            })}
            {roleConfig[currentRole].label}
          </Badge>
        </div>

        <Select value={currentRole} onValueChange={onRoleChange}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(roleConfig).map(([role, config]) => (
              <SelectItem key={role} value={role} className="text-xs">
                <div className="flex items-center gap-2">
                  {React.createElement(config.icon, { className: "h-3 w-3" })}
                  <div>
                    <div className="font-medium">{config.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {config.description}
                    </div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="text-xs text-muted-foreground">
          <strong>Note:</strong> This demo uses mock data to showcase different
          role permissions and restrictions.
        </div>
      </CardContent>
    </Card>
  );
}
