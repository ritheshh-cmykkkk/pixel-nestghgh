import { AppLayout } from "@/components/layout/AppLayout";
import { useRole } from "@/hooks/use-role";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Receipt,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Smartphone,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export default function WorkerHome() {
  const { role } = useRole();
  const { t } = useLanguage();

  // Mock data for worker stats
  const todaysStats = {
    transactionsCreated: 3,
    billsGenerated: 5,
    pendingTasks: 2,
  };

  const quickStats = [
    {
      label: "Today's Transactions",
      value: todaysStats.transactionsCreated,
      icon: Plus,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      label: "Bills Generated",
      value: todaysStats.billsGenerated,
      icon: Receipt,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      label: "Pending Tasks",
      value: todaysStats.pendingTasks,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950",
    },
  ];

  return (
    <AppLayout showBreadcrumbs={false}>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Welcome, Worker
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Ready to help customers with their mobile repair needs
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <User className="h-3 w-3" />
              Worker Mode
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3" />
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          {quickStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              Your Available Actions
            </CardTitle>
            <CardDescription>
              Essential functions for helping customers with their device
              repairs
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            {/* New Transaction */}
            <Link to="/transactions/new" className="group">
              <Card className="h-full transition-all hover:shadow-md group-hover:border-primary/50">
                <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                  <div className="rounded-full bg-blue-100 p-4 dark:bg-blue-950">
                    <Plus className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">New Transaction</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Record new repair requests and customer details
                    </p>
                  </div>
                  <Button className="w-full" size="sm">
                    Create Transaction
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Generate Bill */}
            <Link to="/bills/new" className="group">
              <Card className="h-full transition-all hover:shadow-md group-hover:border-primary/50">
                <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                  <div className="rounded-full bg-green-100 p-4 dark:bg-green-950">
                    <Receipt className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Generate Bill</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Create invoices for completed repairs and services
                    </p>
                  </div>
                  <Button className="w-full" size="sm" variant="outline">
                    Create Bill
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Supplier Analysis */}
            <Link to="/suppliers" className="group">
              <Card className="h-full transition-all hover:shadow-md group-hover:border-primary/50">
                <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                  <div className="rounded-full bg-purple-100 p-4 dark:bg-purple-950">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Supplier Analysis</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Check supplier information and part availability
                    </p>
                  </div>
                  <Button className="w-full" size="sm" variant="outline">
                    View Suppliers
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Your latest work and pending tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <div className="rounded-full bg-green-100 p-2 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  Created transaction #TXN-2024-001
                </p>
                <p className="text-xs text-muted-foreground">
                  2 hours ago • iPhone 14 Screen Replacement
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-950">
                <Receipt className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  Generated bill for customer
                </p>
                <p className="text-xs text-muted-foreground">
                  4 hours ago • ₹12,500 for Rajesh Kumar
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <div className="rounded-full bg-orange-100 p-2 dark:bg-orange-950">
                <Clock className="h-4 w-4 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  Pending: Follow up with supplier
                </p>
                <p className="text-xs text-muted-foreground">
                  Due today • Check Samsung S23 battery availability
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips & Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Worker Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5 text-xs">
                1
              </Badge>
              <span>
                Always verify customer contact details before creating
                transactions
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5 text-xs">
                2
              </Badge>
              <span>Generate bills immediately after completing repairs</span>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5 text-xs">
                3
              </Badge>
              <span>
                Check supplier availability before promising delivery dates
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5 text-xs">
                4
              </Badge>
              <span>
                You can delete transactions within 24 hours of creation
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
