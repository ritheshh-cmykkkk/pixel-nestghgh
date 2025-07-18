import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DemoDataService from "@/lib/services/demo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  DollarSign,
  Users,
  Wrench,
  Package,
  BarChart3,
  PieChart as PieChartIcon,
  FileBarChart,
  Filter,
} from "lucide-react";
import { useRole } from "@/hooks/use-role";

interface MonthlyRevenueData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
  repairs: number;
}

interface RepairTypeData {
  type: string;
  count: number;
  revenue: number;
  avgTicket: number;
  color: string;
}

interface CustomerAnalytics {
  segment: string;
  count: number;
  percentage: number;
  revenue: number;
}

interface DeviceBrandData {
  brand: string;
  repairs: number;
  revenue: number;
  avgTicket: number;
}

interface TopCustomer {
  name: string;
  repairs: number;
  revenue: number;
  lastVisit: string;
}

interface SupplierSpending {
  supplier: string;
  amount: number;
  transactions: number;
  avgOrder: number;
}

export default function Reports() {
  const { role } = useRole();
  const [dateFilter, setDateFilter] = useState("last-6-months");
  const [reportType, setReportType] = useState("revenue");
  const [isLoading, setIsLoading] = useState(true);
  const isDemoMode = localStorage.getItem("demo_mode") === "true";

  // Initialize empty data states
  const [monthlyRevenueData, setMonthlyRevenueData] = useState<
    MonthlyRevenueData[]
  >([]);
  const [repairTypeData, setRepairTypeData] = useState<RepairTypeData[]>([]);
  const [customerAnalyticsData, setCustomerAnalyticsData] = useState<
    CustomerAnalytics[]
  >([]);
  const [deviceBrandData, setDeviceBrandData] = useState<DeviceBrandData[]>([]);
  const [topCustomersData, setTopCustomersData] = useState<TopCustomer[]>([]);
  const [supplierSpendingData, setSupplierSpendingData] = useState<
    SupplierSpending[]
  >([]);

  // Load demo data for demo users
  useEffect(() => {
    const loadData = async () => {
      if (isDemoMode) {
        try {
          const demoReports = await DemoDataService.getDemoReports();

          // Set monthly revenue data
          setMonthlyRevenueData([
            {
              month: "Aug",
              revenue: 320000,
              expenses: 180000,
              profit: 140000,
              repairs: 76,
            },
            {
              month: "Sep",
              revenue: 350000,
              expenses: 195000,
              profit: 155000,
              repairs: 82,
            },
            {
              month: "Oct",
              revenue: 380000,
              expenses: 210000,
              profit: 170000,
              repairs: 89,
            },
            {
              month: "Nov",
              revenue: 342800,
              expenses: 195000,
              profit: 147800,
              repairs: 78,
            },
            {
              month: "Dec",
              revenue: 384500,
              expenses: 215000,
              profit: 169500,
              repairs: 94,
            },
            {
              month: "Jan",
              revenue: 420000,
              expenses: 230000,
              profit: 190000,
              repairs: 102,
            },
          ]);

          // Set repair type data
          setRepairTypeData(
            demoReports.top_repairs.map((repair: any, index: number) => ({
              type: repair.type,
              count: repair.count,
              revenue: repair.revenue,
              avgTicket: Math.round(repair.revenue / repair.count),
              color: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"][
                index
              ],
            })),
          );

          // Set customer analytics
          setCustomerAnalyticsData([
            { segment: "Regular", count: 89, percentage: 57, revenue: 245000 },
            { segment: "New", count: 45, percentage: 29, revenue: 98000 },
            { segment: "VIP", count: 22, percentage: 14, revenue: 156000 },
          ]);

          // Set device brand data
          setDeviceBrandData([
            { brand: "iPhone", repairs: 45, revenue: 180000, avgTicket: 4000 },
            { brand: "Samsung", repairs: 38, revenue: 152000, avgTicket: 4000 },
            { brand: "OnePlus", repairs: 25, revenue: 75000, avgTicket: 3000 },
            { brand: "Google", repairs: 18, revenue: 54000, avgTicket: 3000 },
            { brand: "Others", repairs: 12, revenue: 24000, avgTicket: 2000 },
          ]);

          // Set top customers
          setTopCustomersData([
            {
              name: "John Smith",
              repairs: 8,
              revenue: 32000,
              lastVisit: "2024-01-15",
            },
            {
              name: "Sarah Johnson",
              repairs: 6,
              revenue: 24000,
              lastVisit: "2024-01-14",
            },
            {
              name: "Mike Wilson",
              repairs: 5,
              revenue: 20000,
              lastVisit: "2024-01-13",
            },
            {
              name: "Emily Davis",
              repairs: 4,
              revenue: 16000,
              lastVisit: "2024-01-12",
            },
            {
              name: "David Brown",
              repairs: 4,
              revenue: 12000,
              lastVisit: "2024-01-11",
            },
          ]);

          // Set supplier spending
          setSupplierSpendingData([
            {
              supplier: "TechParts India",
              amount: 85000,
              transactions: 12,
              avgOrder: 7083,
            },
            {
              supplier: "Mobile Components Ltd",
              amount: 65000,
              transactions: 8,
              avgOrder: 8125,
            },
            {
              supplier: "Gadget Suppliers Co",
              amount: 45000,
              transactions: 6,
              avgOrder: 7500,
            },
          ]);
        } catch (error) {
          console.error("Failed to load demo reports:", error);
        }
      }
      setIsLoading(false);
    };

    loadData();
  }, [isDemoMode]);

  // Calculate totals from data
  const totals = {
    totalRevenue: monthlyRevenueData.reduce(
      (sum, month) => sum + month.revenue,
      0,
    ),
    totalExpenses: monthlyRevenueData.reduce(
      (sum, month) => sum + month.expenses,
      0,
    ),
    totalProfit: monthlyRevenueData.reduce(
      (sum, month) => sum + month.profit,
      0,
    ),
    totalRepairs: monthlyRevenueData.reduce(
      (sum, month) => sum + month.repairs,
      0,
    ),
  };

  const currentMonth =
    monthlyRevenueData.length > 0
      ? monthlyRevenueData[monthlyRevenueData.length - 1]
      : null;
  const previousMonth =
    monthlyRevenueData.length > 1
      ? monthlyRevenueData[monthlyRevenueData.length - 2]
      : null;

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const revenueGrowth =
    currentMonth && previousMonth
      ? calculateGrowth(currentMonth.revenue, previousMonth.revenue)
      : 0;
  const profitGrowth =
    currentMonth && previousMonth
      ? calculateGrowth(currentMonth.profit, previousMonth.profit)
      : 0;
  const repairGrowth =
    currentMonth && previousMonth
      ? calculateGrowth(currentMonth.repairs, previousMonth.repairs)
      : 0;

  // Only show reports for admin role
  if (role === "worker") {
    return (
      <div className="space-y-8 p-8">
        <div className="text-center py-12">
          <FileBarChart className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
          <p className="text-muted-foreground">
            Business reports are only available to administrators.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive business insights and performance analytics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7-days">Last 7 Days</SelectItem>
              <SelectItem value="last-30-days">Last 30 Days</SelectItem>
              <SelectItem value="last-3-months">Last 3 Months</SelectItem>
              <SelectItem value="last-6-months">Last 6 Months</SelectItem>
              <SelectItem value="last-year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{totals.totalRevenue.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {revenueGrowth > 0 ? (
                <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
              )}
              <span
                className={
                  revenueGrowth > 0 ? "text-green-600" : "text-red-600"
                }
              >
                {Math.abs(revenueGrowth).toFixed(1)}%
              </span>
              <span className="ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{totals.totalProfit.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {profitGrowth > 0 ? (
                <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
              )}
              <span
                className={profitGrowth > 0 ? "text-green-600" : "text-red-600"}
              >
                {Math.abs(profitGrowth).toFixed(1)}%
              </span>
              <span className="ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Repairs</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.totalRepairs}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {repairGrowth > 0 ? (
                <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
              )}
              <span
                className={repairGrowth > 0 ? "text-green-600" : "text-red-600"}
              >
                {Math.abs(repairGrowth).toFixed(1)}%
              </span>
              <span className="ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Ticket Size
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹
              {totals.totalRepairs > 0
                ? Math.round(
                    totals.totalRevenue / totals.totalRepairs,
                  ).toLocaleString()
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">Per repair job</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* Revenue Trend */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue & Profit Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyRevenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      `₹${value.toLocaleString()}`,
                      name === "revenue"
                        ? "Revenue"
                        : name === "expenses"
                          ? "Expenses"
                          : "Profit",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="profit"
                    stackId="2"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stackId="3"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[350px] text-muted-foreground">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No revenue data available</p>
                  <p className="text-sm">
                    Complete some transactions to see revenue trends
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Repair Types Distribution */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Repair Types</CardTitle>
          </CardHeader>
          <CardContent>
            {repairTypeData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={250}>
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
              <div className="flex items-center justify-center h-[350px] text-muted-foreground">
                <div className="text-center">
                  <PieChartIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Customers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
          </CardHeader>
          <CardContent>
            {topCustomersData.length > 0 ? (
              <div className="space-y-4">
                {topCustomersData.map((customer, index) => (
                  <div
                    key={customer.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {customer.repairs} repairs • Last visit:{" "}
                          {customer.lastVisit}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ₹{customer.revenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <div className="text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No customer data available</p>
                  <p className="text-sm">
                    Complete transactions to see top customers
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Device Brands */}
        <Card>
          <CardHeader>
            <CardTitle>Device Brands</CardTitle>
          </CardHeader>
          <CardContent>
            {deviceBrandData.length > 0 ? (
              <div className="space-y-4">
                {deviceBrandData.map((brand) => (
                  <div
                    key={brand.brand}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{brand.brand}</p>
                      <p className="text-sm text-muted-foreground">
                        {brand.repairs} repairs • Avg: ₹
                        {brand.avgTicket.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ₹{brand.revenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <div className="text-center">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No device data available</p>
                  <p className="text-sm">
                    Complete repairs to see device brand analytics
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Customer Analytics & Supplier Spending */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            {customerAnalyticsData.length > 0 ? (
              <div className="space-y-4">
                {customerAnalyticsData.map((segment) => (
                  <div key={segment.segment} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {segment.segment}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {segment.count} customers
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${segment.percentage}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{segment.percentage}% of total</span>
                      <span>₹{segment.revenue.toLocaleString()} revenue</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <div className="text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No customer analytics available</p>
                  <p className="text-sm">
                    Build customer base to see analytics
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Supplier Spending</CardTitle>
          </CardHeader>
          <CardContent>
            {supplierSpendingData.length > 0 ? (
              <div className="space-y-4">
                {supplierSpendingData.map((supplier) => (
                  <div
                    key={supplier.supplier}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{supplier.supplier}</p>
                      <p className="text-sm text-muted-foreground">
                        {supplier.transactions} orders • Avg: ₹
                        {supplier.avgOrder.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ₹{supplier.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <div className="text-center">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No supplier spending data</p>
                  <p className="text-sm">
                    Add expenditures to see supplier analytics
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
