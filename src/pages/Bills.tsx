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
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download,
  Send,
  MessageSquare,
  Mail,
  Phone,
  Calendar,
  Receipt,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
}

interface BillItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Bill {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  items: BillItem[];
  notes?: string;
  dueDate?: string;
}

export default function Bills() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const isDemoMode = localStorage.getItem("demo_mode") === "true";

  // Load demo data for demo users
  useEffect(() => {
    const loadData = async () => {
      if (isDemoMode) {
        try {
          const demoBills = await DemoDataService.getDemoBills();
          setBills(
            demoBills.map((bill: any) => ({
              id: bill.id,
              customerName: bill.supplier_name,
              customerPhone: "+91 9876543210",
              customerEmail: `${bill.supplier_name.toLowerCase().replace(/\s+/g, "")}@supplier.com`,
              date: new Date(bill.created_at).toLocaleDateString(),
              amount: bill.amount,
              status: bill.status,
              items: [
                {
                  description: "Parts and Services",
                  quantity: 1,
                  rate: bill.amount,
                  amount: bill.amount,
                },
              ],
              notes: `Bill from ${bill.supplier_name}`,
              dueDate: new Date(bill.due_date).toLocaleDateString(),
            })),
          );
        } catch (error) {
          console.error("Failed to load demo bills:", error);
        }
      }
      setIsLoading(false);
    };

    loadData();
  }, [isDemoMode]);

  const [newBill, setNewBill] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    items: [{ description: "", quantity: 1, rate: 0, amount: 0 }],
    notes: "",
  });

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );

  const filteredBills = bills.filter((bill) => {
    const matchesSearch =
      bill.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.customerPhone.includes(searchTerm) ||
      bill.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || bill.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      paid: {
        label: "Paid",
        className:
          "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
        icon: CheckCircle,
      },
      pending: {
        label: "Pending",
        className:
          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
        icon: Clock,
      },
      overdue: {
        label: "Overdue",
        className:
          "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
        icon: AlertTriangle,
      },
    };
    return (
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    );
  };

  const calculateItemAmount = (quantity: number, rate: number) => {
    return quantity * rate;
  };

  const calculateTotalAmount = () => {
    return newBill.items.reduce(
      (total, item) => total + calculateItemAmount(item.quantity, item.rate),
      0,
    );
  };

  const handleItemChange = (
    index: number,
    field: keyof BillItem,
    value: string | number,
  ) => {
    const updatedItems = [...newBill.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    // Auto-calculate amount when quantity or rate changes
    if (field === "quantity" || field === "rate") {
      updatedItems[index].amount = calculateItemAmount(
        updatedItems[index].quantity,
        updatedItems[index].rate,
      );
    }

    setNewBill({ ...newBill, items: updatedItems });
  };

  const addNewItem = () => {
    setNewBill({
      ...newBill,
      items: [
        ...newBill.items,
        { description: "", quantity: 1, rate: 0, amount: 0 },
      ],
    });
  };

  const removeItem = (index: number) => {
    if (newBill.items.length > 1) {
      const updatedItems = newBill.items.filter((_, i) => i !== index);
      setNewBill({ ...newBill, items: updatedItems });
    }
  };

  const handleCustomerSelect = (customerId: string) => {
    const customer = customers.find((c) => c.id.toString() === customerId);
    if (customer) {
      setSelectedCustomer(customer);
      setNewBill({
        ...newBill,
        customerName: customer.name,
        customerPhone: customer.phone,
        customerEmail: customer.email,
      });
    }
  };

  const handleCreateBill = () => {
    if (
      !newBill.customerName ||
      !newBill.customerPhone ||
      newBill.items.length === 0
    ) {
      return;
    }

    const bill: Bill = {
      id: `INV-${(bills.length + 1).toString().padStart(3, "0")}`,
      customerName: newBill.customerName,
      customerPhone: newBill.customerPhone,
      customerEmail: newBill.customerEmail,
      date: new Date().toISOString().split("T")[0],
      amount: calculateTotalAmount(),
      status: "pending",
      items: newBill.items.filter((item) => item.description.trim() !== ""),
      notes: newBill.notes,
    };

    setBills([bill, ...bills]);
    setNewBill({
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      items: [{ description: "", quantity: 1, rate: 0, amount: 0 }],
      notes: "",
    });
    setSelectedCustomer(null);
    setShowCreateDialog(false);
  };

  const handleDownloadPDF = (bill: Bill) => {
    console.log("Downloading PDF for bill:", bill.id);
    // PDF download implementation would go here
  };

  const handleSendSMS = (bill: Bill) => {
    console.log("Sending SMS for bill:", bill.id);
    // SMS implementation would go here
  };

  const handleSendEmail = (bill: Bill) => {
    console.log("Sending email for bill:", bill.id);
    // Email implementation would go here
  };

  const handleDeleteBill = (billId: string) => {
    setBills(bills.filter((b) => b.id !== billId));
  };

  const stats = {
    totalBills: bills.length,
    paidBills: bills.filter((b) => b.status === "paid").length,
    pendingAmount: bills
      .filter((b) => b.status !== "paid")
      .reduce((sum, b) => sum + b.amount, 0),
    totalRevenue: bills
      .filter((b) => b.status === "paid")
      .reduce((sum, b) => sum + b.amount, 0),
  };

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Bills & Invoices
          </h1>
          <p className="text-muted-foreground mt-2">
            Create, manage, and track customer bills and invoices
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Bill
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Bill</DialogTitle>
              <DialogDescription>
                Generate an invoice for your customer with itemized billing.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              {/* Customer Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerSelect">Select Customer</Label>
                    <Select onValueChange={handleCustomerSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose existing customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem
                            key={customer.id}
                            value={customer.id.toString()}
                          >
                            {customer.name} - {customer.phone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setNewBill({
                          customerName: "",
                          customerPhone: "",
                          customerEmail: "",
                          items: [
                            {
                              description: "",
                              quantity: 1,
                              rate: 0,
                              amount: 0,
                            },
                          ],
                          notes: "",
                        });
                        setSelectedCustomer(null);
                      }}
                    >
                      Clear Selection
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Customer Name *</Label>
                    <Input
                      id="customerName"
                      value={newBill.customerName}
                      onChange={(e) =>
                        setNewBill({ ...newBill, customerName: e.target.value })
                      }
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerPhone">Phone Number *</Label>
                    <Input
                      id="customerPhone"
                      value={newBill.customerPhone}
                      onChange={(e) =>
                        setNewBill({
                          ...newBill,
                          customerPhone: e.target.value,
                        })
                      }
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Email Address</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={newBill.customerEmail}
                    onChange={(e) =>
                      setNewBill({ ...newBill, customerEmail: e.target.value })
                    }
                    placeholder="customer@email.com"
                  />
                </div>
              </div>

              {/* Bill Items */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Bill Items</h3>
                  <Button variant="outline" size="sm" onClick={addNewItem}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </div>
                <div className="space-y-3">
                  {newBill.items.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-3 items-end"
                    >
                      <div className="col-span-5 space-y-2">
                        <Label>Description</Label>
                        <Input
                          value={item.description}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "description",
                              e.target.value,
                            )
                          }
                          placeholder="Item description"
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label>Qty</Label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "quantity",
                              Number(e.target.value),
                            )
                          }
                          min="0"
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label>Rate (₹)</Label>
                        <Input
                          type="number"
                          value={item.rate}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "rate",
                              Number(e.target.value),
                            )
                          }
                          min="0"
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label>Amount (₹)</Label>
                        <Input
                          value={item.amount.toLocaleString()}
                          readOnly
                          className="bg-muted"
                        />
                      </div>
                      <div className="col-span-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(index)}
                          disabled={newBill.items.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end">
                  <div className="text-right">
                    <div className="text-lg font-semibold">
                      Total: ₹{calculateTotalAmount().toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newBill.notes}
                  onChange={(e) =>
                    setNewBill({ ...newBill, notes: e.target.value })
                  }
                  placeholder="Additional notes or terms"
                  rows={2}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateBill}>Create Bill</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bills</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBills}</div>
            <p className="text-xs text-muted-foreground">Bills generated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Bills</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.paidBills}
            </div>
            <p className="text-xs text-muted-foreground">Successfully paid</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Amount
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              ₹{stats.pendingAmount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{stats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">From paid bills</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Bills</CardTitle>
            <div className="text-sm text-muted-foreground">
              {filteredBills.length} of {bills.length} bills
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
                  placeholder="Search bills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {bills.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bill ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBills.map((bill) => {
                    const statusConfig = getStatusBadge(bill.status);
                    const StatusIcon = statusConfig.icon;

                    return (
                      <TableRow
                        key={bill.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <TableCell>
                          <div className="font-mono text-sm">{bill.id}</div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {bill.customerName}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Phone className="mr-1 h-3 w-3" />
                              {bill.customerPhone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-3 w-3" />
                            {new Date(bill.date).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            ₹{bill.amount.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusConfig.className}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {statusConfig.label}
                          </Badge>
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
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDownloadPDF(bill)}
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Download PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleSendEmail(bill)}
                              >
                                <Mail className="mr-2 h-4 w-4" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleSendSMS(bill)}
                              >
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Send SMS
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteBill(bill.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <div className="text-center">
                <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No bills created yet</p>
                <p className="text-sm mb-4">
                  Start by creating your first customer bill or invoice
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Bill
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
