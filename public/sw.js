const CACHE_NAME = "expenso-v1.0.0";
const STATIC_CACHE = "expenso-static-v1.0.0";
const DYNAMIC_CACHE = "expenso-dynamic-v1.0.0";
const API_CACHE = "expenso-api-v1.0.0";

// Resources to cache on install
const STATIC_RESOURCES = [
  "/",
  "/manifest.json",
  "/offline.html",
  // Add critical CSS and JS files here
];

// API endpoints to cache
const CACHEABLE_APIS = [
  "/statistics/dashboard",
  "/transactions",
  "/customers",
  "/suppliers",
  "/bills",
  "/expenditures",
];

// Install event - cache static resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_RESOURCES))
      .then(() => self.skipWaiting()),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter(
              (cacheName) =>
                cacheName.startsWith("expenso-") && cacheName !== CACHE_NAME,
            )
            .map((cacheName) => caches.delete(cacheName)),
        );
      })
      .then(() => self.clients.claim()),
  );
});

// Fetch event - implement caching strategies
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (
    url.pathname.startsWith("/api/") ||
    url.hostname === "positive-kodiak-friendly.ngrok-free.app"
  ) {
    event.respondWith(handleAPIRequest(request));
    return;
  }

  // Handle static resources
  if (request.destination === "document") {
    event.respondWith(handleDocumentRequest(request));
    return;
  }

  // Handle other resources (CSS, JS, images)
  event.respondWith(handleResourceRequest(request));
});

// Handle API requests with network-first strategy
async function handleAPIRequest(request) {
  const url = new URL(request.url);
  const cacheName = API_CACHE;

  try {
    // Try network first
    const networkResponse = await fetch(request);

    if (networkResponse.ok && request.method === "GET") {
      // Cache successful GET requests
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    if (request.method === "GET") {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
    }

    // Return offline response for failed API calls
    return new Response(
      JSON.stringify({
        error: "Network unavailable",
        offline: true,
        message:
          "You are currently offline. Some features may not be available.",
      }),
      {
        status: 503,
        statusText: "Service Unavailable",
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

// Handle document requests
async function handleDocumentRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    // Network failed, return cached version or offline page
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page
    return caches.match("/offline.html");
  }
}

// Handle other resources with cache-first strategy
async function handleResourceRequest(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    // Return a fallback response for failed resource requests
    if (request.destination === "image") {
      return new Response(
        '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#6b7280">Image unavailable</text></svg>',
        { headers: { "Content-Type": "image/svg+xml" } },
      );
    }

    throw error;
  }
}

// Background sync for offline data
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(syncOfflineData());
  }
});

// Sync offline data when connection is restored
async function syncOfflineData() {
  try {
    // Get offline data from IndexedDB
    const offlineData = await getOfflineData();

    for (const item of offlineData) {
      try {
        await fetch(item.url, {
          method: item.method,
          headers: item.headers,
          body: item.body,
        });

        // Remove synced item from offline storage
        await removeOfflineData(item.id);
      } catch (error) {
        console.error("Failed to sync offline data:", error);
      }
    }
  } catch (error) {
    console.error("Background sync failed:", error);
  }
}

// Push notification handler
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: "/icons/icon-192x192.png",
      badge: "/icons/badge-72x72.png",
      tag: data.tag || "default",
      data: data.data || {},
      actions: data.actions || [],
      requireInteraction: data.requireInteraction || false,
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const clickAction = event.action;
  const notificationData = event.notification.data;

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      // If there's already a window open, focus it
      for (const client of clientList) {
        if (client.url === "/" && "focus" in client) {
          return client.focus();
        }
      }

      // Otherwise, open a new window
      const urlToOpen = notificationData.url || "/";
      return clients.openWindow(urlToOpen);
    }),
  );
});

// Helper functions for IndexedDB operations (simplified)
async function getOfflineData() {
  // Implementation would use IndexedDB to retrieve offline data
  return [];
}

async function removeOfflineData(id) {
  // Implementation would use IndexedDB to remove synced data
  return true;
}

// Message handler for communication with main app
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
