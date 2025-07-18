import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Menu,
  Bell,
  Search,
  Sun,
  Moon,
  LogOut,
  User,
  Settings,
  Globe,
  Monitor,
  WifiOff,
  Shield,
  Info,
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { ConnectionIndicator } from "@/contexts/ConnectionContext";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOffline] = useState(!navigator.onLine);
  const isDemoMode = localStorage.getItem("demo_mode") === "true";

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleProfileClick = () => {
    navigate("/settings");
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <>
      {/* Offline Alert */}
      {isOffline && (
        <Alert className="rounded-none border-x-0 border-t-0">
          <WifiOff className="h-4 w-4" />
          <AlertDescription>
            You're currently offline. Some features may be limited.
          </AlertDescription>
        </Alert>
      )}

      <header className="sticky top-0 z-40 flex h-14 sm:h-16 shrink-0 items-center gap-x-3 sm:gap-x-4 border-b-2 border-border bg-background/98 backdrop-blur supports-[backdrop-filter]:bg-background/95 px-3 sm:px-4 shadow-lg lg:gap-x-6 lg:px-8 safe-area-top electron-drag">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden h-10 w-10 electron-no-drag touch-target"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search */}
        <div className="flex flex-1 gap-x-3 sm:gap-x-4 lg:gap-x-6">
          <form
            className="relative flex flex-1 max-w-lg items-center"
            action="#"
            method="GET"
          >
            <label htmlFor="search-field" className="sr-only">
              {t("search")}
            </label>
            <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground z-10" />
            <Input
              id="search-field"
              className="h-10 border-0 bg-muted/50 hover:bg-muted/80 pl-10 pr-4 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 focus-visible:bg-muted text-sm placeholder:text-muted-foreground transition-colors w-full"
              placeholder={`${t("search")}...`}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* Right side items */}
        <div className="flex items-center gap-x-2 sm:gap-x-3 lg:gap-x-4">
          {/* Connection status */}
          <div className="hidden sm:flex">
            <ConnectionIndicator />
          </div>

<<<<<<< HEAD
          {/* Role indicator - shows Demo for demo users, actual role for real users */}
          {user?.role && (
            <Badge
              variant={
                isDemoMode
                  ? "outline"
                  : user.role === "admin"
                    ? "default"
                    : "secondary"
              }
              className={`hidden sm:flex items-center gap-1 font-medium ${
                isDemoMode
                  ? "border-slate-400 text-slate-600 bg-slate-50 dark:border-slate-600 dark:text-slate-400 dark:bg-slate-900/50"
                  : ""
              }`}
=======
        {/* Role switcher for testing */}
        <RoleSwitcher />

        {/* Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full electron-no-drag touch-target"
>>>>>>> 52b5be12cb1add3e38352bfbd00fc725eee8d6cb
            >
              <Shield className="h-3 w-3" />
              {isDemoMode ? "Demo" : user.role}
            </Badge>
          )}

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative h-10 w-10 electron-no-drag touch-target"
          >
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-destructive text-destructive-foreground">
              3
            </Badge>
          </Button>

          {/* Language switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 electron-no-drag touch-target"
              >
                <Globe className="h-5 w-5" />
                <span className="sr-only">Switch language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setLanguage("en")}
                className={language === "en" ? "bg-accent" : ""}
              >
                🇺🇸 English
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setLanguage("te")}
                className={language === "te" ? "bg-accent" : ""}
              >
                🇮🇳 తెలుగు
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 electron-no-drag touch-target"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setTheme("light")}
                className={theme === "light" ? "bg-accent" : ""}
              >
                <Sun className="mr-2 h-4 w-4" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("dark")}
                className={theme === "dark" ? "bg-accent" : ""}
              >
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("system")}
                className={theme === "system" ? "bg-accent" : ""}
              >
                <Monitor className="mr-2 h-4 w-4" />
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full electron-no-drag touch-target"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={user?.avatar || "/avatars/default.png"}
                    alt={user?.name || "User"}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground font-medium text-sm">
                    {user ? getUserInitials(user.name) : "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">
                    {isDemoMode ? "Demo User" : user?.name || "User"}
                  </p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    {isDemoMode
                      ? "demo@expo.local"
                      : user?.email || "user@example.com"}
                  </p>
                  {user?.shop_name && (
                    <p className="w-[200px] truncate text-xs text-muted-foreground">
                      {user.shop_name}
                    </p>
                  )}
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2" onClick={handleProfileClick}>
                <User className="h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2" onClick={handleProfileClick}>
                <Settings className="h-4 w-4" />
                {t("settings")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 text-destructive focus:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                {t("logout") || "Logout"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  );
}