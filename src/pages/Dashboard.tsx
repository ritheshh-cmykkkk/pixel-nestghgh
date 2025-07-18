import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Users,
  Wrench,
  Package,
  Phone,
  Clock,
  AlertTriangle,
  TrendingUp,
  CalendarDays,
  Banknote,
  CreditCard,
  Receipt,
  Plus,
  WifiOff,
  RefreshCw,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/hooks/use-role";
import { StatisticsService, DashboardStats } from "@/lib/services/statistics";
import { TransactionService, Transaction } from "@/lib/services/transactions";
import { toast } from "@/hooks/use-toast";
import { DemoRoleSwitcher } from "@/components/demo/DemoRoleSwitcher";
import { useRole } from "@/hooks/use-role";
>>>>>>> 52b5be12cb1add3e38352bfbd00fc725eee8d6cb

interface ChartData {
  day: string;
  revenue: number;
  repairs: number;
  profit: number;
}

<<<<<<< HEAD
interface RepairTypeData {
  type: string;
  count: number;
  revenue: number;
  color: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const { role } = useRole();
  const isDemoMode = localStorage.getItem("demo_mode") === "true";
  const [demoRole, setDemoRole] = useState<"owner" | "worker">("owner");
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null,
=======
const repairTypeData = [
  { type: "Screen", count: 124, revenue: 371200, color: "#2563eb" },
  { type: "Battery", count: 89, revenue: 178000, color: "#dc2626" },
  { type: "Charging Port", count: 56, revenue: 140000, color: "#16a34a" },
  { type: "Speaker", count: 34, revenue: 68000, color: "#ca8a04" },
  { type: "Camera", count: 28, revenue: 84000, color: "#9333ea" },
  { type: "Water Damage", count: 22, revenue: 132000, color: "#0891b2" },
];

const recentTransactions = [
  {
    id: 1,
    customer: "Rajesh Kumar",
    phone: "+91 98765 43210",
    device: "iPhone 14 Pro",
    repair: "Screen Replacement",
    amount: 12500,
    cost: 8000,
    profit: 4500,
    status: "completed",
    date: "Today",
    time: "2:30 PM",
    paymentMethod: "upi",
  },
  {
    id: 2,
    customer: "Priya Sharma",
    phone: "+91 98765 43211",
    device: "Samsung Galaxy S23",
    repair: "Battery Replacement",
    amount: 3500,
    cost: 2000,
    profit: 1500,
    status: "in-progress",
    date: "Today",
    time: "1:15 PM",
    paymentMethod: "cash",
  },
  {
    id: 3,
    customer: "Mohammed Ali",
    phone: "+91 98765 43212",
    device: "OnePlus 11",
    repair: "Charging Port",
    amount: 4500,
    cost: 2500,
    profit: 2000,
    status: "pending",
    date: "Today",
    time: "11:45 AM",
    paymentMethod: "card",
  },
  {
    id: 4,
    customer: "Sunita Devi",
    phone: "+91 98765 43213",
    device: "iPhone 13",
    repair: "Screen + Battery",
    amount: 15000,
    cost: 9500,
    profit: 5500,
    status: "completed",
    date: "Yesterday",
    time: "4:20 PM",
    paymentMethod: "card",
  },
  {
    id: 5,
    customer: "Arjun Reddy",
    phone: "+91 98765 43214",
    device: "Google Pixel 7",
    repair: "Camera Module",
    amount: 8500,
    cost: 5000,
    profit: 3500,
    status: "delivered",
    date: "Yesterday",
    time: "2:10 PM",
    paymentMethod: "upi",
  },
];

const lowStockItems = [
  { item: "iPhone 14 Pro Screen", stock: 2, minStock: 5, critical: true },
  { item: "Samsung S23 Battery", stock: 4, minStock: 8, critical: false },
  { item: "USB-C Port Module", stock: 1, minStock: 6, critical: true },
  { item: "iPhone 13 Camera", stock: 3, minStock: 5, critical: true },
  { item: "Screen Protectors", stock: 15, minStock: 50, critical: false },
];

const statusConfig = {
  pending: {
    label: "pending",
    color: "status-pending",
    icon: Clock,
    bgColor: "bg-repair-pending/10",
  },
  "in-progress": {
    label: "in-progress",
    color: "status-progress",
    icon: Wrench,
    bgColor: "bg-repair-progress/10",
  },
  completed: {
    label: "completed",
    color: "status-completed",
    icon: CheckCircle,
    bgColor: "bg-repair-completed/10",
  },
  delivered: {
    label: "delivered",
    color: "status-delivered",
    icon: CheckCircle,
    bgColor: "bg-repair-delivered/10",
  },
};

const paymentMethodIcons = {
  cash: DollarSign,
  upi: Smartphone,
  card: CreditCard,
};

export default function Dashboard() {
  const { permissions, isWorker } = useRole();
  const [showProfits, setShowProfits] = useState(
    localStorage.getItem("showProfits") === "true" &&
      permissions.canViewProfits,
>>>>>>> 52b5be12cb1add3e38352bfbd00fc725eee8d6cb
  );
  const [weeklyRevenue, setWeeklyRevenue] = useState<ChartData[]>([]);
  const [repairTypeData, setRepairTypeData] = useState<RepairTypeData[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

<<<<<<< HEAD
  useEffect(() => {
    loadDashboardData();

    // Set up auto-refresh every 5 minutes
    const interval = setInterval(loadDashboardData, 5 * 60 * 1000);

    // Monitor online/offline status
    const handleOnline = () => {
      setIsOffline(false);
      loadDashboardData();
    };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const isDemoMode = localStorage.getItem("demo_mode") === "true";

      if (isDemoMode) {
        // Load demo data without API calls
        await loadDemoData();
      } else {
        // Load real data from API
        await loadRealData();
      }

      setLastUpdated(new Date());
    } catch (error: any) {
      console.error("Failed to load dashboard data:", error);

      if (!isOffline) {
        toast({
          title: "Failed to load data",
          description:
            "Could not fetch the latest data. Showing cached information.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
=======
  const toggleProfits = () => {
    if (!permissions.canViewProfits) return;
    const newValue = !showProfits;
    setShowProfits(newValue);
    localStorage.setItem("showProfits", newValue.toString());
>>>>>>> 52b5be12cb1add3e38352bfbd00fc725eee8d6cb
  };

  const loadDemoData = async () => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock dashboard statistics
    const mockStats: DashboardStats = {
      revenue: {
        today: 15420,
        yesterday: 12300,
        this_month: 384500,
        last_month: 342800,
        growth_percentage: 12.2,
      },
      transactions: {
        today: 8,
        pending: 3,
        completed: 23,
        total_this_month: 89,
        growth_percentage: 8.5,
      },
      customers: {
        total: 156,
        new_this_month: 12,
        active: 134,
        growth_percentage: 15.3,
      },
      bills: {
        pending: 5,
        overdue: 2,
        paid_this_month: 67,
        total_amount_pending: 28400,
      },
    };
    setDashboardStats(mockStats);

    // Mock weekly revenue data
    const mockWeeklyData: ChartData[] = [
      { day: "Mon", revenue: 12400, repairs: 6, profit: 4200 },
      { day: "Tue", revenue: 15600, repairs: 8, profit: 5300 },
      { day: "Wed", revenue: 18200, repairs: 9, profit: 6100 },
      { day: "Thu", revenue: 14800, repairs: 7, profit: 4900 },
      { day: "Fri", revenue: 21300, repairs: 11, profit: 7200 },
      { day: "Sat", revenue: 25600, repairs: 14, profit: 8500 },
      { day: "Sun", revenue: 19100, repairs: 10, profit: 6400 },
    ];
    setWeeklyRevenue(mockWeeklyData);

    // Mock repair type data with high contrast colors
    const mockRepairTypes: RepairTypeData[] = [
      {
        type: "Screen Replacement",
        count: 34,
        revenue: 102000,
        color: "#60a5fa",
      },
      {
        type: "Battery Replacement",
        count: 28,
        revenue: 56000,
        color: "#f87171",
      },
      { type: "Charging Port", count: 18, revenue: 45000, color: "#34d399" },
      { type: "Speaker Repair", count: 12, revenue: 24000, color: "#fbbf24" },
      { type: "Camera Repair", count: 8, revenue: 32000, color: "#a78bfa" },
    ];
    setRepairTypeData(mockRepairTypes);

    // Mock recent transactions
    const mockTransactions: Transaction[] = [
      {
        id: "TXN-001",
        customer_name: "John Smith",
        customer_phone: "+1 555-0123",
        device_model: "iPhone 14 Pro",
        repair_type: "screen-replacement",
        cost: 12500,
        profit: 4500,
        status: "completed",
        payment_method: "upi",
        payment_status: "completed",
        amount_paid: 12500,
        free_glass: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "TXN-002",
        customer_name: "Sarah Johnson",
        customer_phone: "+1 555-0124",
        device_model: "Samsung Galaxy S23",
        repair_type: "battery-replacement",
        cost: 3500,
        profit: 1500,
        status: "in-progress",
        payment_method: "cash",
        payment_status: "completed",
        amount_paid: 3500,
        free_glass: false,
        created_at: new Date(Date.now() - 3600000).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "TXN-003",
        customer_name: "Mike Wilson",
        customer_phone: "+1 555-0125",
        device_model: "Google Pixel 7",
        repair_type: "charging-port",
        cost: 4500,
        profit: 2000,
        status: "pending",
        payment_method: "card",
        payment_status: "pending",
        amount_paid: 0,
        free_glass: false,
        created_at: new Date(Date.now() - 7200000).toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
    setRecentTransactions(mockTransactions);
  };

  const loadRealData = async () => {
    // Load dashboard statistics
    const stats = await StatisticsService.getDashboardStats("month");
    setDashboardStats(stats);

    // Load recent transactions
    const transactionsResponse = await TransactionService.getAll({
      limit: 5,
      page: 1,
    });
    setRecentTransactions(transactionsResponse.transactions);

    // Load revenue data (you might want to get this from a different endpoint)
    // For now, we'll generate some sample data based on stats
    const weeklyData = generateWeeklyData(stats);
    setWeeklyRevenue(weeklyData);

    // Load repair type data
    const repairStats = await StatisticsService.getRepairStats();
    const repairChartData = repairStats.repair_types.map((type, index) => ({
      type: type.type,
      count: type.count,
      revenue: type.revenue,
      color: getRepairTypeColor(index),
    }));
    setRepairTypeData(repairChartData);
  };

  const generateWeeklyData = (stats: DashboardStats): ChartData[] => {
    // Generate sample weekly data based on current stats
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const avgDaily = stats.revenue.this_month / 30;

    return days.map((day, index) => ({
      day,
      revenue: Math.round(avgDaily * (0.8 + Math.random() * 0.4)),
      repairs: Math.round(
        (stats.transactions.total_this_month / 30) *
          (0.8 + Math.random() * 0.4),
      ),
      profit: Math.round(avgDaily * 0.3 * (0.8 + Math.random() * 0.4)),
    }));
  };

  const getRepairTypeColor = (index: number): string => {
    // High contrast colors optimized for dark themes
    const colors = [
      "#60a5fa", // Bright blue
      "#f87171", // Bright red
      "#34d399", // Bright green
      "#fbbf24", // Bright yellow
      "#a78bfa", // Bright purple
      "#06b6d4", // Bright cyan
    ];
    return colors[index % colors.length];
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: {
        label: "Completed",
        className:
          "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200 border border-green-300 dark:border-green-700 font-medium",
      },
      "in-progress": {
        label: "In Progress",
        className:
          "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200 border border-blue-300 dark:border-blue-700 font-medium",
      },
      pending: {
        label: "Pending",
        className:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-700 font-medium",
      },
    };

    return (
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    );
  };

  const getPaymentMethodIcon = (method: string) => {
    const icons = {
      cash: <Banknote className="h-3 w-3" />,
      upi: <Phone className="h-3 w-3" />,
      card: <CreditCard className="h-3 w-3" />,
      "bank-transfer": <Receipt className="h-3 w-3" />,
    };
    return (
      icons[method as keyof typeof icons] || <Banknote className="h-3 w-3" />
    );
  };

  if (isLoading && !dashboardStats) {
    return (
      <div className="space-y-6 p-4 md:p-6 lg:p-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {isDemoMode ? "Demo User" : user?.name || "User"}!
          </h1>
          <p className="text-muted-foreground mt-2">
            Here's what's happening with your repair shop today.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {isOffline && (
            <Badge variant="destructive" className="flex items-center">
              <WifiOff className="h-3 w-3 mr-1" />
              Offline
            </Badge>
          )}
          <Button onClick={loadDashboardData} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button asChild>
            <Link to="/transactions/new">
              <Plus className="mr-2 h-4 w-4" />
              New Transaction
            </Link>
          </Button>
        </div>
      </div>

      {/* Demo Role Switcher */}
      {isDemoMode && (
        <DemoRoleSwitcher currentRole={demoRole} onRoleChange={setDemoRole} />
      )}

      {/* Offline Alert */}
      {isOffline && !isDemoMode && (
        <Alert>
          <WifiOff className="h-4 w-4" />
          <AlertDescription>
            You're currently offline. Data shown may not be up to date.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-l-4 border-l-slate-400">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Revenue
            </CardTitle>
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
              <DollarSign className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{dashboardStats?.revenue.today.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats?.revenue.growth_percentage !== undefined ? (
                <span
                  className={`flex items-center font-medium ${
                    dashboardStats.revenue.growth_percentage > 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {dashboardStats.revenue.growth_percentage > 0 ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(dashboardStats.revenue.growth_percentage).toFixed(
                    1,
                  )}
                  % from yesterday
                </span>
              ) : (
                <span className="text-muted-foreground">No data available</span>
              )}
            </p>
=======
    <AppLayout showBreadcrumbs={false}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {t("dashboard")}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Welcome back! Here's your repair shop overview for today.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" className="h-10 sm:h-9">
              <Calendar className="mr-2 h-4 w-4" />
              Today: {new Date().toLocaleDateString()}
            </Button>
            {permissions.canViewProfits && (
              <Button
                variant="outline"
                size="sm"
                onClick={toggleProfits}
                className="h-10 sm:h-9"
              >
                {showProfits ? (
                  <EyeOff className="mr-2 h-4 w-4" />
                ) : (
                  <Eye className="mr-2 h-4 w-4" />
                )}
                {showProfits ? "Hide Profits" : "Show Profits"}
              </Button>
            )}
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("today-revenue")}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                ₹{todayRevenue.toLocaleString()}
              </div>
              {showProfits && todayProfit && (
                <div className="text-sm text-muted-foreground">
                  Profit: ₹{todayProfit.toLocaleString()}
                </div>
              )}
              <div className="flex items-center text-xs text-success">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +18.2% from yesterday
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("pending-repairs")}
              </CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {pendingRepairs}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                5 in progress, 2 new
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("inventory-alerts")}
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {inventoryAlerts}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                Critical stock items
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Weekly Total
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{weeklyTotal.toLocaleString()}
              </div>
              {showProfits && weeklyProfitTotal && (
                <div className="text-sm text-muted-foreground">
                  Profit: ₹{weeklyProfitTotal.toLocaleString()}
                </div>
              )}
              <div className="flex items-center text-xs text-success">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +12.5% from last week
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Device Models Summary - Worker gets limited view */}
        {isWorker && (
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">
                Supported Device Models
              </CardTitle>
              <CardDescription className="text-sm">
                Device models you can work with (+ custom models)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {[
                  "iPhone 15 Pro",
                  "iPhone 14",
                  "Samsung S24",
                  "OnePlus 12",
                  "Google Pixel",
                  "Others",
                ].map((model) => (
                  <div
                    key={model}
                    className="flex items-center gap-2 p-2 rounded-lg border"
                  >
                    <Smartphone className="h-4 w-4 text-primary" />
                    <span className="text-sm">{model}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl">
              {t("quick-actions")}
            </CardTitle>
            <CardDescription className="text-sm">
              {isWorker
                ? "Available operations for workers"
                : "Frequently used repair shop operations"}
            </CardDescription>
          </CardHeader>
          <CardContent
            className={cn(
              "grid gap-3",
              isWorker
                ? "grid-cols-2 sm:grid-cols-3"
                : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
            )}
          >
            {/* Available to all roles */}
            <Link to="/customers/new">
              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2 w-full"
              >
                <Users className="h-6 w-6" />
                <span className="text-xs">Add New Customer</span>
              </Button>
            </Link>
            <Link to="/bills/new">
              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2 w-full"
              >
                <Receipt className="h-6 w-6" />
                <span className="text-xs">Generate Bill</span>
              </Button>
            </Link>
            <Link to="/suppliers">
              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2 w-full"
              >
                <Users className="h-6 w-6" />
                <span className="text-xs">Supplier Analysis</span>
              </Button>
            </Link>

            {/* Admin-only actions */}
            {!isWorker && (
              <>
                <Link to="/transactions/new">
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col gap-2 w-full"
                  >
                    <Plus className="h-6 w-6" />
                    <span className="text-xs">{t("new-transaction")}</span>
                  </Button>
                </Link>
                <Link to="/inventory">
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col gap-2 w-full"
                  >
                    <Package className="h-6 w-6" />
                    <span className="text-xs">{t("add-inventory")}</span>
                  </Button>
                </Link>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <CreditCard className="h-6 w-6" />
                  <span className="text-xs">{t("record-payment")}</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <ShoppingCart className="h-6 w-6" />
                  <span className="text-xs">Order Parts</span>
                </Button>
                <Link to="/reports">
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col gap-2 w-full"
                  >
                    <FileText className="h-6 w-6" />
                    <span className="text-xs">View Reports</span>
                  </Button>
                </Link>
              </>
            )}
>>>>>>> 52b5be12cb1add3e38352bfbd00fc725eee8d6cb
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-slate-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Transactions
            </CardTitle>
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
              <Wrench className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            </div>
          </CardHeader>
<<<<<<< HEAD
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats?.transactions.today || 0}
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              {dashboardStats?.transactions.pending || 0} pending •{" "}
              {dashboardStats?.transactions.completed || 0} completed
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-slate-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
              <Users className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats?.customers.total || 0}
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              {dashboardStats?.customers.new_this_month || 0} new this month
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Bills</CardTitle>
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
              <Receipt className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats?.bills.pending || 0}
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              ₹
              {dashboardStats?.bills.total_amount_pending.toLocaleString() || 0}{" "}
              outstanding
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* Revenue Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Weekly Revenue</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            {weeklyRevenue.length > 0 ? (
              <div className="chart-high-contrast">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={weeklyRevenue}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                      strokeWidth="1"
                    />
                    <XAxis
                      dataKey="day"
                      tick={{ fill: "hsl(var(--foreground))", fontWeight: 500 }}
                    />
                    <YAxis
                      tick={{ fill: "hsl(var(--foreground))", fontWeight: 500 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "2px solid hsl(var(--border))",
                        borderRadius: "8px",
                        color: "hsl(var(--foreground))",
                        fontWeight: 500,
                      }}
                      formatter={(value: number, name: string) => [
                        name === "revenue"
                          ? `₹${value.toLocaleString()}`
                          : value,
                        name === "revenue"
                          ? "Revenue"
                          : name === "repairs"
                            ? "Repairs"
                            : "Profit",
                      ]}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="#60a5fa"
                      stroke="#3b82f6"
                      strokeWidth="1"
                    />
                    <Bar
                      dataKey="profit"
                      fill="#34d399"
                      stroke="#16a34a"
                      strokeWidth="1"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[350px] text-muted-foreground">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No revenue data available</p>
                  <p className="text-sm">
                    Complete some transactions to see your weekly revenue chart
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Repair Types Chart */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Repair Types</CardTitle>
          </CardHeader>
          <CardContent>
            {repairTypeData.length > 0 ? (
              <>
                <div className="chart-high-contrast">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={repairTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="count"
                        stroke="hsl(var(--background))"
                        strokeWidth={2}
                      >
                        {repairTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "2px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--foreground))",
                          fontWeight: 500,
                        }}
                        formatter={(
                          value: number,
                          name: string,
                          props: any,
                        ) => [`${value} repairs`, props.payload.type]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {repairTypeData.slice(0, 4).map((item) => (
                    <div
                      key={item.type}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: item.color }}
                        />
                        <span>{item.type}</span>
                      </div>
                      <span className="font-medium">{item.count}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <div className="text-center">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No repair data available</p>
                  <p className="text-sm">
                    Start adding repairs to see the breakdown
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <p className="text-sm text-muted-foreground">
              Latest customer transactions and repairs
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/transactions">
              View All
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentTransactions.length > 0 ? (
            <div className="space-y-4">
              {recentTransactions.map((transaction) => {
                const statusConfig = getStatusBadge(transaction.status);
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border-2 border-border rounded-lg hover:bg-muted/50 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>
                          {transaction.customer_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {transaction.customer_name}
                        </p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="h-3 w-3 mr-1" />
                          {transaction.customer_phone}
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{transaction.device_model}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.repair_type.replace("-", " ")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ₹{transaction.cost.toLocaleString()}
                      </p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        {getPaymentMethodIcon(transaction.payment_method)}
                        <span className="ml-1 capitalize">
                          {transaction.payment_method.replace("-", " ")}
                        </span>
                      </div>
                    </div>
                    <div className="text-center">
                      <Badge className={statusConfig.className}>
                        {statusConfig.label}
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>
                          {new Date(
                            transaction.created_at,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
=======
          <CardContent className="px-3 sm:px-6">
            <div className="space-y-3 sm:space-y-4">
              {recentTransactions
                .slice(0, isWorker ? 3 : 5)
                .map((transaction) => {
                  const StatusIcon =
                    statusConfig[
                      transaction.status as keyof typeof statusConfig
                    ].icon;
                  const PaymentIcon =
                    paymentMethodIcons[
                      transaction.paymentMethod as keyof typeof paymentMethodIcons
                    ];

                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 sm:p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Smartphone className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-medium text-sm sm:text-base">
                                  {transaction.customer}
                                </p>
                                <Badge
                                  className={cn(
                                    "text-xs flex-shrink-0",
                                    statusConfig[
                                      transaction.status as keyof typeof statusConfig
                                    ].color,
                                  )}
                                >
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {t(
                                    statusConfig[
                                      transaction.status as keyof typeof statusConfig
                                    ].label,
                                  )}
                                </Badge>
                              </div>
                              <div className="text-xs sm:text-sm text-muted-foreground">
                                <span className="font-medium">
                                  {transaction.device}
                                </span>
                                {" • "}
                                <span>
                                  {t(transaction.repair.toLowerCase())}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>
                                  {transaction.date} at {transaction.time}
                                </span>
                                <PaymentIcon className="h-3 w-3" />
                                <span>{t(transaction.paymentMethod)}</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-4">
                              <div className="text-right">
                                <div className="font-semibold text-sm sm:text-base">
                                  ₹{transaction.amount.toLocaleString()}
                                </div>
                                {showProfits && (
                                  <div className="text-xs text-success">
                                    Profit: ₹
                                    {transaction.profit.toLocaleString()}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
>>>>>>> 52b5be12cb1add3e38352bfbd00fc725eee8d6cb
            </div>
          ) : (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <div className="text-center">
                <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No transactions yet</p>
                <p className="text-sm mb-4">
                  Start by creating your first transaction
                </p>
                <Button asChild>
                  <Link to="/transactions/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Transaction
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Last Updated */}
      {lastUpdated && (
        <div className="text-center text-xs text-muted-foreground">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}