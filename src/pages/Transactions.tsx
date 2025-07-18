<<<<<<< HEAD
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DemoDataService from "@/lib/services/demo";
=======
import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  createColumnHelper,
  flexRender,
} from "@tanstack/react-table";
import { AppLayout } from "@/components/layout/AppLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRole } from "@/hooks/use-role";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
>>>>>>> 52b5be12cb1add3e38352bfbd00fc725eee8d6cb
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Plus,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Phone,
  Smartphone,
  CalendarDays,
  Banknote,
  CreditCard,
  Receipt,
  QrCode,
  ArrowUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRole } from "@/hooks/use-role";

interface Transaction {
  id: string;
  date: Date;
  customer: string;
  phone: string;
  device: string;
  repairType: string;
  cost: number;
  profit: number;
  status: "pending" | "in-progress" | "completed" | "delivered";
  paymentMethod: "cash" | "upi" | "card";
  freeGlass: boolean;
}

<<<<<<< HEAD
export default function Transactions() {
  const { role } = useRole();
  const [data, setData] = useState<Transaction[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [isLoading, setIsLoading] = useState(true);
  const isDemoMode = localStorage.getItem("demo_mode") === "true";
=======
const mockTransactions: Transaction[] = [
  {
    id: "TXN-001",
    date: new Date("2024-01-15"),
    customer: "Rajesh Kumar",
    phone: "+91 98765 43210",
    device: "iPhone 14 Pro",
    repairType: "screen-replacement",
    cost: 12500,
    profit: 4500,
    status: "completed",
    paymentMethod: "upi",
    freeGlass: true,
  },
  {
    id: "TXN-002",
    date: new Date("2024-01-15"),
    customer: "Priya Sharma",
    phone: "+91 98765 43211",
    device: "Samsung Galaxy S23",
    repairType: "battery-replacement",
    cost: 3500,
    profit: 1500,
    status: "in-progress",
    paymentMethod: "cash",
    freeGlass: false,
  },
  {
    id: "TXN-003",
    date: new Date("2024-01-14"),
    customer: "Mohammed Ali",
    phone: "+91 98765 43212",
    device: "OnePlus 11",
    repairType: "charging-port",
    cost: 4500,
    profit: 2000,
    status: "pending",
    paymentMethod: "card",
    freeGlass: false,
  },
  {
    id: "TXN-004",
    date: new Date("2024-01-14"),
    customer: "Sunita Devi",
    phone: "+91 98765 43213",
    device: "iPhone 13",
    repairType: "screen-replacement",
    cost: 15000,
    profit: 5500,
    status: "completed",
    paymentMethod: "card",
    freeGlass: true,
  },
  {
    id: "TXN-005",
    date: new Date("2024-01-13"),
    customer: "Arjun Reddy",
    phone: "+91 98765 43214",
    device: "Google Pixel 7",
    repairType: "camera-repair",
    cost: 8500,
    profit: 3500,
    status: "delivered",
    paymentMethod: "upi",
    freeGlass: false,
  },
];

const statusConfig = {
  pending: { label: "pending", color: "status-pending" },
  "in-progress": { label: "in-progress", color: "status-progress" },
  completed: { label: "completed", color: "status-completed" },
  delivered: { label: "delivered", color: "status-delivered" },
};

export default function Transactions() {
  const { permissions, canDeleteTransaction } = useRole();
  const [data, setData] = useState(mockTransactions);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [showProfits, setShowProfits] = useState(
    localStorage.getItem("showProfits") === "true" &&
      permissions.canViewProfits,
  );
  const { t } = useLanguage();
>>>>>>> 52b5be12cb1add3e38352bfbd00fc725eee8d6cb

  // Load demo data for demo users
  useEffect(() => {
    const loadData = async () => {
      if (isDemoMode) {
        try {
          const demoTransactions =
            await DemoDataService.getRoleBasedTransactions("owner");
          setData(
            demoTransactions.map((txn: any) => ({
              id: txn.id,
              date: new Date(txn.created_at),
              customer: txn.customer_name,
              phone: txn.customer_phone,
              device: txn.device_model,
              repairType: txn.repair_type,
              cost: txn.cost,
              profit: txn.profit,
              status: txn.status,
              paymentMethod: txn.payment_method,
              freeGlass: txn.free_glass,
              _demoWorkerCanAccess: txn._demoWorkerCanAccess,
              _demoWorkerCanDelete: txn._demoWorkerCanDelete,
              _demoRestrictionNote: txn._demoRestrictionNote,
            })),
          );
        } catch (error) {
          console.error("Failed to load demo transactions:", error);
        }
      }
      setIsLoading(false);
    };

    loadData();
  }, [isDemoMode]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        label: "Pending",
        className:
          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
      },
      "in-progress": {
        label: "In Progress",
        className:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
      },
      completed: {
        label: "Completed",
        className:
          "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
      },
      delivered: {
        label: "Delivered",
        className:
          "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
      },
    };
    return (
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    );
  };

  const getPaymentMethodIcon = (method: string) => {
    const icons = {
      cash: <Banknote className="h-3 w-3" />,
      upi: <QrCode className="h-3 w-3" />,
      card: <CreditCard className="h-3 w-3" />,
      "bank-transfer": <Receipt className="h-3 w-3" />,
    };
    return (
      icons[method as keyof typeof icons] || <Banknote className="h-3 w-3" />
    );
  };

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Transaction ID
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.getValue("id")}</div>
      ),
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          <CalendarDays className="mr-2 h-3 w-3" />
          Date
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = row.getValue("date") as Date;
        return <div>{date.toLocaleDateString()}</div>;
      },
    },
    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue("customer")}</div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Phone className="mr-1 h-3 w-3" />
            {row.getValue("phone")}
          </div>
