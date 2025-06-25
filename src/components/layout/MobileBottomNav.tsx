import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRole } from "@/hooks/use-role";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CreditCard,
  Package,
  Receipt,
  Settings,
  Users,
} from "lucide-react";

// Mobile navigation items that will be filtered by role
const mobileNavigationItems = [
  {
    name: "dashboard",
    href: "/",
    icon: LayoutDashboard,
    exact: true,
    allowedRoles: ["admin"],
  },
  {
    name: "worker-home",
    href: "/worker",
    icon: LayoutDashboard,
    exact: true,
    allowedRoles: ["worker"],
  },
  {
    name: "transactions",
    href: "/transactions",
    icon: CreditCard,
    allowedRoles: ["admin", "worker"],
  },
  {
    name: "inventory",
    href: "/inventory",
    icon: Package,
    allowedRoles: ["admin", "worker"],
  },
  {
    name: "bills",
    href: "/bills",
    icon: Receipt,
    allowedRoles: ["admin", "worker"],
  },
  {
    name: "suppliers",
    href: "/suppliers",
    icon: Users,
    allowedRoles: ["admin", "worker"],
  },
  {
    name: "settings",
    href: "/settings",
    icon: Settings,
    allowedRoles: ["admin"],
  },
];

export function MobileBottomNav() {
  const location = useLocation();
  const { t } = useLanguage();
  const { role } = useRole();

  // Filter navigation items based on role
  const mobileNavigation = mobileNavigationItems.filter((item) =>
    item.allowedRoles.includes(role),
  );

  const isActive = (item: (typeof mobileNavigation)[0]) => {
    if (item.exact) {
      return location.pathname === item.href;
    }
    return location.pathname.startsWith(item.href);
  };

  return (
    <nav className="mobile-nav fixed bottom-0 left-0 right-0 z-30 bg-background/95 backdrop-blur border-t border-border safe-area-bottom">
      <div
        className={cn(
          "grid px-2 py-2",
          mobileNavigation.length <= 4 ? "grid-cols-4" : "grid-cols-5",
        )}
      >
        {mobileNavigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 rounded-lg p-2 touch-target transition-colors",
              isActive(item)
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground hover:bg-accent",
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs font-medium">{t(item.name)}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
