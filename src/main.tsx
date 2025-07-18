import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import PWAManager from "./lib/pwa";

// Initialize PWA features
const pwa = PWAManager.getInstance();

// Register service worker for offline support
pwa.registerServiceWorker().catch(console.error);

// Request notification permission for push notifications
pwa.requestNotificationPermission().catch(console.error);

// Initialize performance monitoring
function initializePerformanceMonitoring() {
  // Monitor app performance
  if ("performance" in window) {
    window.addEventListener("load", () => {
      const perfData = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming;
      console.log(
        "App loaded in:",
        perfData.loadEventEnd - perfData.fetchStart,
        "ms",
      );
    });
  }
}

// Call initialization
initializePerformanceMonitoring();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
