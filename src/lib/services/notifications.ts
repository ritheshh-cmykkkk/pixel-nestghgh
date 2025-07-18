import api from "../api";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  category: "transaction" | "bill" | "system" | "reminder" | "general";
  is_read: boolean;
  is_important: boolean;
  action_url?: string;
  action_label?: string;
  metadata?: Record<string, any>;
  created_at: string;
  read_at?: string;
  expires_at?: string;
}

export interface CreateNotificationRequest {
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  category: "transaction" | "bill" | "system" | "reminder" | "general";
  is_important?: boolean;
  action_url?: string;
  action_label?: string;
  metadata?: Record<string, any>;
  expires_at?: string;
}

export interface NotificationFilters {
  type?: string;
  category?: string;
  is_read?: boolean;
  is_important?: boolean;
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
}

export interface NotificationSettings {
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  transaction_alerts: boolean;
  bill_reminders: boolean;
  payment_alerts: boolean;
  system_updates: boolean;
  marketing_emails: boolean;
  quiet_hours_start?: string; // HH:MM format
  quiet_hours_end?: string; // HH:MM format
}

export interface NotificationStats {
  total_notifications: number;
  unread_count: number;
  important_count: number;
  categories_breakdown: { [category: string]: number };
}

export class NotificationService {
  static async getAll(filters?: NotificationFilters): Promise<{
    notifications: Notification[];
    total: number;
    page: number;
    limit: number;
  }> {
    const response = await api.get("/notifications", { params: filters });
    return response.data;
  }

  static async getById(id: string): Promise<Notification> {
    const response = await api.get(`/notifications/${id}`);
    return response.data;
  }

  static async create(
    notification: CreateNotificationRequest,
  ): Promise<Notification> {
    const response = await api.post("/notifications", notification);
    return response.data;
  }

  static async markAsRead(id: string): Promise<Notification> {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  }

  static async markAsUnread(id: string): Promise<Notification> {
    const response = await api.patch(`/notifications/${id}/unread`);
    return response.data;
  }

  static async markAllAsRead(): Promise<void> {
    await api.patch("/notifications/read-all");
  }

  static async delete(id: string): Promise<void> {
    await api.delete(`/notifications/${id}`);
  }

  static async deleteAll(): Promise<void> {
    await api.delete("/notifications");
  }

  static async getStats(): Promise<NotificationStats> {
    const response = await api.get("/notifications/stats");
    return response.data;
  }

  static async getSettings(): Promise<NotificationSettings> {
    const response = await api.get("/notifications/settings");
    return response.data;
  }

  static async updateSettings(
    settings: Partial<NotificationSettings>,
  ): Promise<NotificationSettings> {
    const response = await api.put("/notifications/settings", settings);
    return response.data;
  }

  static async testNotification(type: "email" | "sms" | "push"): Promise<void> {
    await api.post("/notifications/test", { type });
  }

  // Real-time notifications using Server-Sent Events or WebSocket
  static subscribeToNotifications(
    onNotification: (notification: Notification) => void,
    onError?: (error: Error) => void,
  ): () => void {
    const eventSource = new EventSource(
      `${api.defaults.baseURL}/notifications/stream`,
      {
        withCredentials: true,
      },
    );

    eventSource.onmessage = (event) => {
      try {
        const notification = JSON.parse(event.data);
        onNotification(notification);
      } catch (error) {
        console.error("Failed to parse notification:", error);
        onError?.(error as Error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("Notification stream error:", error);
      onError?.(new Error("Notification stream connection failed"));
    };

    // Return cleanup function
    return () => {
      eventSource.close();
    };
  }

  // Push notification registration for PWA
  static async registerPushSubscription(
    subscription: PushSubscription,
  ): Promise<void> {
    await api.post("/notifications/push/subscribe", {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.getKey("p256dh"),
        auth: subscription.getKey("auth"),
      },
    });
  }

  static async unregisterPushSubscription(): Promise<void> {
    await api.delete("/notifications/push/unsubscribe");
  }
}
