import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import DemoDataService from "@/lib/services/demo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CalendarDays,
  Receipt,
  Building,
  CreditCard,
  Banknote,
  QrCode,
  FileText,
} from "lucide-react";
import { useRole } from "@/hooks/use-role";

interface Expenditure {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  paymentMethod: "cash" | "upi" | "card" | "bank_transfer";
  supplier: string;
  notes: string;
  receiptUrl: string | null;
}

interface CategoryData {
  name: string;
  amount: number;
  color: string;
}

interface MonthlyData {
  month: string;
  expenses: number;
  revenue: number;
  profit: number;
}

export default function Expenditures() {
  const { role } = useRole();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [expenditures, setExpenditures] = useState<Expenditure[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const isDemoMode = localStorage.getItem("demo_mode") === "true";

  // Load demo data for demo users
  useEffect(() => {
    const loadData = async () => {
      if (isDemoMode) {
        try {
          const demoExpenditures = await DemoDataService.getDemoExpenditures();
          setExpenditures(
            demoExpenditures.map((exp: any) => ({
              id: exp.id,
              date: new Date(exp.date).toLocaleDateString(),
              description: exp.description,
              category: exp.category,
              amount: exp.amount,
              paymentMethod: "bank_transfer" as const,
              supplier: "Demo Supplier",
              notes: "Demo expenditure record",
              receiptUrl: null,
            })),
          );

          // Set demo category data
          setCategoryData([
            { name: "Inventory", amount: 45000, color: "#3b82f6" },
            { name: "Rent", amount: 25000, color: "#ef4444" },
            { name: "Salary", amount: 80000, color: "#10b981" },
            { name: "Utilities", amount: 12000, color: "#f59e0b" },
            { name: "Marketing", amount: 8000, color: "#8b5cf6" },
          ]);

          // Set demo monthly data
          setMonthlyData([
            { month: "Jan", expenses: 150000, revenue: 384500, profit: 234500 },
            { month: "Dec", expenses: 140000, revenue: 342800, profit: 202800 },
            { month: "Nov", expenses: 135000, revenue: 325000, profit: 190000 },
          ]);
        } catch (error) {
          console.error("Failed to load demo expenditures:", error);
        }
      }
      setIsLoading(false);
    };

    loadData();
  }, [isDemoMode]);

  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);

  const [newExpenditure, setNewExpenditure] = useState({
    description: "",
    category: "Inventory",
    amount: 0,
    paymentMethod: "bank_transfer" as const,
    supplier: "",
    notes: "",
  });

  const categories = [
    "Inventory",
    "Rent",
    "Utilities",
    "Equipment",
    "Marketing",
    "Staff",
    "Other",
  ];

  const filteredExpenditures = expenditures.filter((exp) => {
    const matchesSearch =
      exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || exp.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getPaymentMethodIcon = (method: string) => {
    const icons = {
      cash: <Banknote className="h-3 w-3" />,
      upi: <QrCode className="h-3 w-3" />,
      card: <CreditCard className="h-3 w-3" />,
      bank_transfer: <Building className="h-3 w-3" />,
    };
    return (
      icons[method as keyof typeof icons] || <Banknote className="h-3 w-3" />
    );
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Inventory: "#3B82F6",
      Rent: "#DC2626",
      Utilities: "#16A34A",
      Equipment: "#CA8A04",
      Marketing: "#9333EA",
      Staff: "#0891B2",
      Other: "#6B7280",
    };
    return colors[category] || "#6B7280";
  };

  const handleAddExpenditure = () => {
    if (!newExpenditure.description || !newExpenditure.supplier) {
      return;
    }

    const expenditure: Expenditure = {
      id: `EXP${(expenditures.length + 1).toString().padStart(3, "0")}`,
      date: new Date().toISOString().split("T")[0],
      ...newExpenditure,
      receiptUrl: null,
    };

    setExpenditures([expenditure, ...expenditures]);
    setNewExpenditure({
      description: "",
      category: "Inventory",
      amount: 0,
      paymentMethod: "bank_transfer",
      supplier: "",
      notes: "",
    });
    setIsAddDialogOpen(false);

    // Update category data
    updateCategoryData([expenditure, ...expenditures]);
  };

  const handleDeleteExpenditure = (id: string) => {
    const updated = expenditures.filter((exp) => exp.id !== id);
    setExpenditures(updated);
    updateCategoryData(updated);
  };

  const updateCategoryData = (data: Expenditure[]) => {
    const categoryTotals = data.reduce(
      (acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
      },
      {} as { [key: string]: number },
    );

    const categoryChartData = Object.entries(categoryTotals).map(
      ([category, amount]) => ({
        name: category,
        amount,
        color: getCategoryColor(category),
      }),
    );

    setCategoryData(categoryChartData);
  };

  const totalExpenses = expenditures.reduce((sum, exp) => sum + exp.amount, 0);
  const monthlyExpenses = expenditures.filter((exp) => {
    const expDate = new Date(exp.date);
    const now = new Date();
    return (
      expDate.getMonth() === now.getMonth() &&
      expDate.getFullYear() === now.getFullYear()
    );
  }).length;

  const recentExpenses = expenditures.slice(0, 5);

  // Only show expenditures for admin role
  if (role === "worker") {
    return (
      <div className="space-y-8 p-8">
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
          <p className="text-muted-foreground">
            Expenditure data is only available to administrators.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expenditures</h1>
          <p className="text-muted-foreground mt-2">
            Track and manage all business expenses and outgoing payments
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Expenditure
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Expenditure</DialogTitle>
              <DialogDescription>
                Record a new business expense or payment.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Input
                  id="description"
                  value={newExpenditure.description}
                  onChange={(e) =>
                    setNewExpenditure({
                      ...newExpenditure,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter expenditure description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newExpenditure.category}
                    onValueChange={(value) =>
                      setNewExpenditure({ ...newExpenditure, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₹) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newExpenditure.amount}
                    onChange={(e) =>
                      setNewExpenditure({
                        ...newExpenditure,
                        amount: Number(e.target.value),
                      })
                    }
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select
                    value={newExpenditure.paymentMethod}
                    onValueChange={(value) =>
                      setNewExpenditure({
                        ...newExpenditure,
                        paymentMethod: value as any,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="bank_transfer">
                        Bank Transfer
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier/Vendor *</Label>
                  <Input
                    id="supplier"
                    value={newExpenditure.supplier}
                    onChange={(e) =>
                      setNewExpenditure({
                        ...newExpenditure,
                        supplier: e.target.value,
                      })
                    }
                    placeholder="Enter supplier name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newExpenditure.notes}
                  onChange={(e) =>
                    setNewExpenditure({
                      ...newExpenditure,
                      notes: e.target.value,
                    })
                  }
                  placeholder="Additional notes or details"
                  rows={2}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddExpenditure}>Add Expenditure</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenditures
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{totalExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {expenditures.length} total transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              This Month's Expenses
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyExpenses}</div>
            <p className="text-xs text-muted-foreground">Expenses this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Expense
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹
              {expenditures.length > 0
                ? Math.round(
                    totalExpenses / expenditures.length,
                  ).toLocaleString()
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* Category Breakdown Chart */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="amount"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [
                        `₹${value.toLocaleString()}`,
                        "Amount",
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {categoryData.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: item.color }}
                        />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">
                        ₹{item.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <div className="text-center">
                  <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No expense data available</p>
                  <p className="text-sm">
                    Add some expenditures to see the breakdown
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Expenditures */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Expenditures</CardTitle>
          </CardHeader>
          <CardContent>
            {recentExpenses.length > 0 ? (
              <div className="space-y-4">
                {recentExpenses.map((expenditure) => (
                  <div
                    key={expenditure.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: getCategoryColor(
                            expenditure.category,
                          ),
                        }}
                      />
                      <div>
                        <p className="font-medium">{expenditure.description}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Building className="h-3 w-3 mr-1" />
                          {expenditure.supplier}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ₹{expenditure.amount.toLocaleString()}
                      </p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        {getPaymentMethodIcon(expenditure.paymentMethod)}
                        <span className="ml-1 capitalize">
                          {expenditure.paymentMethod.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                    <Badge variant="secondary">{expenditure.category}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <div className="text-center">
                  <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No recent expenditures</p>
                  <p className="text-sm">
                    Start by adding your first expenditure
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* All Expenditures Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Expenditures</CardTitle>
            <div className="text-sm text-muted-foreground">
              {filteredExpenditures.length} of {expenditures.length}{" "}
              expenditures
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="mb-6 flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-2 flex-1">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search expenditures..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {expenditures.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenditures.map((expenditure) => (
                    <TableRow
                      key={expenditure.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center">
                          <CalendarDays className="mr-2 h-3 w-3" />
                          {new Date(expenditure.date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {expenditure.description}
                          </div>
                          {expenditure.notes && (
                            <div className="text-sm text-muted-foreground">
                              {expenditure.notes}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          style={{
                            backgroundColor: `${getCategoryColor(expenditure.category)}15`,
                            color: getCategoryColor(expenditure.category),
                          }}
                        >
                          {expenditure.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          ₹{expenditure.amount.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getPaymentMethodIcon(expenditure.paymentMethod)}
                          <span className="ml-2 capitalize">
                            {expenditure.paymentMethod.replace("_", " ")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Building className="mr-2 h-3 w-3" />
                          {expenditure.supplier}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() =>
                                handleDeleteExpenditure(expenditure.id)
                              }
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <div className="text-center">
                <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No expenditures yet</p>
                <p className="text-sm mb-4">
                  Start by recording your first business expense
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Expenditure
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
