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

// Request interceptor to add auth token and handle demo vs real users
api.interceptors.request.use(
  (config) => {
    const isDemoMode = localStorage.getItem("demo_mode") === "true";
    const token = localStorage.getItem("auth_token");

    // For demo mode, prevent actual API calls - demo should use mock data only
    if (isDemoMode) {
      return Promise.reject(new Error("Demo mode - Using mock data only"));
    }

    // For real users (admin, owner, worker), validate JWT token and use real backend
    if (!token || token.startsWith("demo-token")) {
      return Promise.reject(
        new Error("Invalid or missing JWT token for real user"),
      );
    }

    // Validate JWT token format (basic check) for real users
    const tokenParts = token.split(".");
    if (tokenParts.length !== 3) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
      window.location.href = "/login";
      return Promise.reject(new Error("Invalid JWT token format"));
    }

    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isDemoMode = localStorage.getItem("demo_mode") === "true";

    if (error.response?.status === 401 && !isDemoMode) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
      localStorage.removeItem("demo_mode");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
