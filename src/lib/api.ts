const API_BASE_URL = "https://backendmobile-4swg.onrender.com";

// API client setup
export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Auth endpoints
  async login(username: string, password: string) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  }

  async getCurrentUser() {
    return this.request("/auth/me");
  }

  // Transaction endpoints
  async getTransactions() {
    return this.request("/transactions");
  }

  async createTransaction(data: any) {
    return this.request("/transactions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateTransaction(id: string, data: any) {
    return this.request(`/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteTransaction(id: string) {
    return this.request(`/transactions/${id}`, {
      method: "DELETE",
    });
  }

  // Supplier endpoints
  async getSuppliers() {
    return this.request("/suppliers");
  }

  async createSupplier(data: any) {
    return this.request("/suppliers", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateSupplier(id: string, data: any) {
    return this.request(`/suppliers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Dashboard endpoints
  async getDashboardData() {
    return this.request("/dashboard");
  }

  // Reports endpoints
  async getReports(dateRange?: string) {
    const params = dateRange ? `?dateRange=${dateRange}` : "";
    return this.request(`/reports${params}`);
  }

  // Expenditures endpoints
  async getExpenditures() {
    return this.request("/expenditures");
  }

  async createExpenditure(data: any) {
    return this.request("/expenditures", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Bills endpoints
  async getBills() {
    return this.request("/bills");
  }

  async createBill(data: any) {
    return this.request("/bills", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Search endpoint
  async search(query: string) {
    return this.request(`/search?q=${encodeURIComponent(query)}`);
  }
}

export const apiClient = new ApiClient();
