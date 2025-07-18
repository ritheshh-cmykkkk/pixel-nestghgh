import api from "../api";

export interface RevenueReport {
  period: string;
  total_revenue: number;
  total_profit: number;
  total_transactions: number;
  average_transaction_value: number;
  monthly_data: Array<{
    month: string;
    revenue: number;
    profit: number;
    transactions: number;
  }>;
}

export interface RepairTypeReport {
  total_repairs: number;
  repair_types: Array<{
    repair_type: string;
    count: number;
    revenue: number;
    percentage: number;
    average_value: number;
  }>;
}

export interface CustomerReport {
  total_customers: number;
  new_customers: number;
  returning_customers: number;
  top_customers: Array<{
    customer_id: string;
    customer_name: string;
    total_spent: number;
    total_transactions: number;
    last_visit: string;
  }>;
  customer_segments: Array<{
    segment: string;
    count: number;
    percentage: number;
    revenue: number;
  }>;
}

export interface DeviceReport {
  total_devices: number;
  device_brands: Array<{
    brand: string;
    count: number;
    revenue: number;
    percentage: number;
  }>;
  device_models: Array<{
    model: string;
    count: number;
    revenue: number;
    average_repair_cost: number;
  }>;
}

export interface FinancialReport {
  period: string;
  total_revenue: number;
  total_expenses: number;
  gross_profit: number;
  net_profit: number;
  profit_margin: number;
  cash_flow: Array<{
    month: string;
    income: number;
    expenses: number;
    net_flow: number;
  }>;
  expense_categories: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
}

export interface PerformanceReport {
  period: string;
  total_repairs: number;
  completed_repairs: number;
  pending_repairs: number;
  average_completion_time: number; // in days
  completion_rate: number; // percentage
  customer_satisfaction: number; // percentage
  repeat_customer_rate: number; // percentage
  monthly_performance: Array<{
    month: string;
    repairs: number;
    completion_rate: number;
    avg_completion_time: number;
  }>;
}

export interface ReportFilters {
  date_from?: string;
  date_to?: string;
  period?: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
  repair_type?: string;
  device_brand?: string;
  customer_segment?: string;
}

export class ReportService {
  static async getRevenueReport(
    filters?: ReportFilters,
  ): Promise<RevenueReport> {
    const response = await api.get("/reports/revenue", { params: filters });
    return response.data;
  }

  static async getRepairTypeReport(
    filters?: ReportFilters,
  ): Promise<RepairTypeReport> {
    const response = await api.get("/reports/repair-types", {
      params: filters,
    });
    return response.data;
  }

  static async getCustomerReport(
    filters?: ReportFilters,
  ): Promise<CustomerReport> {
    const response = await api.get("/reports/customers", { params: filters });
    return response.data;
  }

  static async getDeviceReport(filters?: ReportFilters): Promise<DeviceReport> {
    const response = await api.get("/reports/devices", { params: filters });
    return response.data;
  }

  static async getFinancialReport(
    filters?: ReportFilters,
  ): Promise<FinancialReport> {
    const response = await api.get("/reports/financial", { params: filters });
    return response.data;
  }

  static async getPerformanceReport(
    filters?: ReportFilters,
  ): Promise<PerformanceReport> {
    const response = await api.get("/reports/performance", { params: filters });
    return response.data;
  }

  static async generateDashboardReport(
    period: "today" | "week" | "month" | "quarter" | "year",
  ): Promise<{
    revenue: RevenueReport;
    repair_types: RepairTypeReport;
    performance: PerformanceReport;
    top_customers: CustomerReport["top_customers"];
  }> {
    const response = await api.get("/reports/dashboard", {
      params: { period },
    });
    return response.data;
  }

  static async exportReport(
    reportType: string,
    format: "pdf" | "excel" | "csv",
    filters?: ReportFilters,
  ): Promise<Blob> {
    const response = await api.get(`/reports/${reportType}/export`, {
      params: { ...filters, format },
      responseType: "blob",
    });
    return response.data;
  }

  static async scheduleReport(
    reportType: string,
    schedule: {
      frequency: "daily" | "weekly" | "monthly";
      email: string;
      format: "pdf" | "excel";
    },
  ): Promise<void> {
    await api.post(`/reports/${reportType}/schedule`, schedule);
  }

  static async getScheduledReports(): Promise<
    Array<{
      id: string;
      report_type: string;
      frequency: string;
      email: string;
      format: string;
      is_active: boolean;
      created_at: string;
    }>
  > {
    const response = await api.get("/reports/scheduled");
    return response.data;
  }

  static async deleteScheduledReport(id: string): Promise<void> {
    await api.delete(`/reports/scheduled/${id}`);
  }
}
