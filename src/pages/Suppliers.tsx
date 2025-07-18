import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  RoleBasedAccess,
  WorkerRestrictedButton,
} from "@/components/auth/RoleBasedAccess";
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
  Phone,
  Mail,
  MapPin,
  Building,
  Package,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  outstandingAmount: number;
  totalPurchases: number;
  lastOrderDate: string;
  status: "active" | "inactive";
  paymentTerms: string;
  category: string;
}

const defaultSuppliers = ["patel", "mahalaxmi", "rathod", "sri ramdev", "hub"];

export default function Suppliers() {
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const isDemoMode = localStorage.getItem("demo_mode") === "true";

  // Load demo data for demo users
  useEffect(() => {
    const loadData = async () => {
      if (isDemoMode) {
        try {
          const demoSuppliers = await DemoDataService.getDemoSuppliers("owner");
          setSuppliers(
            demoSuppliers.map((sup: any) => ({
              id: sup.id,
              name: sup.name,
              contactPerson: sup.contact_person,
              phone: sup.phone,
              email: sup.email,
              address: sup.address,
              status: "active" as const,
              paymentTerms: "30 days",
              category: "Electronics",
              totalOrders: Math.floor(Math.random() * 50) + 10,
              totalAmount: Math.floor(Math.random() * 100000) + 50000,
              lastOrderDate: new Date(sup.created_at).toLocaleDateString(),
              _demoWorkerCanAccess: sup._demoWorkerCanAccess,
              _demoWorkerCanDelete: sup._demoWorkerCanDelete,
              _demoRestrictionNote: sup._demoRestrictionNote,
            })),
          );
        } catch (error) {
          console.error("Failed to load demo suppliers:", error);
        }
      }
      setIsLoading(false);
    };

    loadData();
  }, [isDemoMode]);

  const [newSupplier, setNewSupplier] = useState({
    name: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    paymentTerms: "30 days",
    category: "Electronics",
  });

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || supplier.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: {
        label: "Active",
        className:
          "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
        icon: CheckCircle,
      },
      inactive: {
        label: "Inactive",
        className:
          "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400",
        icon: Clock,
      },
    };
    return (
      statusConfig[status as keyof typeof statusConfig] || statusConfig.active
    );
  };

  const handleAddSupplier = () => {
    if (!newSupplier.name || !newSupplier.contactPerson || !newSupplier.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const supplier: Supplier = {
      id: `SUP${(suppliers.length + 1).toString().padStart(3, "0")}`,
      ...newSupplier,
      outstandingAmount: 0,
      totalPurchases: 0,
      lastOrderDate: "",
      status: "active" as const,
    };

    setSuppliers([...suppliers, supplier]);
    setNewSupplier({
      name: "",
      contactPerson: "",
      phone: "",
      email: "",
      address: "",
      paymentTerms: "30 days",
      category: "Electronics",
    });
    setShowAddDialog(false);

    toast({
      title: "Supplier Added",
      description: `${supplier.name} has been added successfully.`,
    });
  };

  const handleDeleteSupplier = (supplierId: string) => {
    setSuppliers(suppliers.filter((s) => s.id !== supplierId));
    toast({
      title: "Supplier Deleted",
      description: "Supplier has been removed successfully.",
    });
  };

  const quickAddSupplier = (name: string) => {
    const supplier: Supplier = {
      id: `SUP${(suppliers.length + 1).toString().padStart(3, "0")}`,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      contactPerson: "",
      phone: "",
      email: "",
      address: "",
      outstandingAmount: 0,
      totalPurchases: 0,
      lastOrderDate: "",
      status: "active",
      paymentTerms: "30 days",
      category: "Electronics",
    };

    setSuppliers([...suppliers, supplier]);
    toast({
      title: "Supplier Added",
      description: `${supplier.name} has been added to your suppliers.`,
    });
  };

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
          <p className="text-muted-foreground mt-2">
            Manage your supplier relationships and purchase history
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Supplier</DialogTitle>
              <DialogDescription>
                Enter supplier information to add them to your database.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Supplier Name *</Label>
                  <Input
                    id="name"
                    value={newSupplier.name}
                    onChange={(e) =>
                      setNewSupplier({ ...newSupplier, name: e.target.value })
                    }
                    placeholder="Enter supplier name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Contact Person *</Label>
                  <Input
                    id="contactPerson"
                    value={newSupplier.contactPerson}
                    onChange={(e) =>
                      setNewSupplier({
                        ...newSupplier,
                        contactPerson: e.target.value,
                      })
                    }
                    placeholder="Contact person name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={newSupplier.phone}
                    onChange={(e) =>
                      setNewSupplier({ ...newSupplier, phone: e.target.value })
                    }
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newSupplier.email}
                    onChange={(e) =>
                      setNewSupplier({ ...newSupplier, email: e.target.value })
                    }
                    placeholder="supplier@email.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={newSupplier.address}
                  onChange={(e) =>
                    setNewSupplier({ ...newSupplier, address: e.target.value })
                  }
                  placeholder="Enter supplier address"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newSupplier.category}
                    onValueChange={(value) =>
                      setNewSupplier({ ...newSupplier, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Parts">Parts</SelectItem>
                      <SelectItem value="Tools">Tools</SelectItem>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentTerms">Payment Terms</Label>
                  <Select
                    value={newSupplier.paymentTerms}
                    onValueChange={(value) =>
                      setNewSupplier({ ...newSupplier, paymentTerms: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Immediate">Immediate</SelectItem>
                      <SelectItem value="15 days">15 days</SelectItem>
                      <SelectItem value="30 days">30 days</SelectItem>
                      <SelectItem value="45 days">45 days</SelectItem>
                      <SelectItem value="60 days">60 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSupplier}>Add Supplier</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Add Default Suppliers */}
      {suppliers.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Quick Setup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Get started quickly by adding common suppliers:
            </p>
            <div className="flex flex-wrap gap-2">
              {defaultSuppliers.map((supplier) => (
                <Button
                  key={supplier}
                  variant="outline"
                  size="sm"
                  onClick={() => quickAddSupplier(supplier)}
                  className="capitalize"
                >
                  <Plus className="mr-1 h-3 w-3" />
                  {supplier}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Suppliers</CardTitle>
            <div className="text-sm text-muted-foreground">
              {suppliers.length} total suppliers
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
                  placeholder="Search suppliers..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {suppliers.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Payment Terms</TableHead>
                    <TableHead>Total Purchases</TableHead>
                    <TableHead>Outstanding</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuppliers.map((supplier) => {
                    const statusConfig = getStatusBadge(supplier.status);
                    const StatusIcon = statusConfig.icon;

                    return (
                      <TableRow
                        key={supplier.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <TableCell>
                          <div>
                            <div className="font-medium">{supplier.name}</div>
                            <div className="text-sm text-muted-foreground">
                              ID: {supplier.id}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Building className="mr-2 h-3 w-3" />
                              {supplier.contactPerson || "Not specified"}
                            </div>
                            {supplier.phone && (
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Phone className="mr-2 h-3 w-3" />
                                {supplier.phone}
                              </div>
                            )}
                            {supplier.email && (
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Mail className="mr-2 h-3 w-3" />
                                {supplier.email}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{supplier.category}</Badge>
                        </TableCell>
                        <TableCell>{supplier.paymentTerms}</TableCell>
                        <TableCell>
                          <div className="font-medium">
                            ₹{supplier.totalPurchases.toLocaleString()}
                          </div>
                          {supplier.lastOrderDate && (
                            <div className="text-sm text-muted-foreground">
                              Last: {supplier.lastOrderDate}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div
                            className={`font-medium ${supplier.outstandingAmount > 0 ? "text-red-600" : "text-green-600"}`}
                          >
                            ₹{supplier.outstandingAmount.toLocaleString()}
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
                              <DropdownMenuItem asChild>
                                <Link to={`/suppliers/${supplier.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() =>
                                  handleDeleteSupplier(supplier.id)
                                }
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
                <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No suppliers yet</p>
                <p className="text-sm mb-4">
                  Add your first supplier to get started
                </p>
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Supplier
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
