import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ConnectionProvider } from "@/contexts/ConnectionContext";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Loading } from "@/components/ui/loading";

// Pages
import Login from "./pages/auth/Login";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import NewTransaction from "./pages/NewTransaction";
import EditTransaction from "./pages/EditTransaction";
import Suppliers from "./pages/Suppliers";
import SupplierDetails from "./pages/SupplierDetails";
import Expenditures from "./pages/Expenditures";
import Bills from "./pages/Bills";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading text="Loading application..." size="lg" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected main app routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />

        {/* Transaction routes - accessible by all roles */}
        <Route
          path="/transactions"
          element={
            <ProtectedRoute requiredRoles={["admin", "owner", "worker"]}>
              <Transactions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions/new"
          element={
            <ProtectedRoute requiredRoles={["admin", "owner", "worker"]}>
              <NewTransaction />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions/:id/edit"
          element={
            <ProtectedRoute requiredRoles={["admin", "owner", "worker"]}>
              <EditTransaction />
            </ProtectedRoute>
          }
        />

        {/* Supplier routes - admin and owner only */}
        <Route
          path="/suppliers"
          element={
            <ProtectedRoute requiredRoles={["admin", "owner"]}>
              <Suppliers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/suppliers/:id"
          element={
            <ProtectedRoute requiredRoles={["admin", "owner"]}>
              <SupplierDetails />
            </ProtectedRoute>
          }
        />

        {/* Financial routes - admin and owner only */}
        <Route
          path="/expenditures"
          element={
            <ProtectedRoute requiredRoles={["admin", "owner"]}>
              <Expenditures />
            </ProtectedRoute>
          }
        />

        {/* Bill routes - accessible by all roles */}
        <Route
          path="/bills"
          element={
            <ProtectedRoute requiredRoles={["admin", "owner", "worker"]}>
              <Bills />
            </ProtectedRoute>
          }
        />

        {/* Report routes - admin and owner only */}
        <Route
          path="/reports"
          element={
            <ProtectedRoute requiredRoles={["admin", "owner"]}>
              <Reports />
            </ProtectedRoute>
          }
        />

        {/* Settings routes - accessible by all roles */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="callmemobiles-theme">
      <AuthProvider>
        <LanguageProvider>
          <ConnectionProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <AppContent />
            </TooltipProvider>
          </ConnectionProvider>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
