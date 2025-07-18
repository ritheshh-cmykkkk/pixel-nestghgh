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
} from "lucide-react";

const mobileNavigation = [
  {
    name: "dashboard",
    href: "/",
    icon: LayoutDashboard,
    exact: true,
    roles: ["admin", "owner", "worker", "demo"],
  },
  {
    name: "transactions",
    href: "/transactions",
    icon: CreditCard,
    roles: ["admin", "owner", "worker", "demo"],
  },
  {
    name: "suppliers",
    href: "/suppliers",
    icon: Users,
    roles: ["admin", "owner", "worker", "demo"],
  },
  {
    name: "bills",
    href: "/bills",
    icon: Receipt,
    roles: ["admin", "owner", "demo"],
  },
  {
    name: "settings",
    href: "/settings",
    icon: Settings,
    roles: ["admin", "owner", "worker", "demo"],
  },
];

export function MobileBottomNav() {
  const location = useLocation();
  const { t } = useLanguage();
  const { role } = useRole();

  // Filter navigation items based on user role
  const filteredNavigation = mobileNavigation.filter((item) =>
    item.roles.includes(role),
  );

  const isActive = (item: (typeof filteredNavigation)[0]) => {
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
          `grid-cols-${filteredNavigation.length}`,
        )}
      >
        {filteredNavigation.map((item) => (
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
