import axios from "axios";

const BASE_URL = "https://positive-kodiak-friendly.ngrok-free.app";

// Create axios instance with default config
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true", // Skip ngrok browser warning
  },
});

// Enhanced security interceptor with strict demo/real user separation
api.interceptors.request.use(
  (config) => {
    const isDemoMode = localStorage.getItem("demo_mode") === "true";
    const token = localStorage.getItem("auth_token");
    const userDataRaw = localStorage.getItem("user_data");

    // Security: Strict demo mode isolation
    if (isDemoMode) {
      // Validate demo token format for security
      if (!token || !token.startsWith("demo-token-expo-")) {
        console.warn("Invalid demo token detected, cleaning up");
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(new Error("Invalid demo session"));
      }

      // Validate demo user data
      if (userDataRaw) {
        try {
          const userData = JSON.parse(userDataRaw);
          if (
            userData.role !== "demo" ||
            !userData.email?.includes("expo.local")
          ) {
            console.warn("Invalid demo user data detected");
            localStorage.clear();
            window.location.href = "/login";
            return Promise.reject(new Error("Invalid demo user data"));
          }
        } catch {
          localStorage.clear();
          window.location.href = "/login";
          return Promise.reject(new Error("Corrupted demo user data"));
        }
      }

      // Block all real API calls for demo users
      return Promise.reject(new Error("DEMO_MODE_API_BLOCKED"));
    }

    // Security: Strict real user validation
    if (!token) {
      return Promise.reject(new Error("Authentication required"));
    }

    // Security: Prevent demo tokens in real mode
    if (token.startsWith("demo-token")) {
      console.warn("Demo token detected in real mode, cleaning up");
      localStorage.clear();
      window.location.href = "/login";
      return Promise.reject(new Error("Invalid token type"));
    }

    // Security: Validate JWT token format
    const tokenParts = token.split(".");
    if (tokenParts.length !== 3) {
      console.warn("Invalid JWT token format");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
      window.location.href = "/login";
      return Promise.reject(new Error("Invalid token format"));
    }

    // Security: Validate real user data
    if (userDataRaw) {
      try {
        const userData = JSON.parse(userDataRaw);
        if (
          userData.role === "demo" ||
          userData.email?.includes("expo.local")
        ) {
          console.warn("Demo user data detected in real mode");
          localStorage.clear();
          window.location.href = "/login";
          return Promise.reject(new Error("Invalid user session"));
        }
      } catch {
        localStorage.removeItem("user_data");
      }
    }

    // Add security headers for real API calls
    config.headers.Authorization = `Bearer ${token}`;
    config.headers["X-Requested-With"] = "XMLHttpRequest";
    config.headers["X-Session-Type"] = "real-user";

    return config;
  },
  (error) => Promise.reject(error),
);

// Enhanced response interceptor with security validation
api.interceptors.response.use(
  (response) => {
    // Security: Validate response integrity for real users
    const isDemoMode = localStorage.getItem("demo_mode") === "true";

    if (!isDemoMode && response.headers) {
      // Ensure response is from legitimate backend
      const serverSignature = response.headers["x-server-signature"];
      if (serverSignature && !serverSignature.includes("expenso-backend")) {
        console.warn("Invalid server response detected");
        return Promise.reject(new Error("Security: Invalid server response"));
      }
    }

    return response;
  },
  (error) => {
    const isDemoMode = localStorage.getItem("demo_mode") === "true";

    // Security: Handle demo mode API blocks
    if (error.message === "DEMO_MODE_API_BLOCKED") {
      // This is expected for demo mode - don't redirect
      return Promise.reject(error);
    }

    // Security: Handle authentication errors for real users
    if (error.response?.status === 401 && !isDemoMode) {
      console.warn("Authentication failed, cleaning session");
      localStorage.clear();
      window.location.href = "/login";
    }

    // Security: Handle forbidden errors
    if (error.response?.status === 403) {
      console.warn("Access forbidden - insufficient permissions");
      // Don't clear storage for 403, just reject
    }

    // Security: Handle potential session hijacking
    if (
      error.response?.status === 422 &&
      error.response?.data?.message?.includes("session")
    ) {
      console.warn("Session validation failed");
      localStorage.clear();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default api;
