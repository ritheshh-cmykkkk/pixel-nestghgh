import api from "../api";

export interface Expenditure {
  id: string;
  description: string;
  category: string;
  amount: number;
  payment_method: "cash" | "upi" | "card" | "bank_transfer";
  supplier_name?: string;
  supplier_id?: string;
  receipt_url?: string;
  notes?: string;
  date: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
}

export interface CreateExpenditureRequest {
  description: string;
  category: string;
  amount: number;
  payment_method: "cash" | "upi" | "card" | "bank_transfer";
  supplier_name?: string;
  supplier_id?: string;
  receipt_url?: string;
  notes?: string;
  date?: string;
  tags?: string[];
}

export interface UpdateExpenditureRequest
  extends Partial<CreateExpenditureRequest> {}

export interface ExpenditureFilters {
  category?: string;
  payment_method?: string;
  supplier_id?: string;
  date_from?: string;
  date_to?: string;
  min_amount?: number;
  max_amount?: number;
  page?: number;
  limit?: number;
}

export interface ExpenditureStats {
  total_expenditures: number;
  total_amount: number;
  monthly_amount: number;
  categories_breakdown: { [category: string]: number };
  payment_methods_breakdown: { [method: string]: number };
}

export interface ExpenditureReport {
  period: string;
  total_amount: number;
  categories: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  monthly_trend: Array<{
    month: string;
    amount: number;
  }>;
}

export class ExpenditureService {
  static async getAll(filters?: ExpenditureFilters): Promise<{
    expenditures: Expenditure[];
    total: number;
    page: number;
    limit: number;
  }> {
    const response = await api.get("/expenditures", { params: filters });
    return response.data;
  }

  static async getById(id: string): Promise<Expenditure> {
    const response = await api.get(`/expenditures/${id}`);
    return response.data;
  }

  static async create(
    expenditure: CreateExpenditureRequest,
  ): Promise<Expenditure> {
    const response = await api.post("/expenditures", expenditure);
    return response.data;
  }

  static async update(
    id: string,
    expenditure: UpdateExpenditureRequest,
  ): Promise<Expenditure> {
    const response = await api.put(`/expenditures/${id}`, expenditure);
    return response.data;
  }

  static async delete(id: string): Promise<void> {
    await api.delete(`/expenditures/${id}`);
  }

  static async uploadReceipt(id: string, file: File): Promise<Expenditure> {
    const formData = new FormData();
    formData.append("receipt", file);

    const response = await api.post(`/expenditures/${id}/receipt`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  static async getStats(
    dateFrom?: string,
    dateTo?: string,
  ): Promise<ExpenditureStats> {
    const response = await api.get("/expenditures/stats", {
      params: { date_from: dateFrom, date_to: dateTo },
    });
    return response.data;
  }

  static async getReport(
    period: "monthly" | "quarterly" | "yearly",
    year?: number,
  ): Promise<ExpenditureReport> {
    const response = await api.get("/expenditures/reports", {
      params: { period, year },
    });
    return response.data;
  }

  static async getCategories(): Promise<string[]> {
    const response = await api.get("/expenditures/categories");
    return response.data;
  }

  static async search(query: string): Promise<Expenditure[]> {
    const response = await api.get("/expenditures/search", {
      params: { q: query },
    });
    return response.data;
  }

  static async bulkImport(file: File): Promise<{
    imported: number;
    errors: Array<{ row: number; error: string }>;
  }> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/expenditures/bulk-import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  static async exportToCSV(filters?: ExpenditureFilters): Promise<Blob> {
    const response = await api.get("/expenditures/export", {
      params: filters,
      responseType: "blob",
    });
    return response.data;
  }
}
