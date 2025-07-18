import api from "../api";

export interface DashboardStats {
  revenue: {
    today: number;
    yesterday: number;
    this_month: number;
    last_month: number;
    growth_percentage: number;
  };
  transactions: {
    today: number;
    pending: number;
    completed: number;
    total_this_month: number;
    growth_percentage: number;
  };
  customers: {
    total: number;
    new_this_month: number;
    active: number;
    growth_percentage: number;
  };
  bills: {
    pending: number;
    overdue: number;
    paid_this_month: number;
    total_amount_pending: number;
  };
}

export interface RevenueStats {
  period: string;
  total_revenue: number;
  total_profit: number;
  profit_margin: number;
  daily_data: Array<{
    date: string;
    revenue: number;
    profit: number;
    transactions: number;
  }>;
  weekly_data: Array<{
    week: string;
    revenue: number;
    profit: number;
    transactions: number;
  }>;
  monthly_data: Array<{
    month: string;
    revenue: number;
    profit: number;
    transactions: number;
  }>;
}

export interface RepairStats {
  total_repairs: number;
  completed_repairs: number;
  pending_repairs: number;
  average_completion_time: number;
  repair_types: Array<{
    type: string;
    count: number;
    revenue: number;
    percentage: number;
  }>;
  device_brands: Array<{
    brand: string;
    count: number;
    revenue: number;
    percentage: number;
  }>;
}

export interface CustomerStats {
  total_customers: number;
  new_customers_this_month: number;
  repeat_customers: number;
  customer_lifetime_value: number;
  top_customers: Array<{
    id: string;
    name: string;
    total_spent: number;
    transaction_count: number;
    last_visit: string;
  }>;
  customer_segments: Array<{
    segment: string;
    count: number;
    percentage: number;
    revenue: number;
  }>;
}

export interface FinancialStats {
  total_revenue: number;
  total_expenses: number;
  gross_profit: number;
  net_profit: number;
  cash_flow: number;
  expense_categories: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  monthly_comparison: Array<{
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }>;
}

export interface PerformanceStats {
  completion_rate: number;
  average_repair_time: number;
  customer_satisfaction: number;
  repeat_customer_rate: number;
  on_time_delivery: number;
  quality_score: number;
  efficiency_metrics: {
    repairs_per_day: number;
    revenue_per_repair: number;
    profit_per_repair: number;
    cost_per_repair: number;
  };
}

export interface TrendAnalysis {
  revenue_trend: "increasing" | "decreasing" | "stable";
  transaction_trend: "increasing" | "decreasing" | "stable";
  customer_trend: "increasing" | "decreasing" | "stable";
  seasonal_patterns: Array<{
    month: string;
    pattern: "high" | "medium" | "low";
    revenue_factor: number;
  }>;
  forecasts: {
    next_month_revenue: number;
    next_month_transactions: number;
    growth_projection: number;
  };
}

export interface ComparisonStats {
  period_comparison: {
    current_period: any;
    previous_period: any;
    growth_rates: {
      revenue: number;
      transactions: number;
      customers: number;
      profit: number;
    };
  };
  year_over_year: {
    revenue_growth: number;
    transaction_growth: number;
    customer_growth: number;
    profit_growth: number;
  };
}

export class StatisticsService {
  static async getDashboardStats(
    period: "today" | "week" | "month" | "quarter" | "year" = "month",
  ): Promise<DashboardStats> {
    const response = await api.get("/statistics/dashboard", {
      params: { period },
    });
    return response.data;
  }

  static async getRevenueStats(
    dateFrom?: string,
    dateTo?: string,
  ): Promise<RevenueStats> {
    const response = await api.get("/statistics/revenue", {
      params: { date_from: dateFrom, date_to: dateTo },
    });
    return response.data;
  }

  static async getRepairStats(
    dateFrom?: string,
    dateTo?: string,
  ): Promise<RepairStats> {
    const response = await api.get("/statistics/repairs", {
      params: { date_from: dateFrom, date_to: dateTo },
    });
    return response.data;
  }

  static async getCustomerStats(
    dateFrom?: string,
    dateTo?: string,
  ): Promise<CustomerStats> {
    const response = await api.get("/statistics/customers", {
      params: { date_from: dateFrom, date_to: dateTo },
    });
    return response.data;
  }

  static async getFinancialStats(
    dateFrom?: string,
    dateTo?: string,
  ): Promise<FinancialStats> {
    const response = await api.get("/statistics/financial", {
      params: { date_from: dateFrom, date_to: dateTo },
    });
    return response.data;
  }

  static async getPerformanceStats(
    dateFrom?: string,
    dateTo?: string,
  ): Promise<PerformanceStats> {
    const response = await api.get("/statistics/performance", {
      params: { date_from: dateFrom, date_to: dateTo },
    });
    return response.data;
  }

  static async getTrendAnalysis(
    period: "3months" | "6months" | "1year" = "6months",
  ): Promise<TrendAnalysis> {
    const response = await api.get("/statistics/trends", {
      params: { period },
    });
    return response.data;
  }

  static async getComparisonStats(
    currentPeriod: string,
    comparisonPeriod: string,
  ): Promise<ComparisonStats> {
    const response = await api.get("/statistics/comparison", {
      params: {
        current_period: currentPeriod,
        comparison_period: comparisonPeriod,
      },
    });
    return response.data;
  }

  static async getCustomReport(
    metrics: string[],
    groupBy: "day" | "week" | "month",
    dateFrom?: string,
    dateTo?: string,
  ): Promise<Array<Record<string, any>>> {
    const response = await api.get("/statistics/custom", {
      params: {
        metrics: metrics.join(","),
        group_by: groupBy,
        date_from: dateFrom,
        date_to: dateTo,
      },
    });
    return response.data;
  }

  static async exportStats(
    type: "dashboard" | "revenue" | "repairs" | "customers" | "financial",
    format: "csv" | "excel" | "pdf",
    dateFrom?: string,
    dateTo?: string,
  ): Promise<Blob> {
    const response = await api.get(`/statistics/${type}/export`, {
      params: {
        format,
        date_from: dateFrom,
        date_to: dateTo,
      },
      responseType: "blob",
    });
    return response.data;
  }

  static async getHealthMetrics(): Promise<{
    api_status: "healthy" | "degraded" | "down";
    database_status: "healthy" | "degraded" | "down";
    cache_status: "healthy" | "degraded" | "down";
    response_time: number;
    uptime: number;
    error_rate: number;
  }> {
    const response = await api.get("/statistics/health");
    return response.data;
  }
}
