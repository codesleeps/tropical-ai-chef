import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import About from "./pages/About";
import Benefits from "./pages/Benefits";
import Blog from "./pages/Blog";
import Orders from "./pages/Orders";
import Recipes from "./pages/Recipes";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Legal from "./pages/Legal";
import { env, isDevelopment, logEnvironmentInfo } from "@/config/environment";
import { useEffect } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useErrorHandler } from "@/hooks/use-error-handler";
import SEO, { StructuredData, PreloadResources } from "@/components/SEO";
import {
  generateOrganizationStructuredData,
  generateWebApplicationStructuredData,
} from "@/utils/seo";
import { initializeSecurity } from "@/utils/security";
import ConsentBanner from "@/components/ConsentBanner";
import {
  usePerformanceMonitoring,
  preloadCriticalResources,
  registerServiceWorker,
} from "@/utils/performance";

const queryClient = new QueryClient();

const App = () => {
  const { handleError } = useErrorHandler();

  // Initialize performance monitoring
  usePerformanceMonitoring();

  // Initialize environment on app start
  useEffect(() => {
    logEnvironmentInfo();

    // Initialize security measures
    initializeSecurity();

    // Set document title with app name
    document.title = `${env.appName} - AI-Powered Tropical Juice Recipes`;

    // Preload critical resources for performance
    preloadCriticalResources();

    // Register service worker in production
    if (env.environment === "production") {
      registerServiceWorker().catch((error) => {
        console.warn("Service worker registration failed:", error);
      });
    }

    // Global error handler for unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      event.preventDefault();
      const error =
        event.reason instanceof Error
          ? event.reason
          : new Error(String(event.reason));
      handleError(error, {
        context: "unhandled_promise_rejection",
        severity: "high",
        toastMessage:
          "An unexpected error occurred. The team has been notified.",
      });
    };

    // Global error handler for JavaScript errors
    const handleGlobalError = (event: ErrorEvent) => {
      const error = event.error || new Error(event.message);
      handleError(error, {
        context: "global_javascript_error",
        severity: "high",
        toastMessage: "A JavaScript error occurred. Please refresh the page.",
      });
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("error", handleGlobalError);

    return () => {
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
      window.removeEventListener("error", handleGlobalError);
    };
  }, [handleError]);

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              {/* Global SEO and Structured Data */}
              <SEO />
              <StructuredData
                type="Organization"
                data={generateOrganizationStructuredData()}
              />
              <StructuredData
                type="WebApplication"
                data={generateWebApplicationStructuredData()}
              />
              <PreloadResources />

              {/* GDPR Consent Banner */}
              <ConsentBanner />

              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/benefits" element={<Benefits />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/recipes" element={<Recipes />} />
                <Route path="/legal" element={<Legal />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                {/* Analytics dashboard - development only */}
                {env.environment === "development" && (
                  <Route path="/analytics" element={<Analytics />} />
                )}
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;
