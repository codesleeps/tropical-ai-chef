// Security utilities for Tropical AI Chef
import { env } from "@/config/environment";

// CSRF Token Management
class CSRFManager {
  private token: string | null = null;

  generateToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    this.token = Array.from(array, (byte) =>
      byte.toString(16).padStart(2, "0")
    ).join("");
    return this.token;
  }

  getToken(): string | null {
    return this.token;
  }

  validateToken(token: string): boolean {
    return this.token === token;
  }
}

const csrfManager = new CSRFManager();

// Security Headers Configuration
export const SECURITY_HEADERS = {
  "Content-Security-Policy":
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://api.openai.com https://api-inference.huggingface.co https://www.google-analytics.com; " +
    "frame-ancestors 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self';",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
  "Strict-Transport-Security":
    env.environment === "production"
      ? "max-age=31536000; includeSubDomains"
      : undefined,
};

// Input Validation and Sanitization
export class InputValidator {
  static sanitizeText(input: string): string {
    return input
      .replace(/[<>"'&]/g, (char) => {
        switch (char) {
          case "<":
            return "&lt;";
          case ">":
            return "&gt;";
          case '"':
            return "&quot;";
          case "'":
            return "&#x27;";
          case "&":
            return "&amp;";
          default:
            return char;
        }
      })
      .trim();
  }

  static sanitizeHTML(html: string): string {
    const div = document.createElement("div");
    div.textContent = html;
    return div.innerHTML;
  }

  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  static isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static validateRecipeInput(input: string): {
    isValid: boolean;
    sanitized: string;
    errors: string[];
  } {
    const sanitized = this.sanitizeText(input);
    const errors: string[] = [];

    if (sanitized.length === 0) {
      errors.push("Input cannot be empty");
    }

    if (sanitized.length > 1000) {
      errors.push("Input too long (max 1000 characters)");
    }

    // Check for potential script injection
    if (/script|javascript|onclick|onerror/i.test(sanitized)) {
      errors.push("Invalid characters detected");
    }

    return {
      isValid: errors.length === 0,
      sanitized,
      errors,
    };
  }
}

// Rate Limiting
export class RateLimiter {
  private static requests = new Map<
    string,
    { count: number; resetTime: number }
  >();

  static checkLimit(
    key: string,
    limit: number,
    windowMs: number
  ): { allowed: boolean; resetTime: number } {
    const now = Date.now();
    const requestData = this.requests.get(key);

    if (!requestData || now > requestData.resetTime) {
      this.requests.set(key, { count: 1, resetTime: now + windowMs });
      return { allowed: true, resetTime: now + windowMs };
    }

    if (requestData.count >= limit) {
      return { allowed: false, resetTime: requestData.resetTime };
    }

    requestData.count++;
    return { allowed: true, resetTime: requestData.resetTime };
  }

  static reset(key: string): void {
    this.requests.delete(key);
  }

  static cleanup(): void {
    const now = Date.now();
    for (const [key, data] of this.requests.entries()) {
      if (now > data.resetTime) {
        this.requests.delete(key);
      }
    }
  }
}

// API Security Helper
export class APISecurityHelper {
  static addSecurityHeaders(headers?: HeadersInit): Headers {
    const secureHeaders = new Headers(headers);

    secureHeaders.set("X-Requested-With", "XMLHttpRequest");
    secureHeaders.set("X-Client-Version", env.appVersion);
    secureHeaders.set("X-Request-Time", Date.now().toString());

    const csrfToken = csrfManager.getToken();
    if (csrfToken) {
      secureHeaders.set("X-CSRF-Token", csrfToken);
    }

    return secureHeaders;
  }

  static validateResponse(response: Response): boolean {
    // Check for security headers in response
    const hasSecurityHeaders = response.headers.has("x-content-type-options");
    const isValidStatus = response.status >= 200 && response.status < 400;

    return isValidStatus;
  }

  static getCSRFToken(): string {
    return csrfManager.getToken() || csrfManager.generateToken();
  }
}

// Security Monitoring
export class SecurityMonitor {
  private static violations: Array<{
    type: string;
    timestamp: number;
    details: Record<string, unknown>;
  }> = [];

  static logViolation(type: string, details: Record<string, unknown>): void {
    this.violations.push({
      type,
      timestamp: Date.now(),
      details,
    });

    // Keep only last 100 violations
    if (this.violations.length > 100) {
      this.violations = this.violations.slice(-100);
    }

    // Log to console in development
    if (env.environment === "development") {
      console.warn("Security violation:", { type, details });
    }
  }

  static getViolations(): Array<{
    type: string;
    timestamp: number;
    details: Record<string, unknown>;
  }> {
    return [...this.violations];
  }

  static clearViolations(): void {
    this.violations = [];
  }
}

// Security initialization function
export const initializeSecurity = (): void => {
  // Generate initial CSRF token
  csrfManager.generateToken();

  // Set up periodic cleanup of rate limiter
  setInterval(() => {
    RateLimiter.cleanup();
  }, 60000); // Clean up every minute

  // Log security initialization
  if (env.environment === "development") {
    console.log("Security system initialized with CSP and rate limiting");
  }
};

export default {
  SECURITY_HEADERS,
  InputValidator,
  RateLimiter,
  APISecurityHelper,
  SecurityMonitor,
  initializeSecurity,
};
