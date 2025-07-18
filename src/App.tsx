import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ConnectionProvider } from "@/contexts/ConnectionContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import { useRole } from "@/hooks/use-role";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Role-based home component
function RoleBasedHome() {
  const { isWorker } = useRole();

  if (isWorker) {
    return <Navigate to="/worker" replace />;
  }

  return <Dashboard />;
}

// Layout and Auth components
import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { RoleProtectedRoute } from "@/components/auth/RoleProtectedRoute";

// Pages
import Login from "./pages/auth/Login";
import Dashboard from "./pages/Dashboard";
import WorkerHome from "./pages/WorkerHome";
import Transactions from "./pages/Transactions";
import NewTransaction from "./pages/NewTransaction";
import EditTransaction from "./pages/EditTransaction";
import Suppliers from "./pages/Suppliers";
import SupplierDetails from "./pages/SupplierDetails";
import Expenditures from "./pages/Expenditures";
import Bills from "./pages/Bills";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        // Don't retry on authentication errors
        if (error?.response?.status === 401) return false;
        return failureCount < 3;
      },
    },
  },
});

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="expenso-theme">
        <AuthProvider>
          <LanguageProvider>
            <ConnectionProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  {/* Public authentication routes */}
                  <Route
                    path="/login"
                    element={
                      <ProtectedRoute requireAuth={false}>
                        <Login />
                      </ProtectedRoute>
                    }
                  />

<<<<<<< HEAD
                  {/* Protected app routes with layout */}
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <AppLayout />
                      </ProtectedRoute>
                    }
                  >
                    {/* Dashboard */}
                    <Route index element={<Dashboard />} />
                    <Route
                      path="dashboard"
                      element={<Navigate to="/" replace />}
                    />
=======
                {/* Main app routes */}
                <Route path="/" element={<RoleBasedHome />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/worker"
                  element={
                    <ProtectedRoute
                      allowedRoles={["worker"]}
                      redirectTo="/dashboard"
                    >
                      <WorkerHome />
                    </ProtectedRoute>
                  }
                />
>>>>>>> 52b5be12cb1add3e38352bfbd00fc725eee8d6cb

                    {/* Transaction routes */}
                    <Route path="transactions" element={<Transactions />} />
                    <Route
                      path="transactions/new"
                      element={<NewTransaction />}
                    />
                    <Route
                      path="transactions/:id/edit"
                      element={<EditTransaction />}
                    />

<<<<<<< HEAD
                    {/* Supplier routes */}
                    <Route path="suppliers" element={<Suppliers />} />
                    <Route path="suppliers/:id" element={<SupplierDetails />} />
=======
                {/* Inventory routes - Admin only */}
                <Route
                  path="/inventory"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <Inventory />
                    </ProtectedRoute>
                  }
                />
>>>>>>> 52b5be12cb1add3e38352bfbd00fc725eee8d6cb

                    {/* Financial routes - Admin, Owner, and Demo (for expo) */}
                    <Route
                      path="expenditures"
                      element={
                        <RoleProtectedRoute
                          allowedRoles={["admin", "owner", "demo"]}
                        >
                          <Expenditures />
                        </RoleProtectedRoute>
                      }
                    />

<<<<<<< HEAD
                    {/* Bill routes - Admin, Owner, and Demo (for expo) */}
                    <Route
                      path="bills"
                      element={
                        <RoleProtectedRoute
                          allowedRoles={["admin", "owner", "demo"]}
                        >
                          <Bills />
                        </RoleProtectedRoute>
                      }
                    />
=======
                {/* Financial routes - Admin only */}
                <Route
                  path="/expenditures"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <Expenditures />
                    </ProtectedRoute>
                  }
                />
>>>>>>> 52b5be12cb1add3e38352bfbd00fc725eee8d6cb

                    {/* Report routes - Admin, Owner, and Demo (for expo) */}
                    <Route
                      path="reports"
                      element={
                        <RoleProtectedRoute
                          allowedRoles={["admin", "owner", "demo"]}
                        >
                          <Reports />
                        </RoleProtectedRoute>
                      }
                    />

<<<<<<< HEAD
                    {/* Settings routes */}
                    <Route path="settings" element={<Settings />} />
                  </Route>

                  {/* Catch-all route - redirect to login */}
                  <Route
                    path="*"
                    element={
                      <ProtectedRoute>
                        <NotFound />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </TooltipProvider>
            </ConnectionProvider>
          </LanguageProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </BrowserRouter>
=======
                {/* Report routes - Admin only */}
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <Reports />
                    </ProtectedRoute>
                  }
                />

                {/* Settings routes - Admin only */}
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <Settings />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ConnectionProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
>>>>>>> 52b5be12cb1add3e38352bfbd00fc725eee8d6cb
);

export default App;
