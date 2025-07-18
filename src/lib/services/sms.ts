import api from "../api";

export interface SMSTemplate {
  id: string;
  name: string;
  content: string;
  type: "transaction" | "bill" | "reminder" | "marketing" | "custom";
  variables: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SMS {
  id: string;
  phone: string;
  message: string;
  template_id?: string;
  type: "transaction" | "bill" | "reminder" | "marketing" | "custom";
  status: "pending" | "sent" | "delivered" | "failed";
  sent_at?: string;
  delivered_at?: string;
  failure_reason?: string;
  cost?: number;
  created_at: string;
}

export interface SendSMSRequest {
  phone: string;
  message: string;
  type?: "transaction" | "bill" | "reminder" | "marketing" | "custom";
  template_id?: string;
  variables?: Record<string, string>;
  schedule_at?: string;
}

export interface BulkSMSRequest {
  phones: string[];
  message: string;
  type?: "transaction" | "bill" | "reminder" | "marketing" | "custom";
  template_id?: string;
  variables?: Record<string, Record<string, string>>; // phone -> variables mapping
  schedule_at?: string;
}

export interface SMSFilters {
  phone?: string;
  type?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
}

export interface SMSStats {
  total_sms: number;
  sent_count: number;
  delivered_count: number;
  failed_count: number;
  total_cost: number;
  delivery_rate: number;
  monthly_stats: Array<{
    month: string;
    sent: number;
    delivered: number;
    cost: number;
  }>;
}

export interface SMSSettings {
  provider: "twilio" | "msg91" | "textlocal" | "custom";
  sender_id: string;
  api_key: string;
  api_secret?: string;
  webhook_url?: string;
  is_enabled: boolean;
  balance?: number;
  rate_limit: number; // SMS per minute
}

export class SMSService {
  static async send(smsData: SendSMSRequest): Promise<SMS> {
    const response = await api.post("/sms/send", smsData);
    return response.data;
  }

  static async sendBulk(bulkData: BulkSMSRequest): Promise<{
    success_count: number;
    failed_count: number;
    sms_ids: string[];
    failures: Array<{ phone: string; error: string }>;
  }> {
    const response = await api.post("/sms/send-bulk", bulkData);
    return response.data;
  }

  static async getAll(filters?: SMSFilters): Promise<{
    sms: SMS[];
    total: number;
    page: number;
    limit: number;
  }> {
    const response = await api.get("/sms", { params: filters });
    return response.data;
  }

  static async getById(id: string): Promise<SMS> {
    const response = await api.get(`/sms/${id}`);
    return response.data;
  }

  static async getStats(dateFrom?: string, dateTo?: string): Promise<SMSStats> {
    const response = await api.get("/sms/stats", {
      params: { date_from: dateFrom, date_to: dateTo },
    });
    return response.data;
  }

  static async getTemplates(): Promise<SMSTemplate[]> {
    const response = await api.get("/sms/templates");
    return response.data;
  }

  static async getTemplate(id: string): Promise<SMSTemplate> {
    const response = await api.get(`/sms/templates/${id}`);
    return response.data;
  }

  static async createTemplate(template: {
    name: string;
    content: string;
    type: SMSTemplate["type"];
    variables?: string[];
  }): Promise<SMSTemplate> {
    const response = await api.post("/sms/templates", template);
    return response.data;
  }

  static async updateTemplate(
    id: string,
    template: Partial<SMSTemplate>,
  ): Promise<SMSTemplate> {
    const response = await api.put(`/sms/templates/${id}`, template);
    return response.data;
  }

  static async deleteTemplate(id: string): Promise<void> {
    await api.delete(`/sms/templates/${id}`);
  }

  static async previewTemplate(
    templateId: string,
    variables: Record<string, string>,
  ): Promise<{ message: string }> {
    const response = await api.post(`/sms/templates/${templateId}/preview`, {
      variables,
    });
    return response.data;
  }

  static async getSettings(): Promise<SMSSettings> {
    const response = await api.get("/sms/settings");
    return response.data;
  }

  static async updateSettings(
    settings: Partial<SMSSettings>,
  ): Promise<SMSSettings> {
    const response = await api.put("/sms/settings", settings);
    return response.data;
  }

  static async checkBalance(): Promise<{ balance: number; currency: string }> {
    const response = await api.get("/sms/balance");
    return response.data;
  }

  static async testSMS(phone: string): Promise<SMS> {
    const response = await api.post("/sms/test", { phone });
    return response.data;
  }

  // Quick SMS for common scenarios
  static async sendTransactionSMS(
    transactionId: string,
    phone: string,
    type: "confirmation" | "completion" | "reminder",
  ): Promise<SMS> {
    const response = await api.post(`/transactions/${transactionId}/sms`, {
      phone,
      type,
    });
    return response.data;
  }

  static async sendBillSMS(
    billId: string,
    phone: string,
    type: "invoice" | "reminder" | "payment_confirmation",
  ): Promise<SMS> {
    const response = await api.post(`/bills/${billId}/sms`, {
      phone,
      type,
    });
    return response.data;
  }

  static async sendCustomerReminder(
    customerId: string,
    message: string,
  ): Promise<SMS> {
    const response = await api.post(`/customers/${customerId}/sms`, {
      message,
      type: "reminder",
    });
    return response.data;
  }
}
