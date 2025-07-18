import api from "../api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role?: "admin" | "owner" | "worker" | "demo";
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "owner" | "worker" | "demo";
  avatar?: string;
  phone?: string;
  shop_name?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expires_in: number;
}

export class AuthService {
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post("/auth/login", credentials);
    const authData = response.data;

    // Store auth data in localStorage
    localStorage.setItem("auth_token", authData.token);
    localStorage.setItem("user_data", JSON.stringify(authData.user));

    return authData;
  }

  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post("/auth/register", userData);
    const authData = response.data;

    // Store auth data in localStorage
    localStorage.setItem("auth_token", authData.token);
    localStorage.setItem("user_data", JSON.stringify(authData.user));

    return authData;
  }

  static async logout(): Promise<void> {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local storage regardless of API response
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
      localStorage.removeItem("role"); // Clear role from old system
    }
  }

  static async getCurrentUser(): Promise<User> {
    const response = await api.get("/auth/me");
    return response.data;
  }

  static async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await api.put("/auth/profile", userData);
    const updatedUser = response.data;

    // Update stored user data
    localStorage.setItem("user_data", JSON.stringify(updatedUser));

    return updatedUser;
  }

  static async changePassword(
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    await api.post("/auth/change-password", {
      old_password: oldPassword,
      new_password: newPassword,
    });
  }

  static async forgotPassword(email: string): Promise<void> {
    await api.post("/auth/forgot-password", { email });
  }

  static async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<void> {
    await api.post("/auth/reset-password", {
      token,
      new_password: newPassword,
    });
  }

  static getStoredUser(): User | null {
    const userData = localStorage.getItem("user_data");
    return userData ? JSON.parse(userData) : null;
  }

  static getStoredToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  static isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }
}
