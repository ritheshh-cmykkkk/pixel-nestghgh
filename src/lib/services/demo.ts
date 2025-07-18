// Demo data service for offline mode
import { DashboardStats } from "./statistics";
import { Transaction } from "./transactions";

export class DemoDataService {
  static async getDashboardStats(): Promise<DashboardStats> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
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
  }

  static async getRecentTransactions(): Promise<Transaction[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return [
      {
        id: "DEMO-001",
        customer_name: "John Smith",
        customer_phone: "+1 555-0123",
        customer_email: "john@example.com",
        device_model: "iPhone 14 Pro",
        repair_type: "screen-replacement",
        repair_description:
          "Cracked screen replacement with premium quality glass",
        cost: 12500,
        profit: 4500,
        status: "completed",
        payment_method: "upi",
        payment_status: "completed",
        amount_paid: 12500,
        free_glass: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        warranty_period: 90,
      },
      {
        id: "DEMO-002",
        customer_name: "Sarah Johnson",
        customer_phone: "+1 555-0124",
        customer_email: "sarah@example.com",
        device_model: "Samsung Galaxy S23",
        repair_type: "battery-replacement",
        repair_description: "Battery replacement with original Samsung battery",
        cost: 3500,
        profit: 1500,
        status: "in-progress",
        payment_method: "cash",
        payment_status: "completed",
        amount_paid: 3500,
        free_glass: false,
        created_at: new Date(Date.now() - 3600000).toISOString(),
        updated_at: new Date().toISOString(),
        warranty_period: 30,
      },
      {
        id: "DEMO-003",
        customer_name: "Mike Wilson",
        customer_phone: "+1 555-0125",
        customer_email: "mike@example.com",
        device_model: "Google Pixel 7",
        repair_type: "charging-port",
        repair_description: "USB-C charging port repair",
        cost: 4500,
        profit: 2000,
        status: "pending",
        payment_method: "card",
        payment_status: "pending",
        amount_paid: 0,
        free_glass: false,
        created_at: new Date(Date.now() - 7200000).toISOString(),
        updated_at: new Date().toISOString(),
        warranty_period: 30,
      },
      {
        id: "DEMO-004",
        customer_name: "Emily Davis",
        customer_phone: "+1 555-0126",
        customer_email: "emily@example.com",
        device_model: "iPhone 13",
        repair_type: "camera-repair",
        repair_description: "Front camera replacement",
        cost: 8500,
        profit: 3500,
        status: "completed",
        payment_method: "bank-transfer",
        payment_status: "completed",
        amount_paid: 8500,
        free_glass: false,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 3600000).toISOString(),
        completed_at: new Date(Date.now() - 3600000).toISOString(),
        warranty_period: 60,
      },
      {
        id: "DEMO-005",
        customer_name: "David Brown",
        customer_phone: "+1 555-0127",
        customer_email: "david@example.com",
        device_model: "OnePlus 11",
        repair_type: "speaker-repair",
        repair_description: "Bottom speaker replacement",
        cost: 2800,
        profit: 1200,
        status: "delivered",
        payment_method: "upi",
        payment_status: "completed",
        amount_paid: 2800,
        free_glass: false,
        created_at: new Date(Date.now() - 172800000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
        completed_at: new Date(Date.now() - 86400000).toISOString(),
        delivered_at: new Date(Date.now() - 86400000).toISOString(),
        warranty_period: 30,
      },
    ];
  }

  static getWeeklyRevenueData() {
    return [
      { day: "Mon", revenue: 12400, repairs: 6, profit: 4200 },
      { day: "Tue", revenue: 15600, repairs: 8, profit: 5300 },
      { day: "Wed", revenue: 18200, repairs: 9, profit: 6100 },
      { day: "Thu", revenue: 14800, repairs: 7, profit: 4900 },
      { day: "Fri", revenue: 21300, repairs: 11, profit: 7200 },
      { day: "Sat", revenue: 25600, repairs: 14, profit: 8500 },
      { day: "Sun", revenue: 19100, repairs: 10, profit: 6400 },
    ];
  }

  static getRepairTypeData() {
    return [
      {
        type: "Screen Replacement",
        count: 34,
        revenue: 102000,
        color: "#3b82f6",
        percentage: 38,
        average_value: 3000,
      },
      {
        type: "Battery Replacement",
        count: 28,
        revenue: 56000,
        color: "#dc2626",
        percentage: 31,
        average_value: 2000,
      },
      {
        type: "Charging Port",
        count: 18,
        revenue: 45000,
        color: "#16a34a",
        percentage: 20,
        average_value: 2500,
      },
      {
        type: "Speaker Repair",
        count: 12,
        revenue: 24000,
        color: "#ca8a04",
        percentage: 13,
        average_value: 2000,
      },
      {
        type: "Camera Repair",
        count: 8,
        revenue: 32000,
        color: "#9333ea",
        percentage: 9,
        average_value: 4000,
      },
    ];
  }

  static isDemoMode(): boolean {
    return localStorage.getItem("demo_mode") === "true";
  }

  static async simulateApiDelay(min = 200, max = 800): Promise<void> {
    const delay = Math.random() * (max - min) + min;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  // Role-based dashboard stats for demo
  static async getRoleBasedDashboardStats(
    role: string = "owner",
  ): Promise<DashboardStats> {
    await this.simulateApiDelay();

    const baseStats = await this.getDashboardStats();

    // Worker role sees limited data to demonstrate restrictions
    if (role === "worker") {
      return {
        ...baseStats,
        revenue: {
          today: baseStats.revenue.today,
          yesterday: baseStats.revenue.yesterday,
          this_month: 0, // Workers don't see monthly totals
          last_month: 0,
          growth_percentage: baseStats.revenue.growth_percentage,
        },
        transactions: {
          today: baseStats.transactions.today,
          pending: baseStats.transactions.pending,
          completed: 5, // Only recent completions
          total_this_month: 0, // Limited historical data
          growth_percentage: baseStats.transactions.growth_percentage,
        },
        customers: {
          total: 0, // Workers don't see total customer count
          new_this_month: 0,
          active: 12, // Only today's active customers
          growth_percentage: 0,
        },
        bills: {
          pending: 0, // Workers don't handle bills
          overdue: 0,
          paid_this_month: 0,
          total_amount_pending: 0,
        },
      };
    }

    return baseStats;
  }

  // Role-based transactions for demo
  static async getRoleBasedTransactions(
    role: string = "owner",
  ): Promise<Transaction[]> {
    const allTransactions = await this.getRecentTransactions();

    if (role === "worker") {
      // Add demo metadata to show worker restrictions
      return allTransactions.map((txn) => ({
        ...txn,
        _demoWorkerCanAccess: this.isWithin24Hours(txn.created_at),
        _demoWorkerCanDelete: this.isWithin24Hours(txn.created_at),
        _demoRestrictionNote: this.isWithin24Hours(txn.created_at)
          ? "Worker can edit/delete (within 24hrs)"
          : "Worker cannot edit/delete (over 24hrs old)",
      }));
    }

    return allTransactions;
  }

  // Mock suppliers for demo
  static async getDemoSuppliers(role: string = "owner") {
    await this.simulateApiDelay();

    const suppliers = [
      {
        id: "SUP-001",
        name: "TechParts India",
        contact_person: "Rajesh Kumar",
        phone: "+91 9876543210",
        email: "rajesh@techpartsindia.com",
        address: "Electronics Market, Delhi",
        created_at: new Date(Date.now() - 172800000).toISOString(), // 48 hours ago
      },
      {
        id: "SUP-002",
        name: "Mobile Components Ltd",
        contact_person: "Priya Sharma",
        phone: "+91 9876543211",
        email: "priya@mobilecomponents.com",
        address: "Tech Hub, Bangalore",
        created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      },
      {
        id: "SUP-003",
        name: "Gadget Suppliers Co",
        contact_person: "Ahmed Khan",
        phone: "+91 9876543212",
        email: "ahmed@gadgetsuppliers.com",
        address: "Tech Plaza, Mumbai",
        created_at: new Date().toISOString(), // Just now
      },
    ];

    if (role === "worker") {
      return suppliers.map((sup) => ({
        ...sup,
        _demoWorkerCanAccess: this.isWithin24Hours(sup.created_at),
        _demoWorkerCanDelete: this.isWithin24Hours(sup.created_at),
        _demoRestrictionNote: this.isWithin24Hours(sup.created_at)
          ? "Worker can edit/delete (within 24hrs)"
          : "Worker cannot edit/delete (over 24hrs old)",
      }));
    }

    return suppliers;
  }

  // Mock expenditures for demo (admin/owner only in real app)
  static async getDemoExpenditures() {
    await this.simulateApiDelay();

    return [
      {
        id: "EXP-001",
        description: "Office Rent - January",
        amount: 25000,
        category: "rent",
        date: new Date().toISOString(),
        created_at: new Date().toISOString(),
      },
      {
        id: "EXP-002",
        description: "Inventory Purchase - Screen Parts",
        amount: 45000,
        category: "inventory",
        date: new Date(Date.now() - 86400000).toISOString(),
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "EXP-003",
        description: "Staff Salaries",
        amount: 80000,
        category: "salary",
        date: new Date(Date.now() - 172800000).toISOString(),
        created_at: new Date(Date.now() - 172800000).toISOString(),
      },
    ];
  }

  // Mock bills for demo (admin/owner only in real app)
  static async getDemoBills() {
    await this.simulateApiDelay();

    return [
      {
        id: "BILL-001",
        supplier_name: "TechParts India",
        amount: 15000,
        due_date: new Date(Date.now() + 86400000).toISOString(),
        status: "pending",
        created_at: new Date().toISOString(),
      },
      {
        id: "BILL-002",
        supplier_name: "Mobile Components Ltd",
        amount: 8500,
        due_date: new Date(Date.now() - 86400000).toISOString(),
        status: "overdue",
        created_at: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: "BILL-003",
        supplier_name: "Gadget Suppliers Co",
        amount: 12000,
        due_date: new Date(Date.now() + 172800000).toISOString(),
        status: "pending",
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
    ];
  }

  // Mock reports for demo (admin/owner only in real app)
  static async getDemoReports() {
    await this.simulateApiDelay();

    return {
      monthly_revenue: 384500,
      monthly_profit: 142800,
      monthly_costs: 241700,
      profit_margin: 37.1,
      top_repairs: [
        { type: "Screen Replacement", count: 34, revenue: 102000 },
        { type: "Battery Replacement", count: 28, revenue: 56000 },
        { type: "Charging Port", count: 18, revenue: 45000 },
        { type: "Speaker Repair", count: 12, revenue: 24000 },
        { type: "Camera Repair", count: 8, revenue: 32000 },
      ],
      customer_satisfaction: 4.8,
      repeat_customers: 68,
      average_repair_time: 2.3, // days
    };
  }

  // Helper function to check if date is within 24 hours
  static isWithin24Hours(dateString: string): boolean {
    const date = new Date(dateString);
    const now = new Date();
    const hoursDiff = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    return hoursDiff <= 24;
  }

  // Get role-specific demo experience descriptions
  static getRoleExperienceInfo(role: "admin" | "owner" | "worker") {
    const roleInfo = {
      admin: {
        title: "Admin Experience",
        description: "Complete development and system access",
        capabilities: [
          "Full system configuration",
          "User management and roles",
          "Development tools access",
          "All business operations",
          "Complete historical data",
          "System settings and security",
        ],
        restrictions: [],
        color: "red",
      },
      owner: {
        title: "Owner Experience",
        description: "Complete business operational control",
        capabilities: [
          "All business operations",
          "Financial reports and analytics",
          "Staff management",
          "Supplier and bill management",
          "Complete historical data",
          "Business settings control",
        ],
        restrictions: ["No development/system configuration"],
        color: "blue",
      },
      worker: {
        title: "Worker Experience",
        description: "Limited operational access with time-based restrictions",
        capabilities: [
          "Daily transaction management",
          "Customer service operations",
          "Basic supplier interactions",
          "Personal settings only",
        ],
        restrictions: [
          "24-hour access limit on transactions",
          "24-hour deletion rights only",
          "No financial reports access",
          "No bill/expenditure management",
          "Limited historical data access",
          "Cannot see business analytics",
        ],
        color: "green",
      },
    };

    return roleInfo[role];
  }
}

export default DemoDataService;
