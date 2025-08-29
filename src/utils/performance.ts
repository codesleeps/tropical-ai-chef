// Performance monitoring and optimization utilities
import { useEffect, useRef, useCallback } from "react";

interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  timeToFirstByte: number;
}

// Core Web Vitals monitoring
export class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers() {
    // Largest Contentful Paint (LCP)
    if ("PerformanceObserver" in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          this.metrics.largestContentfulPaint = lastEntry.startTime;
        });
        lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
        this.observers.push(lcpObserver);
      } catch (e) {
        console.warn("LCP observer not supported");
      }

      // First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            this.metrics.firstInputDelay =
              entry.processingStart - entry.startTime;
          });
        });
        fidObserver.observe({ entryTypes: ["first-input"] });
        this.observers.push(fidObserver);
      } catch (e) {
        console.warn("FID observer not supported");
      }

      // Cumulative Layout Shift (CLS)
      try {
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          list.getEntries().forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          this.metrics.cumulativeLayoutShift = clsValue;
        });
        clsObserver.observe({ entryTypes: ["layout-shift"] });
        this.observers.push(clsObserver);
      } catch (e) {
        console.warn("CLS observer not supported");
      }
    }
  }

  // Measure page load time
  measurePageLoad() {
    if (typeof window !== "undefined" && window.performance) {
      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.metrics.pageLoadTime =
          navigation.loadEventEnd - navigation.loadEventStart;
        this.metrics.timeToFirstByte =
          navigation.responseStart - navigation.requestStart;
        this.metrics.firstContentfulPaint = this.getFirstContentfulPaint();
      }
    }
  }

  private getFirstContentfulPaint(): number {
    const paintEntries = performance.getEntriesByType("paint");
    const fcpEntry = paintEntries.find(
      (entry) => entry.name === "first-contentful-paint"
    );
    return fcpEntry ? fcpEntry.startTime : 0;
  }

  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  logMetrics() {
    console.group("🚀 Performance Metrics");
    Object.entries(this.metrics).forEach(([key, value]) => {
      const formattedKey = key.replace(/([A-Z])/g, " $1").toLowerCase();
      console.log(
        `${formattedKey}: ${
          typeof value === "number" ? value.toFixed(2) : value
        }ms`
      );
    });
    console.groupEnd();
  }

  disconnect() {
    this.observers.forEach((observer) => observer.disconnect());
  }
}

// Resource preloading utilities
export const preloadResource = (
  href: string,
  as: "style" | "script" | "image" | "font" | "fetch"
) => {
  if (typeof document === "undefined") return;

  const link = document.createElement("link");
  link.rel = "preload";
  link.href = href;
  link.as = as;

  if (as === "font") {
    link.crossOrigin = "anonymous";
  }

  document.head.appendChild(link);
};

export const preloadImage = (src: string) => {
  if (typeof window === "undefined") return;

  const img = new Image();
  img.src = src;
};

export const preloadImages = (srcs: string[]) => {
  srcs.forEach(preloadImage);
};

// Critical resource preloading
export const preloadCriticalResources = () => {
  // Preload critical fonts
  preloadResource(
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
    "style"
  );

  // Preload hero images
  preloadImage("/hero-background.jpg");
  preloadImage("/og-image.jpg");
};

// Bundle analysis utilities
export const measureBundleSize = () => {
  if (typeof window === "undefined") return;

  const scripts = Array.from(document.scripts);
  let totalSize = 0;

  scripts.forEach((script) => {
    if (script.src) {
      fetch(script.src, { method: "HEAD" })
        .then((response) => {
          const size = response.headers.get("content-length");
          if (size) {
            totalSize += parseInt(size);
            console.log(
              `📦 Script ${script.src}: ${(parseInt(size) / 1024).toFixed(2)}KB`
            );
          }
        })
        .catch(() => {
          // Ignore CORS errors for external scripts
        });
    }
  });

  setTimeout(() => {
    console.log(`📦 Total bundle size: ${(totalSize / 1024).toFixed(2)}KB`);
  }, 1000);
};

// Memory usage monitoring
export const monitorMemoryUsage = () => {
  if (typeof window === "undefined" || !(window as any).performance?.memory)
    return;

  const memory = (window as any).performance.memory;

  console.group("🧠 Memory Usage");
  console.log(`Used: ${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`);
  console.log(`Total: ${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`);
  console.log(`Limit: ${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`);
  console.groupEnd();
};

// Performance optimization hooks
export const usePerformanceMonitoring = () => {
  useEffect(() => {
    const monitor = new PerformanceMonitor();

    // Measure after initial load
    setTimeout(() => {
      monitor.measurePageLoad();
      monitor.logMetrics();
    }, 100);

    // Monitor memory usage in development
    if (process.env.NODE_ENV === "development") {
      const interval = setInterval(monitorMemoryUsage, 30000); // Every 30 seconds
      return () => {
        clearInterval(interval);
        monitor.disconnect();
      };
    }

    return () => monitor.disconnect();
  }, []);
};

// Image optimization utilities
export const generateResponsiveImageSizes = (
  baseUrl: string,
  sizes: number[] = [320, 640, 768, 1024, 1280]
) => {
  return {
    srcSet: sizes.map((size) => `${baseUrl}?w=${size} ${size}w`).join(", "),
    sizes: [
      "(max-width: 320px) 320px",
      "(max-width: 640px) 640px",
      "(max-width: 768px) 768px",
      "(max-width: 1024px) 1024px",
      "1280px",
    ].join(", "),
  };
};

// Critical path CSS inlining
export const inlineCriticalCSS = (css: string) => {
  if (typeof document === "undefined") return;

  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
};

// Service Worker registration for caching
export const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      console.log("✅ Service Worker registered:", registration);
      return registration;
    } catch (error) {
      console.error("❌ Service Worker registration failed:", error);
    }
  }
};

// Debounced resize handler for performance
export const useDebounced = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => callback(...args), delay);
    },
    [callback, delay]
  ) as T;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

export default {
  PerformanceMonitor,
  preloadResource,
  preloadImage,
  preloadImages,
  preloadCriticalResources,
  measureBundleSize,
  monitorMemoryUsage,
  usePerformanceMonitoring,
  generateResponsiveImageSizes,
  inlineCriticalCSS,
  registerServiceWorker,
  useDebounced,
};
