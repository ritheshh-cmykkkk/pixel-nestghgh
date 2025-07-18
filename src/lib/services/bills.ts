import api from "../api";

export interface BillItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Bill {
  id: string;
  bill_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_address?: string;
  items: BillItem[];
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  due_date?: string;
  paid_amount: number;
  payment_method?: "cash" | "upi" | "card" | "bank-transfer";
  notes?: string;
  terms?: string;
  created_at: string;
  updated_at: string;
  paid_at?: string;
  transaction_id?: string; // Link to related transaction
}

export interface CreateBillRequest {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_address?: string;
  items: BillItem[];
  tax_percentage?: number;
  discount_amount?: number;
  due_date?: string;
  notes?: string;
  terms?: string;
  transaction_id?: string;
}

export interface UpdateBillRequest extends Partial<CreateBillRequest> {
  status?: Bill["status"];
}

export interface BillFilters {
  status?: string;
  customer_name?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
}

export interface BillStats {
  total_bills: number;
  paid_bills: number;
  pending_bills: number;
  overdue_bills: number;
  total_amount: number;
  paid_amount: number;
  pending_amount: number;
}

export class BillService {
  static async getAll(filters?: BillFilters): Promise<{
    bills: Bill[];
    total: number;
    page: number;
    limit: number;
  }> {
    const response = await api.get("/bills", { params: filters });
    return response.data;
  }

  static async getById(id: string): Promise<Bill> {
    const response = await api.get(`/bills/${id}`);
    return response.data;
  }

  static async create(bill: CreateBillRequest): Promise<Bill> {
    const response = await api.post("/bills", bill);
    return response.data;
  }

  static async update(id: string, bill: UpdateBillRequest): Promise<Bill> {
    const response = await api.put(`/bills/${id}`, bill);
    return response.data;
  }

  static async delete(id: string): Promise<void> {
    await api.delete(`/bills/${id}`);
  }

  static async updateStatus(id: string, status: Bill["status"]): Promise<Bill> {
    const response = await api.patch(`/bills/${id}/status`, { status });
    return response.data;
  }

  static async addPayment(
    id: string,
    amount: number,
    method: Bill["payment_method"],
  ): Promise<Bill> {
    const response = await api.post(`/bills/${id}/payments`, {
      amount,
      method,
    });
    return response.data;
  }

  static async generatePDF(id: string): Promise<Blob> {
    const response = await api.get(`/bills/${id}/pdf`, {
      responseType: "blob",
    });
    return response.data;
  }

  static async sendEmail(id: string, email?: string): Promise<void> {
    await api.post(`/bills/${id}/send-email`, { email });
  }

  static async sendSMS(id: string, phone?: string): Promise<void> {
    await api.post(`/bills/${id}/send-sms`, { phone });
  }

  static async getStats(
    dateFrom?: string,
    dateTo?: string,
  ): Promise<BillStats> {
    const response = await api.get("/bills/stats", {
      params: { date_from: dateFrom, date_to: dateTo },
    });
    return response.data;
  }

  static async search(query: string): Promise<Bill[]> {
    const response = await api.get("/bills/search", {
      params: { q: query },
    });
    return response.data;
  }
}
