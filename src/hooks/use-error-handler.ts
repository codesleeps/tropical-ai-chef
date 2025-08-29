import { useCallback } from "react";
import { toast } from "sonner";
import { env, isDevelopment } from "@/config/environment";

export interface ErrorDetails {
  error: Error;
  context?: string;
  userId?: string;
  timestamp: string;
  url: string;
  userAgent: string;
  appVersion: string;
}

export const useErrorHandler = () => {
  const logError = useCallback((error: Error, context?: string) => {
    const errorDetails: ErrorDetails = {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } as Error,
      context,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      appVersion: env.appVersion,
    };

    // Log to console in development
    if (isDevelopment()) {
      console.error("Error logged:", errorDetails);
    }

    // TODO: Send to error logging service in production
    if (env.environment === "production") {
      // This would integrate with services like Sentry, LogRocket, etc.
      console.log("Error would be sent to logging service:", errorDetails);
    }

    return errorDetails;
  }, []);

  const handleError = useCallback(
    (
      error: Error,
      options: {
        context?: string;
        showToast?: boolean;
        toastMessage?: string;
        severity?: "low" | "medium" | "high";
      } = {}
    ) => {
      const {
        context,
        showToast = true,
        toastMessage,
        severity = "medium",
      } = options;

      // Log the error
      const errorDetails = logError(error, context);

      // Show user-friendly toast notification
      if (showToast) {
        const message = toastMessage || getDefaultErrorMessage(error, severity);

        switch (severity) {
          case "low":
            toast.info(message);
            break;
          case "high":
            toast.error(message, { duration: 8000 });
            break;
          case "medium":
          default:
            toast.error(message);
            break;
        }
      }

      return errorDetails;
    },
    [logError]
  );

  const handleAsyncError = useCallback(
    async <T>(
      asyncFunction: () => Promise<T>,
      options: {
        context?: string;
        fallbackValue?: T;
        showToast?: boolean;
        toastMessage?: string;
        onError?: (error: Error) => void;
      } = {}
    ): Promise<T | undefined> => {
      const {
        context,
        fallbackValue,
        showToast = true,
        toastMessage,
        onError,
      } = options;

      try {
        return await asyncFunction();
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));

        handleError(err, {
          context,
          showToast,
          toastMessage,
          severity: "medium",
        });

        if (onError) {
          onError(err);
        }

        return fallbackValue;
      }
    },
    [handleError]
  );

  const handleNetworkError = useCallback(
    (error: Error, context?: string) => {
      const isNetworkError =
        error.message.includes("fetch") ||
        error.message.includes("network") ||
        error.message.includes("timeout") ||
        error.name === "NetworkError";

      const message = isNetworkError
        ? "Network connection issue. Please check your internet connection and try again."
        : "An unexpected error occurred. Please try again.";

      return handleError(error, {
        context: context || "network_operation",
        toastMessage: message,
        severity: isNetworkError ? "medium" : "high",
      });
    },
    [handleError]
  );

  const handleApiError = useCallback(
    (error: Error, apiName?: string) => {
      const context = apiName ? `api_${apiName}` : "api_call";

      let message = "Service temporarily unavailable. Please try again.";

      if (
        error.message.includes("401") ||
        error.message.includes("unauthorized")
      ) {
        message = "Authentication failed. Please check your API key.";
      } else if (
        error.message.includes("429") ||
        error.message.includes("rate limit")
      ) {
        message = "Too many requests. Please wait a moment and try again.";
      } else if (
        error.message.includes("500") ||
        error.message.includes("server error")
      ) {
        message = "Server error. The service will be back shortly.";
      }

      return handleError(error, {
        context,
        toastMessage: message,
        severity: "medium",
      });
    },
    [handleError]
  );

  return {
    handleError,
    handleAsyncError,
    handleNetworkError,
    handleApiError,
    logError,
  };
};

// Helper function to get default error messages
const getDefaultErrorMessage = (
  error: Error,
  severity: "low" | "medium" | "high"
): string => {
  const baseMessages = {
    low: "Something minor went wrong, but you can continue.",
    medium: "An error occurred. Please try again.",
    high: "A serious error occurred. Please refresh the page or contact support.",
  };

  // Check for specific error types
  if (error.message.includes("Failed to fetch")) {
    return "Network error. Please check your connection.";
  }

  if (error.message.includes("timeout")) {
    return "Request timed out. Please try again.";
  }

  if (error.message.includes("not found")) {
    return "Resource not found. Please try a different request.";
  }

  return baseMessages[severity];
};

export default useErrorHandler;
