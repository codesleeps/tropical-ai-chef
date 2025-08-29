import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { env } from "@/config/environment";
import { PAGE_SEO_CONFIG } from "@/components/SEO";

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  image: string;
  url: string;
  type: "website" | "article" | "product";
  publishedTime?: string;
  modifiedTime?: string;
}

// Hook to manage SEO for individual pages
export const useSEO = (customSEO?: Partial<SEOData>) => {
  const location = useLocation();

  const pageConfig = PAGE_SEO_CONFIG[location.pathname] || {};
  const defaultSEO: SEOData = {
    title: "Tropical AI Chef - AI-Powered Recipe Generator",
    description:
      "Create personalized tropical juice recipes with our AI-powered generator. Discover healthy, delicious blends of exotic fruits and vegetables.",
    keywords: ["tropical juice", "AI recipes", "healthy drinks"],
    image: `${env.baseUrl}/og-image.jpg`,
    url: `${env.baseUrl}${location.pathname}`,
    type: "website",
  };

  const finalSEO = {
    ...defaultSEO,
    ...pageConfig,
    ...customSEO,
  };

  return finalSEO;
};

// Hook for tracking page views (for analytics)
export const usePageView = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view - integrate with analytics service
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("config", "GA_MEASUREMENT_ID", {
        page_path: location.pathname,
        page_title: document.title,
      });
    }

    // Console log for development
    if (env.environment === "development") {
      console.log(`📊 Page view: ${location.pathname}`);
    }
  }, [location]);
};

// Hook for managing structured data
export const useStructuredData = (type: string, data: Record<string, any>) => {
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": type,
      ...data,
    };

    // Remove existing structured data for this type
    const existingScript = document.querySelector(
      `script[data-schema-type="${type}"]`
    );
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-schema-type", type);
    script.textContent = JSON.stringify(structuredData, null, 2);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.querySelector(
        `script[data-schema-type="${type}"]`
      );
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [type, data]);
};

// Hook for breadcrumb management
export const useBreadcrumb = () => {
  const location = useLocation();

  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split("/").filter((x) => x);
    const breadcrumbs = [{ name: "Home", url: "/" }];

    let currentPath = "";
    pathnames.forEach((name) => {
      currentPath += `/${name}`;
      const breadcrumbName = name.charAt(0).toUpperCase() + name.slice(1);
      breadcrumbs.push({
        name: breadcrumbName,
        url: currentPath,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Generate structured data for breadcrumbs
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: breadcrumb.name,
      item: `${env.baseUrl}${breadcrumb.url}`,
    })),
  };

  useStructuredData("BreadcrumbList", breadcrumbStructuredData);

  return breadcrumbs;
};

// Performance monitoring hook
export const usePerformanceMonitoring = () => {
  useEffect(() => {
    // Monitor Core Web Vitals
    if ("web-vital" in window) {
      // This would integrate with actual web vitals measurement
      console.log("📈 Performance monitoring initialized");
    }

    // Monitor page load time
    const startTime = performance.now();

    return () => {
      const loadTime = performance.now() - startTime;
      if (env.environment === "development") {
        console.log(`⏱️ Component render time: ${loadTime.toFixed(2)}ms`);
      }
    };
  }, []);
};

export default {
  useSEO,
  usePageView,
  useStructuredData,
  useBreadcrumb,
  usePerformanceMonitoring,
};
