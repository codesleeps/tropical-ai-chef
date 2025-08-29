import { useEffect, useCallback, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  AnalyticsManager,
  ConsentManager,
  ANALYTICS_CONFIG,
} from "@/utils/analytics";
import { env } from "@/config/environment";

interface UseAnalyticsOptions {
  enablePageViews?: boolean;
  enablePerformanceTracking?: boolean;
  enableErrorTracking?: boolean;
  trackingDelay?: number;
}

export const useAnalytics = (options: UseAnalyticsOptions = {}) => {
  const {
    enablePageViews = true,
    enablePerformanceTracking = true,
    enableErrorTracking = true,
    trackingDelay = 100,
  } = options;

  const location = useLocation();
  const initialized = useRef(false);
  const pageViewTracked = useRef(new Set<string>());

  // Initialize analytics on first use
  useEffect(() => {
    if (!initialized.current) {
      AnalyticsManager.initialize();
      initialized.current = true;
    }
  }, []);

  // Track page views on route change
  useEffect(() => {
    if (!enablePageViews) return;

    const currentPath = location.pathname + location.search;

    // Avoid duplicate tracking for the same path
    if (pageViewTracked.current.has(currentPath)) return;

    const timer = setTimeout(() => {
      AnalyticsManager.trackPageView(currentPath, document.title);
      pageViewTracked.current.add(currentPath);
    }, trackingDelay);

    return () => clearTimeout(timer);
  }, [location, enablePageViews, trackingDelay]);

  // Track custom events
  const trackEvent = useCallback(
    (eventName: string, parameters: Record<string, any> = {}) => {
      AnalyticsManager.trackEvent(eventName, parameters);
    },
    []
  );

  // Track recipe generation events
  const trackRecipeGeneration = useCallback(
    (recipeData: {
      fruit: string;
      style: string;
      service: string;
      success: boolean;
      duration?: number;
    }) => {
      AnalyticsManager.trackRecipeGeneration(recipeData);
    },
    []
  );

  // Track cost calculation events
  const trackCostCalculation = useCallback(
    (calculationData: {
      users: number;
      recipesPerUser: number;
      totalCost: number;
    }) => {
      AnalyticsManager.trackCostCalculation(calculationData);
    },
    []
  );

  // Track user engagement
  const trackEngagement = useCallback(
    (action: string, details: Record<string, any> = {}) => {
      AnalyticsManager.trackUserEngagement(action, details);
    },
    []
  );

  // Track timing events
  const trackTiming = useCallback(
    (name: string, startTime: number, category = "User Interaction") => {
      const duration = Date.now() - startTime;
      trackEvent("timing_complete", {
        name,
        value: duration,
        event_category: category,
      });
    },
    [trackEvent]
  );

  return {
    trackEvent,
    trackRecipeGeneration,
    trackCostCalculation,
    trackEngagement,
    trackTiming,
  };
};

// Hook for performance tracking
export const usePerformanceTracking = () => {
  const startTimeRef = useRef<Record<string, number>>({});

  const startTiming = useCallback((name: string) => {
    startTimeRef.current[name] = performance.now();
  }, []);

  const endTiming = useCallback((name: string) => {
    const startTime = startTimeRef.current[name];
    if (startTime) {
      const duration = performance.now() - startTime;
      AnalyticsManager.trackEvent("performance_timing", {
        timing_name: name,
        timing_value: Math.round(duration),
      });
      delete startTimeRef.current[name];
      return duration;
    }
    return 0;
  }, []);

  const measureFunction = useCallback(
    async <T>(name: string, fn: () => Promise<T> | T): Promise<T> => {
      startTiming(name);
      try {
        const result = await fn();
        endTiming(name);
        return result;
      } catch (error) {
        endTiming(name);
        throw error;
      }
    },
    [startTiming, endTiming]
  );

  return {
    startTiming,
    endTiming,
    measureFunction,
  };
};

// Hook for error tracking
export const useErrorTracking = () => {
  const { trackEvent } = useAnalytics();

  const trackError = useCallback(
    (error: Error, context: Record<string, any> = {}) => {
      trackEvent(ANALYTICS_CONFIG.customEvents.errorOccurred, {
        error_message: error.message,
        error_stack: error.stack?.substring(0, 500), // Truncate for analytics
        error_context: JSON.stringify(context),
        url: window.location.href,
      });
    },
    [trackEvent]
  );

  const trackAsyncError = useCallback(
    async <T>(
      asyncFn: () => Promise<T>,
      context: Record<string, any> = {}
    ): Promise<T | null> => {
      try {
        return await asyncFn();
      } catch (error) {
        if (error instanceof Error) {
          trackError(error, context);
        }
        return null;
      }
    },
    [trackError]
  );

  return {
    trackError,
    trackAsyncError,
  };
};

// Hook for consent management
export const useAnalyticsConsent = () => {
  const [hasConsent, setHasConsent] = useState(ConsentManager.hasConsent());

  const giveConsent = useCallback(() => {
    ConsentManager.giveConsent();
    setHasConsent(true);
  }, []);

  const revokeConsent = useCallback(() => {
    ConsentManager.revokeConsent();
    setHasConsent(false);
  }, []);

  const getConsentStatus = useCallback(() => {
    return ConsentManager.getConsentStatus();
  }, []);

  // Update hasConsent when component mounts or localStorage changes
  useEffect(() => {
    const updateConsentStatus = () => {
      setHasConsent(ConsentManager.hasConsent());
    };

    // Listen for storage changes (for cross-tab consent updates)
    window.addEventListener("storage", updateConsentStatus);

    return () => {
      window.removeEventListener("storage", updateConsentStatus);
    };
  }, []);

  return {
    hasConsent,
    giveConsent,
    revokeConsent,
    getConsentStatus,
  };
};

// Hook for analytics data access (development/admin use)
export const useAnalyticsData = () => {
  const getAnalyticsData = useCallback(() => {
    return AnalyticsManager.getAnalyticsData();
  }, []);

  const clearAnalyticsData = useCallback(() => {
    if (env.environment === "development") {
      AnalyticsManager.disable();
      AnalyticsManager.initialize();
    }
  }, []);

  return {
    getAnalyticsData,
    clearAnalyticsData,
  };
};

export default useAnalytics;
