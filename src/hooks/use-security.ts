import { useCallback, useEffect, useState } from "react";
import {
  InputValidator,
  RateLimiter,
  APISecurityHelper,
  SecurityMonitor,
  initializeSecurity,
} from "@/utils/security";
import { toast } from "sonner";

interface SecurityHookConfig {
  enableRateLimit?: boolean;
  rateLimitConfig?: {
    limit: number;
    windowMs: number;
  };
  enableInputValidation?: boolean;
  enableCSRFProtection?: boolean;
}

export const useSecurity = (config: SecurityHookConfig = {}) => {
  const {
    enableRateLimit = true,
    rateLimitConfig = { limit: 30, windowMs: 60000 }, // 30 requests per minute
    enableInputValidation = true,
    enableCSRFProtection = true,
  } = config;

  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize security on component mount
  useEffect(() => {
    if (!isInitialized) {
      initializeSecurity();
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Rate limiting hook
  const checkRateLimit = useCallback(
    (key: string = "default"): boolean => {
      if (!enableRateLimit) return true;

      const result = RateLimiter.checkLimit(
        key,
        rateLimitConfig.limit,
        rateLimitConfig.windowMs
      );

      if (!result.allowed) {
        const resetIn = Math.ceil((result.resetTime - Date.now()) / 1000);
        toast.error(`Rate limit exceeded. Please wait ${resetIn} seconds.`);

        SecurityMonitor.logViolation("rate_limit_exceeded", {
          key,
          limit: rateLimitConfig.limit,
          resetTime: result.resetTime,
        });

        return false;
      }

      return true;
    },
    [enableRateLimit, rateLimitConfig]
  );

  // Input validation hook
  const validateInput = useCallback(
    (
      input: string,
      type: "text" | "email" | "url" | "recipe" = "text"
    ): { isValid: boolean; sanitized: string; errors: string[] } => {
      if (!enableInputValidation) {
        return { isValid: true, sanitized: input, errors: [] };
      }

      switch (type) {
        case "email":
          const isValidEmail = InputValidator.isValidEmail(input);
          return {
            isValid: isValidEmail,
            sanitized: input.trim().toLowerCase(),
            errors: isValidEmail ? [] : ["Invalid email format"],
          };

        case "url":
          const isValidURL = InputValidator.isValidURL(input);
          return {
            isValid: isValidURL,
            sanitized: input.trim(),
            errors: isValidURL ? [] : ["Invalid URL format"],
          };

        case "recipe":
          return InputValidator.validateRecipeInput(input);

        case "text":
        default:
          const sanitized = InputValidator.sanitizeText(input);
          return {
            isValid: sanitized.length > 0,
            sanitized,
            errors: sanitized.length === 0 ? ["Input cannot be empty"] : [],
          };
      }
    },
    [enableInputValidation]
  );

  // Secure API request wrapper
  const secureRequest = useCallback(
    async <T>(
      url: string,
      options: RequestInit = {},
      rateLimitKey?: string
    ): Promise<T> => {
      // Check rate limit
      if (rateLimitKey && !checkRateLimit(rateLimitKey)) {
        throw new Error("Rate limit exceeded");
      }

      // Add security headers
      const secureHeaders = enableCSRFProtection
        ? APISecurityHelper.addSecurityHeaders(options.headers)
        : new Headers(options.headers);

      const secureOptions: RequestInit = {
        ...options,
        headers: secureHeaders,
      };

      try {
        const response = await fetch(url, secureOptions);

        // Validate response
        if (!APISecurityHelper.validateResponse(response)) {
          throw new Error("Invalid response received");
        }

        return await response.json();
      } catch (error) {
        SecurityMonitor.logViolation("api_request_failed", {
          url,
          error: error instanceof Error ? error.message : String(error),
          method: options.method || "GET",
        });
        throw error;
      }
    },
    [checkRateLimit, enableCSRFProtection]
  );

  // Report security violation
  const reportViolation = useCallback(
    (type: string, details: Record<string, unknown>) => {
      SecurityMonitor.logViolation(type, details);
    },
    []
  );

  // Get security status
  const getSecurityStatus = useCallback(() => {
    return {
      isInitialized,
      csrfToken: APISecurityHelper.getCSRFToken(),
      violations: SecurityMonitor.getViolations().slice(-10), // Last 10 violations
      config: {
        rateLimitEnabled: enableRateLimit,
        inputValidationEnabled: enableInputValidation,
        csrfProtectionEnabled: enableCSRFProtection,
      },
    };
  }, [
    isInitialized,
    enableRateLimit,
    enableInputValidation,
    enableCSRFProtection,
  ]);

  return {
    // State
    isInitialized,

    // Methods
    checkRateLimit,
    validateInput,
    secureRequest,
    reportViolation,
    getSecurityStatus,

    // Utils
    sanitizeText: InputValidator.sanitizeText,
    sanitizeHTML: InputValidator.sanitizeHTML,
  };
};

// Hook for form security
export const useSecureForm = (formId: string) => {
  const security = useSecurity({
    rateLimitConfig: { limit: 10, windowMs: 60000 }, // 10 submissions per minute
  });

  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});

  const validateField = useCallback(
    (
      fieldName: string,
      value: string,
      type: "text" | "email" | "url" | "recipe" = "text"
    ): boolean => {
      const validation = security.validateInput(value, type);

      setFormErrors((prev) => ({
        ...prev,
        [fieldName]: validation.errors,
      }));

      if (!validation.isValid) {
        security.reportViolation("form_validation_failed", {
          formId,
          fieldName,
          errors: validation.errors,
        });
      }

      return validation.isValid;
    },
    [security, formId]
  );

  const handleSecureSubmit = useCallback(
    async (submitHandler: () => Promise<void> | void) => {
      // Check rate limit for form submissions
      if (!security.checkRateLimit(`form_${formId}`)) {
        return;
      }

      // Check if form has any errors
      const hasErrors = Object.values(formErrors).some(
        (errors) => errors.length > 0
      );
      if (hasErrors) {
        toast.error("Please fix form errors before submitting");
        return;
      }

      try {
        await submitHandler();
      } catch (error) {
        security.reportViolation("form_submission_failed", {
          formId,
          error: error instanceof Error ? error.message : String(error),
        });
        throw error;
      }
    },
    [security, formId, formErrors]
  );

  const clearFieldErrors = useCallback((fieldName: string) => {
    setFormErrors((prev) => ({
      ...prev,
      [fieldName]: [],
    }));
  }, []);

  const clearAllErrors = useCallback(() => {
    setFormErrors({});
  }, []);

  return {
    validateField,
    handleSecureSubmit,
    formErrors,
    clearFieldErrors,
    clearAllErrors,
    ...security,
  };
};

export default useSecurity;
