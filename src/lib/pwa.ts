// PWA utilities for offline support and caching

interface OfflineQueueItem {
  id: string;
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
  timestamp: number;
  retryCount: number;
}

class PWAManager {
  private static instance: PWAManager;
  private swRegistration: ServiceWorkerRegistration | null = null;
  private offlineQueue: OfflineQueueItem[] = [];
  private isOnline = navigator.onLine;

  private constructor() {
    this.setupEventListeners();
    this.loadOfflineQueue();
  }

  public static getInstance(): PWAManager {
    if (!PWAManager.instance) {
      PWAManager.instance = new PWAManager();
    }
    return PWAManager.instance;
  }

  // Register service worker
  async registerServiceWorker(): Promise<void> {
    if ("serviceWorker" in navigator) {
      try {
        this.swRegistration = await navigator.serviceWorker.register("/sw.js");

        this.swRegistration.addEventListener("updatefound", () => {
          const newWorker = this.swRegistration?.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed") {
                if (navigator.serviceWorker.controller) {
                  // New update available
                  this.showUpdateAvailable();
                } else {
                  // App is ready for offline use
                  this.showOfflineReady();
                }
              }
            });
          }
        });

        console.log("Service Worker registered successfully");
      } catch (error) {
        console.error("Service Worker registration failed:", error);
      }
    }
  }

  // Setup online/offline event listeners
  private setupEventListeners(): void {
    window.addEventListener("online", () => {
      this.isOnline = true;
      this.handleOnline();
    });

    window.addEventListener("offline", () => {
      this.isOnline = false;
      this.handleOffline();
    });

    // Listen for SW messages
    navigator.serviceWorker?.addEventListener("message", (event) => {
      if (event.data?.type === "OFFLINE_FALLBACK") {
        this.showOfflineMessage();
      }
    });
  }

  // Handle online event
  private async handleOnline(): Promise<void> {
    console.log("Connection restored");

    // Show online status
    this.showNotification("Connection restored", "success");

    // Process offline queue
    await this.processOfflineQueue();

    // Trigger background sync if supported
    if (
      "serviceWorker" in navigator &&
      "sync" in window.ServiceWorkerRegistration.prototype
    ) {
      try {
        await this.swRegistration?.sync.register("background-sync");
      } catch (error) {
        console.error("Background sync registration failed:", error);
      }
    }
  }

  // Handle offline event
  private handleOffline(): void {
    console.log("Connection lost");
    this.showNotification("You are now offline", "warning");
  }

  // Add request to offline queue
  async addToOfflineQueue(
    url: string,
    method: string,
    headers: Record<string, string>,
    body?: string,
  ): Promise<void> {
    const item: OfflineQueueItem = {
      id: crypto.randomUUID(),
      url,
      method,
      headers,
      body,
      timestamp: Date.now(),
      retryCount: 0,
    };

    this.offlineQueue.push(item);
    await this.saveOfflineQueue();
  }

  // Process offline queue when online
  private async processOfflineQueue(): Promise<void> {
    if (this.offlineQueue.length === 0) return;

    const itemsToProcess = [...this.offlineQueue];
    this.offlineQueue = [];

    for (const item of itemsToProcess) {
      try {
        const response = await fetch(item.url, {
          method: item.method,
          headers: item.headers,
          body: item.body,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        console.log(`Successfully synced offline request: ${item.url}`);
      } catch (error) {
        item.retryCount++;

        // Retry up to 3 times
        if (item.retryCount < 3) {
          this.offlineQueue.push(item);
        } else {
          console.error(`Failed to sync after 3 retries: ${item.url}`, error);
        }
      }
    }

    await this.saveOfflineQueue();
  }

  // Save offline queue to localStorage
  private async saveOfflineQueue(): Promise<void> {
    try {
      localStorage.setItem("offline-queue", JSON.stringify(this.offlineQueue));
    } catch (error) {
      console.error("Failed to save offline queue:", error);
    }
  }

  // Load offline queue from localStorage
  private loadOfflineQueue(): void {
    try {
      const saved = localStorage.getItem("offline-queue");
      if (saved) {
        this.offlineQueue = JSON.parse(saved);
      }
    } catch (error) {
      console.error("Failed to load offline queue:", error);
      this.offlineQueue = [];
    }
  }

  // Install app prompt
  async showInstallPrompt(): Promise<void> {
    // This would show a custom install prompt
    // Implementation depends on your UI framework
    console.log("Install prompt would be shown here");
  }

  // Request notification permission
  async requestNotificationPermission(): Promise<boolean> {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }

    return false;
  }

  // Show local notification
  showNotification(
    message: string,
    type: "success" | "error" | "warning" | "info" = "info",
  ): void {
    // This would integrate with your toast/notification system
    console.log(`[${type.toUpperCase()}] ${message}`);
  }

  // Show update available notification
  private showUpdateAvailable(): void {
    this.showNotification(
      "A new version is available. Refresh to update.",
      "info",
    );
  }

  // Show offline ready notification
  private showOfflineReady(): void {
    this.showNotification("App is ready for offline use!", "success");
  }

  // Show offline message
  private showOfflineMessage(): void {
    this.showNotification(
      "You are offline. Some features may be limited.",
      "warning",
    );
  }

  // Update service worker
  async updateServiceWorker(): Promise<void> {
    if (this.swRegistration?.waiting) {
      this.swRegistration.waiting.postMessage({ type: "SKIP_WAITING" });
      window.location.reload();
    }
  }

  // Get offline status
  get offline(): boolean {
    return !this.isOnline;
  }

  // Get queue length
  get queueLength(): number {
    return this.offlineQueue.length;
  }
}

// Enhanced fetch wrapper with offline support
export async function fetchWithOfflineSupport(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const pwa = PWAManager.getInstance();

  try {
    const response = await fetch(url, options);
    return response;
  } catch (error) {
    // If offline and this is a mutation request, add to queue
    if (!navigator.onLine && options.method && options.method !== "GET") {
      await pwa.addToOfflineQueue(
        url,
        options.method,
        (options.headers as Record<string, string>) || {},
        options.body as string,
      );

      // Return a fake success response for offline mutations
      return new Response(
        JSON.stringify({
          success: true,
          offline: true,
          message: "Request queued for when connection is restored",
        }),
        {
          status: 200,
          statusText: "OK (Offline)",
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    throw error;
  }
}

// Cache management utilities
export class CacheManager {
  static async clearOldCaches(): Promise<void> {
    if ("caches" in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((name) => name.startsWith("expenso-") && name.includes("old"))
          .map((name) => caches.delete(name)),
      );
    }
  }

  static async getCacheSize(): Promise<number> {
    if ("caches" in window && "estimate" in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return estimate.usage || 0;
    }
    return 0;
  }

  static async clearAllCaches(): Promise<void> {
    if ("caches" in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
    }
  }
}

export default PWAManager;
