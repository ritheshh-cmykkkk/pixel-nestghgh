import api from "../api";

export interface Supplier {
  id: string;
  name: string;
  contact_person: string;
  phone: string;
  email?: string;
  address?: string;
  gst_number?: string;
  payment_terms: string;
  category: string;
  status: "active" | "inactive";
  total_purchases: number;
  outstanding_amount: number;
  last_order_date?: string;
  created_at: string;
  updated_at: string;
  notes?: string;
}

export interface CreateSupplierRequest {
  name: string;
  contact_person: string;
  phone: string;
  email?: string;
  address?: string;
  gst_number?: string;
  payment_terms: string;
  category: string;
  notes?: string;
}

export interface UpdateSupplierRequest extends Partial<CreateSupplierRequest> {
  status?: "active" | "inactive";
}

export interface SupplierFilters {
  status?: string;
  category?: string;
  name?: string;
  page?: number;
  limit?: number;
}

export interface SupplierStats {
  total_suppliers: number;
  active_suppliers: number;
  total_purchases: number;
  outstanding_amount: number;
}

export interface SupplierPurchase {
  id: string;
  supplier_id: string;
  purchase_order_number?: string;
  items: SupplierPurchaseItem[];
  total_amount: number;
  paid_amount: number;
  status: "pending" | "received" | "completed" | "cancelled";
  order_date: string;
  received_date?: string;
  notes?: string;
}

export interface SupplierPurchaseItem {
  name: string;
  quantity: number;
  rate: number;
  amount: number;
}

export class SupplierService {
  static async getAll(filters?: SupplierFilters): Promise<{
    suppliers: Supplier[];
    total: number;
    page: number;
    limit: number;
  }> {
    const response = await api.get("/suppliers", { params: filters });
    return response.data;
  }

  static async getById(id: string): Promise<Supplier> {
    const response = await api.get(`/suppliers/${id}`);
    return response.data;
  }

  static async create(supplier: CreateSupplierRequest): Promise<Supplier> {
    const response = await api.post("/suppliers", supplier);
    return response.data;
  }

  static async update(
    id: string,
    supplier: UpdateSupplierRequest,
  ): Promise<Supplier> {
    const response = await api.put(`/suppliers/${id}`, supplier);
    return response.data;
  }

  static async delete(id: string): Promise<void> {
    await api.delete(`/suppliers/${id}`);
  }

  static async updateStatus(
    id: string,
    status: "active" | "inactive",
  ): Promise<Supplier> {
    const response = await api.patch(`/suppliers/${id}/status`, { status });
    return response.data;
  }

  static async getStats(): Promise<SupplierStats> {
    const response = await api.get("/suppliers/stats");
    return response.data;
  }

  static async getPurchases(
    supplierId: string,
    page?: number,
    limit?: number,
  ): Promise<{
    purchases: SupplierPurchase[];
    total: number;
    page: number;
    limit: number;
  }> {
    const response = await api.get(`/suppliers/${supplierId}/purchases`, {
      params: { page, limit },
    });
    return response.data;
  }

  static async createPurchase(
    supplierId: string,
    purchase: Omit<SupplierPurchase, "id" | "supplier_id">,
  ): Promise<SupplierPurchase> {
    const response = await api.post(
      `/suppliers/${supplierId}/purchases`,
      purchase,
    );
    return response.data;
  }

  static async updatePurchase(
    supplierId: string,
    purchaseId: string,
    purchase: Partial<SupplierPurchase>,
  ): Promise<SupplierPurchase> {
    const response = await api.put(
      `/suppliers/${supplierId}/purchases/${purchaseId}`,
      purchase,
    );
    return response.data;
  }

  static async getCategories(): Promise<string[]> {
    const response = await api.get("/suppliers/categories");
    return response.data;
  }

  static async search(query: string): Promise<Supplier[]> {
    const response = await api.get("/suppliers/search", {
      params: { q: query },
    });
    return response.data;
  }
}
