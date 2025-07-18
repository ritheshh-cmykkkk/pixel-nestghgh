import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  MapPin,
  Clock,
  AlertTriangle,
  TrendingUp,
  Eye,
  MoreVertical,
  CalendarDays,
  Banknote,
  CreditCard,
  Receipt,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface Transaction {
  id: number;
  customer: string;
  phone: string;
  device: string;
  repair: string;
  amount: number;
  cost: number;
  profit: number;
  status: "completed" | "in-progress" | "pending";
  date: string;
  time: string;
  paymentMethod: "cash" | "upi" | "card" | "bank-transfer";
}

interface DashboardStats {
  revenue: number;
  profit: number;
  repairs: number;
  customers: number;
}

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
  const [weeklyRevenue, setWeeklyRevenue] = useState<ChartData[]>([]);
  const [repairTypeData, setRepairTypeData] = useState<RepairTypeData[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    [],
  );

  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    revenue: 0,
    profit: 0,
    repairs: 0,
    customers: 0,
  });

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

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here's what's happening with your repair shop today.
          </p>
        </div>
        <Button asChild>
          <Link to="/transactions/new">
            <Plus className="mr-2 h-4 w-4" />
            New Transaction
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{dashboardStats.revenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats.revenue > 0 ? (
                <span className="text-green-600 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  No data available
                </span>
              ) : (
                <span className="text-muted-foreground">
                  No transactions yet
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{dashboardStats.profit.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats.profit > 0 ? (
                <span className="text-green-600 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  No data available
                </span>
              ) : (
                <span className="text-muted-foreground">No profits yet</span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Repairs</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.repairs}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats.repairs > 0 ? (
                <span className="text-green-600 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  Active repairs
                </span>
              ) : (
                <span className="text-muted-foreground">No repairs yet</span>
              )}
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
            <div className="text-2xl font-bold">{dashboardStats.customers}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats.customers > 0 ? (
                <span className="text-green-600 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  Registered customers
                </span>
              ) : (
                <span className="text-muted-foreground">No customers yet</span>
              )}
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
                  <BarChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
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
              {recentTransactions.slice(0, 5).map((transaction) => {
                const statusConfig = getStatusBadge(transaction.status);
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>
                          {transaction.customer
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{transaction.customer}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="h-3 w-3 mr-1" />
                          {transaction.phone}
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{transaction.device}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.repair}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ₹{transaction.amount.toLocaleString()}
                      </p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        {getPaymentMethodIcon(transaction.paymentMethod)}
                        <span className="ml-1 capitalize">
                          {transaction.paymentMethod}
                        </span>
                      </div>
                    </div>
                    <div className="text-center">
                      <Badge className={statusConfig.className}>
                        {statusConfig.label}
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{transaction.time}</span>
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
    </div>
  );
}
