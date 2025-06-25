import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ConnectionProvider } from "@/contexts/ConnectionContext";
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

// Pages
import Login from "./pages/auth/Login";
import Dashboard from "./pages/Dashboard";
import WorkerHome from "./pages/WorkerHome";
import Transactions from "./pages/Transactions";
import NewTransaction from "./pages/NewTransaction";
import EditTransaction from "./pages/EditTransaction";
import Inventory from "./pages/Inventory";
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
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="expenso-theme">
      <LanguageProvider>
        <ConnectionProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Authentication routes */}
                <Route path="/login" element={<Login />} />

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

                {/* Transaction routes */}
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/transactions/new" element={<NewTransaction />} />
                <Route
                  path="/transactions/:id/edit"
                  element={<EditTransaction />}
                />

                {/* Inventory routes */}
                <Route path="/inventory" element={<Inventory />} />

                {/* Supplier routes */}
                <Route path="/suppliers" element={<Suppliers />} />
                <Route path="/suppliers/:id" element={<SupplierDetails />} />

                {/* Financial routes - Admin only */}
                <Route
                  path="/expenditures"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <Expenditures />
                    </ProtectedRoute>
                  }
                />

                {/* Bill routes */}
                <Route path="/bills" element={<Bills />} />

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
);

export default App;
