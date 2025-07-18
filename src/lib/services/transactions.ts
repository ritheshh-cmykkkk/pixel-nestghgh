import api from "../api";

export interface Transaction {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  device_model: string;
  repair_type: string;
  repair_description?: string;
  cost: number;
  profit: number;
  status: "pending" | "in-progress" | "completed" | "delivered";
  payment_method: "cash" | "upi" | "card" | "bank-transfer";
  payment_status: "pending" | "partial" | "completed";
  amount_paid: number;
  free_glass: boolean;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  delivered_at?: string;
  notes?: string;
  warranty_period?: number; // in days
  parts_used?: TransactionPart[];
}

export interface TransactionPart {
  id: string;
  name: string;
  quantity: number;
  cost: number;
  supplier?: string;
}

export interface CreateTransactionRequest {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  device_model: string;
  repair_type: string;
  repair_description?: string;
  cost: number;
  payment_method: "cash" | "upi" | "card" | "bank-transfer";
  amount_paid?: number;
  free_glass?: boolean;
  notes?: string;
  warranty_period?: number;
  parts_used?: Omit<TransactionPart, "id">[];
}

export interface UpdateTransactionRequest
  extends Partial<CreateTransactionRequest> {
  status?: "pending" | "in-progress" | "completed" | "delivered";
  payment_status?: "pending" | "partial" | "completed";
}

export interface TransactionFilters {
  status?: string;
  payment_status?: string;
  date_from?: string;
  date_to?: string;
  customer_name?: string;
  device_model?: string;
  repair_type?: string;
  page?: number;
  limit?: number;
}

export interface TransactionStats {
  total_transactions: number;
  pending_transactions: number;
  completed_transactions: number;
  total_revenue: number;
  total_profit: number;
  pending_amount: number;
}

export class TransactionService {
  static async getAll(filters?: TransactionFilters): Promise<{
    transactions: Transaction[];
    total: number;
    page: number;
    limit: number;
  }> {
    const response = await api.get("/transactions", { params: filters });
    return response.data;
  }

  static async getById(id: string): Promise<Transaction> {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  }

  static async create(
    transaction: CreateTransactionRequest,
  ): Promise<Transaction> {
    const response = await api.post("/transactions", transaction);
    return response.data;
  }

  static async update(
    id: string,
    transaction: UpdateTransactionRequest,
  ): Promise<Transaction> {
    const response = await api.put(`/transactions/${id}`, transaction);
    return response.data;
  }

  static async delete(id: string): Promise<void> {
    await api.delete(`/transactions/${id}`);
  }

  static async updateStatus(
    id: string,
    status: Transaction["status"],
  ): Promise<Transaction> {
    const response = await api.patch(`/transactions/${id}/status`, { status });
    return response.data;
  }

  static async addPayment(
    id: string,
    amount: number,
    method: Transaction["payment_method"],
  ): Promise<Transaction> {
    const response = await api.post(`/transactions/${id}/payments`, {
      amount,
      method,
    });
    return response.data;
  }

  static async getStats(
    dateFrom?: string,
    dateTo?: string,
  ): Promise<TransactionStats> {
    const response = await api.get("/transactions/stats", {
      params: { date_from: dateFrom, date_to: dateTo },
    });
    return response.data;
  }

  static async getRepairTypes(): Promise<string[]> {
    const response = await api.get("/transactions/repair-types");
    return response.data;
  }

  static async getDeviceModels(): Promise<string[]> {
    const response = await api.get("/transactions/device-models");
    return response.data;
  }

  static async search(query: string): Promise<Transaction[]> {
    const response = await api.get("/transactions/search", {
      params: { q: query },
    });
    return response.data;
  }
}