<<<<<<< HEAD
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => (
        <div className="flex items-center">
          <Phone className="mr-2 h-3 w-3" />
          {row.getValue("phone")}
        </div>
      ),
    },
    {
      accessorKey: "device",
      header: "Device",
      cell: ({ row }) => (
        <div className="flex items-center">
          <Smartphone className="mr-2 h-3 w-3" />
          {row.getValue("device")}
        </div>
      ),
    },
    {
      accessorKey: "repairType",
      header: "Repair Type",
      cell: ({ row }) => (
        <div className="capitalize">
          {(row.getValue("repairType") as string).replace("-", " ")}
        </div>
      ),
    },
    {
      accessorKey: "cost",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Amount
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">
          ₹{(row.getValue("cost") as number).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "profit",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Profit
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium text-green-600">
          ₹{(row.getValue("profit") as number).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "paymentMethod",
      header: "Payment",
      cell: ({ row }) => {
        const method = row.getValue("paymentMethod") as string;
        return (
          <div className="flex items-center">
            {getPaymentMethodIcon(method)}
            <span className="ml-2 capitalize">{method.replace("-", " ")}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const statusConfig = getStatusBadge(status);
        return (
          <Badge className={statusConfig.className}>{statusConfig.label}</Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/transactions/${transaction.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              {role === "admin" && (
                <>
                  <DropdownMenuItem asChild>
                    <Link to={`/transactions/${transaction.id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Filter columns based on role
  const visibleColumns =
    role === "worker"
      ? columns.filter((col) => col.accessorKey !== "profit")
      : columns;
=======
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const canDelete = canDeleteTransaction(row.original.date);
          const canEdit = permissions.canDeleteTransactions; // Use same permission for edit

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(row.original.id)}
                >
                  Copy transaction ID
                </DropdownMenuItem>
                {(canEdit || canDelete) && (
                  <>
                    <DropdownMenuSeparator />
                    {canEdit && (
                      <DropdownMenuItem asChild>
                        <Link to={`/transactions/${row.original.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit transaction
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {canDelete ? (
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(row.original.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete transaction
                      </DropdownMenuItem>
                    ) : (
                      permissions.canDeleteTransactions && (
                        <DropdownMenuItem
                          disabled
                          className="text-muted-foreground"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete (24h limit exceeded)
                        </DropdownMenuItem>
                      )
                    )}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      }),
    ],
    [showProfits, t],
  );

  const filteredData = useMemo(() => {
    let transactions = data.filter((transaction) => {
      const matchesStatus =
        statusFilter === "all" || transaction.status === statusFilter;
      const matchesPayment =
        paymentFilter === "all" || transaction.paymentMethod === paymentFilter;
      return matchesStatus && matchesPayment;
    });

    // Limit transactions for workers
    if (
      permissions.maxTransactionsView &&
      transactions.length > permissions.maxTransactionsView
    ) {
      transactions = transactions.slice(0, permissions.maxTransactionsView);
    }

    return transactions;
  }, [data, statusFilter, paymentFilter, permissions.maxTransactionsView]);
>>>>>>> 52b5be12cb1add3e38352bfbd00fc725eee8d6cb

  const table = useReactTable({
    data: role === "worker" ? data.slice(0, 10) : data, // Limit data for workers
    columns: visibleColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
  });

<<<<<<< HEAD
  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground mt-2">
            Manage all repair transactions and customer orders
          </p>
=======
  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((transaction) => transaction.id !== id));
    toast({
      title: "Transaction Deleted",
      description: "Transaction has been removed successfully.",
      variant: "destructive",
    });
  };

  const toggleProfits = () => {
    if (!permissions.canViewProfits) return;
    const newValue = !showProfits;
    setShowProfits(newValue);
    localStorage.setItem("showProfits", newValue.toString());
  };

  const exportToExcel = () => {
    // In a real app, this would export to Excel
    toast({
      title: "Export Started",
      description: "Exporting transactions to Excel format...",
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {t("transactions")}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {permissions.maxTransactionsView
                ? `View recent transactions (limited to ${permissions.maxTransactionsView} entries) • Can delete within 24 hours`
                : "Manage and track all repair transactions"}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
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
            <Button
              variant="outline"
              size="sm"
              onClick={exportToExcel}
              className="h-10 sm:h-9"
            >
              <Download className="mr-2 h-4 w-4" />
              {t("export")}
            </Button>
            {permissions.canDeleteTransactions && (
              <Link to="/transactions/new">
                <Button size="sm" className="h-10 sm:h-9">
                  <Plus className="mr-2 h-4 w-4" />
                  {t("new-transaction")}
                </Button>
              </Link>
            )}
          </div>
>>>>>>> 52b5be12cb1add3e38352bfbd00fc725eee8d6cb
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          {role === "admin" && (
            <Button asChild>
              <Link to="/transactions/new">
                <Plus className="mr-2 h-4 w-4" />
                New Transaction
              </Link>
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>All Transactions</CardTitle>
            {role === "worker" && (
              <Badge variant="secondary">Showing last 10 transactions</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="mb-6 flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-2 flex-1">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-9"
                />
              </div>
<<<<<<< HEAD
              <Select
                value={
                  (table.getColumn("status")?.getFilterValue() as string) ?? ""
                }
                onValueChange={(value) =>
                  table
                    .getColumn("status")
                    ?.setFilterValue(value === "all" ? "" : value)
                }
              >
                <SelectTrigger className="w-[150px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
=======
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">{t("pending")}</SelectItem>
                    <SelectItem value="in-progress">
                      {t("in-progress")}
                    </SelectItem>
                    <SelectItem value="completed">{t("completed")}</SelectItem>
                    <SelectItem value="delivered">{t("delivered")}</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Payments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payments</SelectItem>
                    <SelectItem value="cash">{t("cash")}</SelectItem>
                    <SelectItem value="upi">{t("upi")}</SelectItem>
                    <SelectItem value="card">{t("card")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
>>>>>>> 52b5be12cb1add3e38352bfbd00fc725eee8d6cb
            </div>
          </div>

          {data.length > 0 ? (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                          className="hover:bg-muted/50 transition-colors"
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={visibleColumns.length}
                          className="h-24 text-center"
                        >
                          No transactions found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                  Showing {table.getFilteredRowModel().rows.length} of{" "}
                  {data.length} transactions
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <div className="text-center">
                <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No transactions yet</p>
                <p className="text-sm mb-4">
                  Start by creating your first transaction
                </p>
                {role === "admin" && (
                  <Button asChild>
                    <Link to="/transactions/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Transaction
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
