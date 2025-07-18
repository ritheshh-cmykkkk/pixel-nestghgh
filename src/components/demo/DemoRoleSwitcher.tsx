import React, { useState } from "react";
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

type DemoRole = "owner" | "worker";

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
    owner: {
      label: "Owner",
      icon: Crown,
      description: "Full business operational access",
      color:
        "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    },
    worker: {
      label: "Worker",
      icon: User,
      description: "Limited access with 24-hour restrictions",
      color:
        "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    },
  };

  return (
    <Card className="border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
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
