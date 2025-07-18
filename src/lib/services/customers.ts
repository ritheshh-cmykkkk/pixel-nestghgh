import api from "../api";

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  date_of_birth?: string;
  gender?: "male" | "female" | "other";
  occupation?: string;
  company?: string;
  gst_number?: string;
  status: "active" | "inactive";
  total_transactions: number;
  total_amount: number;
  paid_amount: number;
  outstanding_amount: number;
  last_visit?: string;
  created_at: string;
  updated_at: string;
  notes?: string;
  tags?: string[];
  loyalty_points?: number;
  discount_percentage?: number;
}

export interface CreateCustomerRequest {
  name: string;
  email?: string;
  phone: string;
  address?: string;
  date_of_birth?: string;
  gender?: "male" | "female" | "other";
  occupation?: string;
  company?: string;
  gst_number?: string;
  notes?: string;
  tags?: string[];
  discount_percentage?: number;
}

export interface UpdateCustomerRequest extends Partial<CreateCustomerRequest> {
  status?: "active" | "inactive";
}

export interface CustomerFilters {
  status?: string;
  name?: string;
  phone?: string;
  email?: string;
  tags?: string[];
  created_from?: string;
  created_to?: string;
  page?: number;
  limit?: number;
}

export interface CustomerStats {
  total_customers: number;
  active_customers: number;
  new_customers_this_month: number;
  total_revenue: number;
  average_transaction_value: number;
  outstanding_amount: number;
}

export interface CustomerTransaction {
  id: string;
  device_model: string;
  repair_type: string;
  amount: number;
  status: string;
  created_at: string;
}

export interface CustomerAnalytics {
  customer_id: string;
  transactions: CustomerTransaction[];
  total_spent: number;
  total_transactions: number;
  average_transaction_value: number;
  last_visit: string;
  loyalty_score: number;
  preferred_repair_types: Array<{
    repair_type: string;
    count: number;
  }>;
  device_history: Array<{
    device_model: string;
    count: number;
  }>;
}

export class CustomerService {
  static async getAll(filters?: CustomerFilters): Promise<{
    customers: Customer[];
    total: number;
    page: number;
    limit: number;
  }> {
    const response = await api.get("/customers", { params: filters });
    return response.data;
  }

  static async getById(id: string): Promise<Customer> {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  }

  static async create(customer: CreateCustomerRequest): Promise<Customer> {
    const response = await api.post("/customers", customer);
    return response.data;
  }

  static async update(
    id: string,
    customer: UpdateCustomerRequest,
  ): Promise<Customer> {
    const response = await api.put(`/customers/${id}`, customer);
    return response.data;
  }

  static async delete(id: string): Promise<void> {
    await api.delete(`/customers/${id}`);
  }

  static async updateStatus(
    id: string,
    status: "active" | "inactive",
  ): Promise<Customer> {
    const response = await api.patch(`/customers/${id}/status`, { status });
    return response.data;
  }

  static async getStats(): Promise<CustomerStats> {
    const response = await api.get("/customers/stats");
    return response.data;
  }

  static async getTransactions(
    customerId: string,
    page?: number,
    limit?: number,
  ): Promise<{
    transactions: CustomerTransaction[];
    total: number;
    page: number;
    limit: number;
  }> {
    const response = await api.get(`/customers/${customerId}/transactions`, {
      params: { page, limit },
    });
    return response.data;
  }

  static async getAnalytics(customerId: string): Promise<CustomerAnalytics> {
    const response = await api.get(`/customers/${customerId}/analytics`);
    return response.data;
  }

  static async addLoyaltyPoints(
    customerId: string,
    points: number,
    reason?: string,
  ): Promise<Customer> {
    const response = await api.post(`/customers/${customerId}/loyalty-points`, {
      points,
      reason,
    });
    return response.data;
  }

  static async redeemLoyaltyPoints(
    customerId: string,
    points: number,
  ): Promise<Customer> {
    const response = await api.post(
      `/customers/${customerId}/redeem-loyalty-points`,
      {
        points,
      },
    );
    return response.data;
  }

  static async search(query: string): Promise<Customer[]> {
    const response = await api.get("/customers/search", {
      params: { q: query },
    });
    return response.data;
  }

  static async getTags(): Promise<string[]> {
    const response = await api.get("/customers/tags");
    return response.data;
  }

  static async bulkImport(file: File): Promise<{
    imported: number;
    errors: Array<{ row: number; error: string }>;
  }> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/customers/bulk-import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  static async exportToCSV(filters?: CustomerFilters): Promise<Blob> {
    const response = await api.get("/customers/export", {
      params: filters,
      responseType: "blob",
    });
    return response.data;
  }
}
