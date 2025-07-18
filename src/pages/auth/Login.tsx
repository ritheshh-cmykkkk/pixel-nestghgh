import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Smartphone,
  Eye,
  EyeOff,
  Loader2,
  Wrench,
  Zap,
  Shield,
  WifiOff,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import PWAManager from "@/lib/pwa";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading: authLoading, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [selectedRole, setSelectedRole] = useState<"demo">("demo");

  // Get redirect location from router state
  const from = (location.state as any)?.from?.pathname || "/";

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    // Monitor online/offline status
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Check if using demo credentials
      const isDemoCredentials =
        formData.email === "admin@expenso.com" &&
        formData.password === "admin123";

      if (isDemoCredentials) {
        // Handle demo login locally without backend
        await handleDemoAuthentication();
      } else {
        // Regular backend authentication
        if (isOffline) {
          setError(
            "You're offline. Please check your connection and try again.",
          );
          return;
        }

        await login(formData.email, formData.password);
      }

      // Store remember me preference
      if (formData.rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }

      // Navigate to the intended page or dashboard
      navigate(from, { replace: true });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please check your credentials and try again.";

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoAuthentication = async () => {
    // Create secure demo user data for expo purposes only
    const demoUser = {
      id: "demo-user-secured",
      email: "demo@expo.local",
      name: "Demo User",
      role: "demo" as const,
      shop_name: "Demo Repair Shop",
      avatar: null,
    };

    const demoAuthData = {
      token:
        "demo-token-expo-" +
        Date.now() +
        "-" +
        Math.random().toString(36).substring(7),
      user: demoUser,
      expires_in: 86400, // 24 hours
    };

    // Store demo auth data locally
    localStorage.setItem("auth_token", demoAuthData.token);
    localStorage.setItem("user_data", JSON.stringify(demoUser));
    localStorage.setItem("demo_mode", "true");

    // Small delay to simulate authentication
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Show success message
    console.log("Demo login successful for expo!");
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Direct demo authentication without form submission
      await handleDemoAuthentication();

      // Navigate to dashboard
      navigate(from, { replace: true });
    } catch (error) {
      setError("Demo login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-12 lg:py-24 bg-gradient-to-br from-blue-600 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />

        {/* Offline indicator */}
        {isOffline && (
          <div className="absolute top-4 right-4 bg-red-500/20 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm flex items-center">
            <WifiOff className="h-4 w-4 mr-2" />
            Offline Mode
          </div>
        )}

        <div className="relative z-10 text-white">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Smartphone className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Expenso</h1>
              <p className="text-white/80 text-sm">Mobile Repair Tracker</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold mb-4">
            Streamline your mobile repair business
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-md">
            Track repairs, manage customers, handle suppliers, and generate
            detailed reports for your mobile repair shop.
          </p>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Wrench className="h-4 w-4 text-white" />
              </div>
              <span className="text-white/90">
                Complete repair lifecycle tracking
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="text-white/90">
                Customer & supplier management
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-white/90">
                Real-time analytics & reports
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile branding */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Smartphone className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Welcome to Expenso</h1>
            <p className="text-muted-foreground">
              Sign in to manage your repair shop
            </p>
          </div>

          <Card className="border-0 shadow-2xl">
            <CardHeader className="space-y-1 text-center lg:text-left">
              <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
              <CardDescription>
                Enter your credentials to access your dashboard
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {isOffline && (
                  <Alert>
                    <WifiOff className="h-4 w-4" />
                    <AlertDescription>
                      You're offline. Please check your internet connection.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@expenso.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={isLoading || isOffline}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      disabled={isLoading || isOffline}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading || isOffline}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) =>
                        handleInputChange("rememberMe", !!checked)
                      }
                    />
                    <Label htmlFor="remember" className="text-sm">
                      Remember me
                    </Label>
                  </div>
                  <Button variant="link" size="sm" asChild className="px-0">
                    <Link to="/auth/forgot-password">Forgot password?</Link>
                  </Button>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || isOffline}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleDemoLogin}
                  disabled={isLoading || isOffline}
                >
                  Use Demo Credentials
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Button variant="link" size="sm" asChild className="px-0">
                    <Link to="/auth/signup">Sign up</Link>
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Card>

          {/* PWA Install prompt */}
          <div className="text-center text-xs text-muted-foreground">
            <p>💡 Install this app for the best experience</p>
          </div>
        </div>
      </div>
    </div>
  );
}
