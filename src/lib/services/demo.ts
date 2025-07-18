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
}

export default DemoDataService;
