import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { AuthService, User } from "@/lib/services/auth";
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    name: string;
    role?: "admin" | "worker";
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated on app start
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = AuthService.getStoredToken();
      const storedUser = AuthService.getStoredUser();
      const isDemoMode = localStorage.getItem("demo_mode") === "true";

      if (token && storedUser) {
        if (isDemoMode) {
          // Demo mode - completely isolated, use demo data only
          if (token.startsWith("demo-token")) {
            setUser({
              ...storedUser,
              name: "Demo User",
              email: "demo@expo.com",
              role: "demo",
            });
          } else {
            // Invalid demo token, clear and redirect
            localStorage.clear();
            setUser(null);
          }
        } else {
          // Real user mode - verify JWT token with backend
          if (token.startsWith("demo-token")) {
            // Demo token found in real mode, clear everything
            localStorage.clear();
            setUser(null);
            return;
          }

          try {
            const currentUser = await AuthService.getCurrentUser();
            setUser(currentUser);
          } catch (error) {
            // JWT validation failed, clear auth data
            localStorage.removeItem("auth_token");
            localStorage.removeItem("user_data");
            setUser(null);
          }
        }
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      // Clear all auth data on any error
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
      localStorage.removeItem("demo_mode");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const authData = await AuthService.login({ email, password });
      setUser(authData.user);

      toast({
        title: "Welcome back!",
        description: `Logged in as ${authData.user.name}`,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to login. Please try again.";

      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    name: string;
    role?: "admin" | "worker";
  }) => {
    try {
      setIsLoading(true);
      const authData = await AuthService.register(userData);
      setUser(authData.user);

      toast({
        title: "Account Created!",
        description: `Welcome to Expenso, ${authData.user.name}!`,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to create account. Please try again.";

      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const isDemoMode = localStorage.getItem("demo_mode") === "true";

      if (isDemoMode) {
        // Demo mode - just clear local data
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_data");
        localStorage.removeItem("demo_mode");
        localStorage.removeItem("role"); // Clear old role system
      } else {
        // Regular mode - call backend logout
        await AuthService.logout();
      }

      setUser(null);

      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local state even if API call fails
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
      localStorage.removeItem("demo_mode");
      localStorage.removeItem("role");
      setUser(null);
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      const updatedUser = await AuthService.updateProfile(userData);
      setUser(updatedUser);

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to update profile. Please try again.";

      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      await AuthService.changePassword(oldPassword, newPassword);

      toast({
        title: "Password Changed",
        description: "Your password has been successfully updated.",
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to change password. Please try again.";

      toast({
        title: "Password Change Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
