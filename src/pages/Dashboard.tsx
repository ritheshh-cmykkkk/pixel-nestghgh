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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { StatisticsService, DashboardStats } from "@/lib/services/statistics";
import { TransactionService, Transaction } from "@/lib/services/transactions";
import { toast } from "@/hooks/use-toast";

interface ChartData {
  day: string;
  revenue: number;
  repairs: number;
  profit: number;
}

interface RepairTypeData {
  type: string;
  count: number;
  revenue: number;
  color: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null,
  );
  const [weeklyRevenue, setWeeklyRevenue] = useState<ChartData[]>([]);
  const [repairTypeData, setRepairTypeData] = useState<RepairTypeData[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

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
    const colors = [
      "#3b82f6",
      "#dc2626",
      "#16a34a",
      "#ca8a04",
      "#9333ea",
      "#0891b2",
    ];
    return colors[index % colors.length];
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: {
        label: "Completed",
        className:
          "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
      },
      "in-progress": {
        label: "In Progress",
        className:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
      },
      pending: {
        label: "Pending",
        className:
          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
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
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.name || "Admin"}!
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

      {/* Offline Alert */}
      {isOffline && (
        <Alert>
          <WifiOff className="h-4 w-4" />
          <AlertDescription>
            You're currently offline. Data shown may not be up to date.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{dashboardStats?.revenue.today.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats?.revenue.growth_percentage !== undefined ? (
                <span
                  className={`flex items-center ${
                    dashboardStats.revenue.growth_percentage > 0
                      ? "text-green-600"
                      : "text-red-600"
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
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Transactions
            </CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats?.transactions.today || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats?.transactions.pending || 0} pending •{" "}
              {dashboardStats?.transactions.completed || 0} completed
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats?.customers.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats?.customers.new_this_month || 0} new this month
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Bills</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats?.bills.pending || 0}
            </div>
            <p className="text-xs text-muted-foreground">
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
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={weeklyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      name === "revenue" ? `₹${value.toLocaleString()}` : value,
                      name === "revenue"
                        ? "Revenue"
                        : name === "repairs"
                          ? "Repairs"
                          : "Profit",
                    ]}
                  />
                  <Bar dataKey="revenue" fill="#3b82f6" />
                  <Bar dataKey="profit" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
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
                    >
                      {repairTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number, name: string, props: any) => [
                        `${value} repairs`,
                        props.payload.type,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
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
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
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
