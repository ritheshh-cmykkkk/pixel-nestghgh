import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRole } from "@/hooks/use-role";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CreditCard,
  Users,
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
<<<<<<< HEAD
    roles: ["admin", "owner", "worker", "demo"],
=======
    allowedRoles: ["admin"],
  },
  {
    name: "home",
    href: "/worker",
    icon: LayoutDashboard,
    exact: true,
    allowedRoles: ["worker"],
>>>>>>> 52b5be12cb1add3e38352bfbd00fc725eee8d6cb
  },
  {
    name: "transactions",
    href: "/transactions",
    icon: CreditCard,
<<<<<<< HEAD
    roles: ["admin", "owner", "worker", "demo"],
  },
  {
    name: "suppliers",
    href: "/suppliers",
    icon: Users,
    roles: ["admin", "owner", "worker", "demo"],
=======
    allowedRoles: ["admin", "worker"],
  },
  {
    name: "inventory",
    href: "/inventory",
    icon: Package,
    allowedRoles: ["admin"], // Only admin can access inventory
>>>>>>> 52b5be12cb1add3e38352bfbd00fc725eee8d6cb
  },
  {
    name: "bills",
    href: "/bills",
    icon: Receipt,
<<<<<<< HEAD
    roles: ["admin", "owner", "demo"],
=======
    allowedRoles: ["admin", "worker"],
  },
  {
    name: "suppliers",
    href: "/suppliers",
    icon: Users,
    allowedRoles: ["admin", "worker"],
>>>>>>> 52b5be12cb1add3e38352bfbd00fc725eee8d6cb
  },
  {
    name: "settings",
    href: "/settings",
    icon: Settings,
<<<<<<< HEAD
    roles: ["admin", "owner", "worker", "demo"],
=======
    allowedRoles: ["admin"],
>>>>>>> 52b5be12cb1add3e38352bfbd00fc725eee8d6cb
  },
];

export function MobileBottomNav() {
  const location = useLocation();
  const { t } = useLanguage();
  const { role } = useRole();

<<<<<<< HEAD
  // Filter navigation items based on user role
  const filteredNavigation = mobileNavigation.filter((item) =>
    item.roles.includes(role),
=======
  // Filter navigation items based on role
  const mobileNavigation = mobileNavigationItems.filter((item) =>
    item.allowedRoles.includes(role),
>>>>>>> 52b5be12cb1add3e38352bfbd00fc725eee8d6cb
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
<<<<<<< HEAD
          `grid-cols-${filteredNavigation.length}`,
        )}
      >
        {filteredNavigation.map((item) => (
=======
          mobileNavigation.length <= 4 ? "grid-cols-4" : "grid-cols-5",
        )}
      >
        {mobileNavigation.map((item) => (
>>>>>>> 52b5be12cb1add3e38352bfbd00fc725eee8d6cb
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
