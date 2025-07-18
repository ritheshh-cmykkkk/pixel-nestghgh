// Enhanced security utilities for session validation and protection

export class SecurityValidator {
  private static readonly DEMO_TOKEN_PREFIX = "demo-token-expo-";
  private static readonly DEMO_EMAIL_DOMAIN = "expo.local";
  private static readonly REAL_TOKEN_MIN_LENGTH = 100;

  /**
   * Validates if a token is a legitimate demo token
   */
  static isValidDemoToken(token: string): boolean {
    return (
      token.startsWith(this.DEMO_TOKEN_PREFIX) &&
      token.length > this.DEMO_TOKEN_PREFIX.length + 10 // Timestamp + random suffix
    );
  }

  /**
   * Validates if user data is legitimate demo data
   */
  static isValidDemoUser(userData: any): boolean {
    return (
      userData &&
      userData.role === "demo" &&
      userData.email?.includes(this.DEMO_EMAIL_DOMAIN) &&
      userData.id?.includes("demo")
    );
  }

  /**
   * Validates if a token is a legitimate real user JWT token
   */
  static isValidRealToken(token: string): boolean {
    if (!token || token.startsWith("demo-token")) {
      return false;
    }

    // Basic JWT format validation
    const parts = token.split(".");
    if (parts.length !== 3) {
      return false;
    }

    // Check minimum length for security
    if (token.length < this.REAL_TOKEN_MIN_LENGTH) {
      return false;
    }

    return true;
  }

  /**
   * Validates if user data is legitimate real user data
   */
  static isValidRealUser(userData: any): boolean {
    return (
      userData &&
      userData.role !== "demo" &&
      !userData.email?.includes(this.DEMO_EMAIL_DOMAIN) &&
      !userData.id?.includes("demo") &&
      ["admin", "owner", "worker"].includes(userData.role)
    );
  }

  /**
   * Performs complete session validation
   */
  static validateSession(): {
    isValid: boolean;
    isDemoMode: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    const isDemoMode = localStorage.getItem("demo_mode") === "true";
    const token = localStorage.getItem("auth_token");
    const userDataRaw = localStorage.getItem("user_data");

    let userData = null;
    if (userDataRaw) {
      try {
        userData = JSON.parse(userDataRaw);
      } catch {
        errors.push("Corrupted user data");
      }
    }

    if (isDemoMode) {
      // Validate demo session
      if (!token || !this.isValidDemoToken(token)) {
        errors.push("Invalid demo token");
      }

      if (!userData || !this.isValidDemoUser(userData)) {
        errors.push("Invalid demo user data");
      }
    } else {
      // Validate real user session
      if (!token || !this.isValidRealToken(token)) {
        errors.push("Invalid real user token");
      }

      if (!userData || !this.isValidRealUser(userData)) {
        errors.push("Invalid real user data");
      }

      // Cross-contamination check
      if (token && token.startsWith("demo-token")) {
        errors.push("Demo token in real mode");
      }

      if (
        userData &&
        (userData.role === "demo" ||
          userData.email?.includes(this.DEMO_EMAIL_DOMAIN))
      ) {
        errors.push("Demo user data in real mode");
      }
    }

    return {
      isValid: errors.length === 0,
      isDemoMode,
      errors,
    };
  }

  /**
   * Sanitizes storage by removing invalid or conflicting data
   */
  static sanitizeStorage(): void {
    const validation = this.validateSession();

    if (!validation.isValid) {
      console.warn(
        "Invalid session detected, cleaning storage:",
        validation.errors,
      );
      localStorage.clear();
      return;
    }

    // Remove any potential leftover keys
    const allowedKeys = [
      "auth_token",
      "user_data",
      "demo_mode",
      "expenso-theme",
    ];
    const allKeys = Object.keys(localStorage);

    allKeys.forEach((key) => {
      if (!allowedKeys.includes(key)) {
        localStorage.removeItem(key);
      }
    });
  }

  /**
   * Generates a secure demo token
   */
  static generateDemoToken(): string {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 15);
    return `${this.DEMO_TOKEN_PREFIX}${timestamp}-${randomSuffix}`;
  }

  /**
   * Creates a secure demo user object
   */
  static createSecureDemoUser(): any {
    return {
      id: "demo-user-secured",
      email: `demo@${this.DEMO_EMAIL_DOMAIN}`,
      name: "Demo User",
      role: "demo",
      shop_name: "Demo Repair Shop",
      avatar: null,
    };
  }

  /**
   * Logs security events for monitoring
   */
  static logSecurityEvent(event: string, details?: any): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      event,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // In development, log to console
    if (process.env.NODE_ENV === "development") {
      console.warn("Security Event:", logEntry);
    }

    // In production, this could be sent to a security monitoring service
    // SecurityMonitoring.send(logEntry);
  }
}

// Auto-run security validation on module load
SecurityValidator.sanitizeStorage();
