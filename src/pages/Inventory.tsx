import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Package,
  AlertTriangle,
  Smartphone,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Building,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRole } from "@/hooks/use-role";

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  compatibleDevices: string[];
  purchaseCost: number;
  sellingPrice: number;
  currentStock: number;
  minStockLevel: number;
  supplier: string;
  lastRestocked: string;
  status: "good" | "low" | "critical" | "out-of-stock";
}

export default function Inventory() {
  const { role } = useRole();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [newItem, setNewItem] = useState({
    name: "",
    category: "Display",
    compatibleDevices: "",
    purchaseCost: 0,
    sellingPrice: 0,
    currentStock: 0,
    minStockLevel: 5,
    supplier: "",
  });

  const categories = [
    "Display",
    "Battery",
    "Charging Port",
    "Speaker",
    "Camera",
    "Other",
  ];

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStockStatus = (
    currentStock: number,
    minStockLevel: number,
  ): "good" | "low" | "critical" | "out-of-stock" => {
    if (currentStock === 0) return "out-of-stock";
    if (currentStock <= minStockLevel * 0.5) return "critical";
    if (currentStock <= minStockLevel) return "low";
    return "good";
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      good: {
        label: "Good Stock",
        className:
          "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
      },
      low: {
        label: "Low Stock",
        className:
          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
      },
      critical: {
        label: "Critical",
        className:
          "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
      },
      "out-of-stock": {
        label: "Out of Stock",
        className:
          "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400",
      },
    };
    return (
      statusConfig[status as keyof typeof statusConfig] || statusConfig.good
    );
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.supplier) {
      return;
    }

    const item: InventoryItem = {
      id: items.length + 1,
      ...newItem,
      compatibleDevices: newItem.compatibleDevices
        .split(",")
        .map((d) => d.trim()),
      lastRestocked: new Date().toISOString().split("T")[0],
      status: getStockStatus(newItem.currentStock, newItem.minStockLevel),
    };

    setItems([...items, item]);
    setNewItem({
      name: "",
      category: "Display",
      compatibleDevices: "",
      purchaseCost: 0,
      sellingPrice: 0,
      currentStock: 0,
      minStockLevel: 5,
      supplier: "",
    });
    setShowAddDialog(false);
  };

  const handleDeleteItem = (itemId: number) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  const stats = {
    totalItems: items.length,
    lowStockItems: items.filter(
      (item) => item.status === "low" || item.status === "critical",
    ).length,
    outOfStockItems: items.filter((item) => item.status === "out-of-stock")
      .length,
    totalValue: items.reduce(
      (sum, item) => sum + item.currentStock * item.purchaseCost,
      0,
    ),
  };

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground mt-2">
            {role === "worker"
              ? "View inventory items and stock levels"
              : "Manage your parts inventory and stock levels"}
          </p>
        </div>
        {role === "admin" && (
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Inventory Item</DialogTitle>
                <DialogDescription>
                  Add a new item to your inventory database.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Item Name *</Label>
                    <Input
                      id="name"
                      value={newItem.name}
                      onChange={(e) =>
                        setNewItem({ ...newItem, name: e.target.value })
                      }
                      placeholder="Enter item name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newItem.category}
                      onValueChange={(value) =>
                        setNewItem({ ...newItem, category: value })
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
                </div>
                <div className="space-y-2">
                  <Label htmlFor="devices">Compatible Devices</Label>
                  <Input
                    id="devices"
                    value={newItem.compatibleDevices}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        compatibleDevices: e.target.value,
                      })
                    }
                    placeholder="iPhone 14, Samsung S23 (comma separated)"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="purchaseCost">Purchase Cost (₹)</Label>
                    <Input
                      id="purchaseCost"
                      type="number"
                      value={newItem.purchaseCost}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          purchaseCost: Number(e.target.value),
                        })
                      }
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sellingPrice">Selling Price (₹)</Label>
                    <Input
                      id="sellingPrice"
                      type="number"
                      value={newItem.sellingPrice}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          sellingPrice: Number(e.target.value),
                        })
                      }
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentStock">Current Stock</Label>
                    <Input
                      id="currentStock"
                      type="number"
                      value={newItem.currentStock}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          currentStock: Number(e.target.value),
                        })
                      }
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minStockLevel">Min Stock Level</Label>
                    <Input
                      id="minStockLevel"
                      type="number"
                      value={newItem.minStockLevel}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          minStockLevel: Number(e.target.value),
                        })
                      }
                      placeholder="5"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier *</Label>
                  <Input
                    id="supplier"
                    value={newItem.supplier}
                    onChange={(e) =>
                      setNewItem({ ...newItem, supplier: e.target.value })
                    }
                    placeholder="Supplier name"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAddDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddItem}>Add Item</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
            <p className="text-xs text-muted-foreground">Items in inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Alert
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.lowStockItems}
            </div>
            <p className="text-xs text-muted-foreground">
              Items need restocking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.outOfStockItems}
            </div>
            <p className="text-xs text-muted-foreground">Items out of stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{stats.totalValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Current inventory value
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Inventory Items</CardTitle>
            <div className="text-sm text-muted-foreground">
              {filteredItems.length} of {items.length} items
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
                  placeholder="Search items..."
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="good">Good Stock</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {items.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Compatible Devices</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Pricing</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Status</TableHead>
                    {role === "admin" && (
                      <TableHead className="text-right">Actions</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => {
                    const statusConfig = getStatusBadge(item.status);
                    const margin = item.sellingPrice - item.purchaseCost;
                    const marginPercent =
                      item.purchaseCost > 0
                        ? (margin / item.purchaseCost) * 100
                        : 0;

                    return (
                      <TableRow
                        key={item.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <Badge variant="secondary" className="mt-1">
                              {item.category}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {item.compatibleDevices
                              .slice(0, 2)
                              .map((device, index) => (
                                <div
                                  key={index}
                                  className="flex items-center text-sm"
                                >
                                  <Smartphone className="mr-1 h-3 w-3" />
                                  {device}
                                </div>
                              ))}
                            {item.compatibleDevices.length > 2 && (
                              <div className="text-xs text-muted-foreground">
                                +{item.compatibleDevices.length - 2} more
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {item.currentStock} units
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Min: {item.minStockLevel}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">
                              Cost: ₹{item.purchaseCost.toLocaleString()}
                            </div>
                            <div className="text-sm">
                              Sell: ₹{item.sellingPrice.toLocaleString()}
                            </div>
                            <div
                              className={`text-xs ${marginPercent > 0 ? "text-green-600" : "text-red-600"}`}
                            >
                              Margin: {marginPercent.toFixed(1)}%
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="flex items-center text-sm">
                              <Building className="mr-1 h-3 w-3" />
                              {item.supplier}
                            </div>
                            {item.lastRestocked && (
                              <div className="text-xs text-muted-foreground">
                                Last: {item.lastRestocked}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusConfig.className}>
                            {statusConfig.label}
                          </Badge>
                        </TableCell>
                        {role === "admin" && (
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
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleDeleteItem(item.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <div className="text-center">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">
                  No inventory items yet
                </p>
                <p className="text-sm mb-4">
                  {role === "worker"
                    ? "No items have been added to inventory yet"
                    : "Start by adding your first inventory item"}
                </p>
                {role === "admin" && (
                  <Button onClick={() => setShowAddDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
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
