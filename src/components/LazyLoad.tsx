import {
  Suspense,
  lazy,
  ComponentType,
  ReactNode,
  useState,
  useRef,
  useEffect,
} from "react";
import { LoadingSpinner, PageLoader } from "@/components/LoadingStates";
import ErrorBoundary from "@/components/ErrorBoundary";

interface LazyComponentProps {
  fallback?: ReactNode;
  errorFallback?: ReactNode;
}

// Generic lazy wrapper for components
export const withLazyLoading = <
  P extends Record<string, unknown> = Record<string, unknown>
>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  options: LazyComponentProps = {}
) => {
  const LazyComponent = lazy(importFunc);

  return (props: P) => (
    <ErrorBoundary fallback={options.errorFallback}>
      <Suspense fallback={options.fallback || <LoadingSpinner />}>
        <LazyComponent {...(props as P)} />
      </Suspense>
    </ErrorBoundary>
  );
};

// Lazy loading for heavy components
export const LazyRecipeGenerator = withLazyLoading(
  () => import("@/components/RecipeGenerator"),
  {
    fallback: (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-muted rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-16 bg-muted rounded"></div>
          <div className="h-16 bg-muted rounded"></div>
        </div>
        <div className="h-20 bg-muted rounded"></div>
        <div className="h-12 bg-primary/20 rounded"></div>
      </div>
    ),
    errorFallback: (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load recipe generator</p>
      </div>
    ),
  }
);

export const LazyCostCalculator = withLazyLoading(
  () =>
    import("@/components/CostCalculator").then((module) => ({
      default: module.CostCalculator,
    })),
  {
    fallback: (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-12 bg-muted rounded"></div>
          <div className="h-12 bg-muted rounded"></div>
          <div className="h-12 bg-muted rounded"></div>
        </div>
        <div className="h-32 bg-muted rounded"></div>
      </div>
    ),
  }
);

// Intersection Observer based lazy loading
interface InViewLazyProps {
  children: ReactNode;
  fallback?: ReactNode;
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  className?: string;
}

export const InViewLazy: React.FC<InViewLazyProps> = ({
  children,
  fallback = <div className="h-32 bg-muted animate-pulse rounded"></div>,
  threshold = 0.1,
  rootMargin = "50px",
  once = true,
  className,
}) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsInView(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin, once]);

  return (
    <div ref={ref} className={className}>
      {isInView ? children : fallback}
    </div>
  );
};

// Lazy loading for page sections
export const LazySection: React.FC<{
  children: ReactNode;
  height?: string;
  className?: string;
}> = ({ children, height = "min-h-[200px]", className }) => (
  <InViewLazy
    fallback={
      <div
        className={`${height} bg-gradient-to-r from-muted/50 to-muted/80 animate-pulse rounded-lg flex items-center justify-center`}
      >
        <LoadingSpinner text="Loading section..." />
      </div>
    }
    className={className}
  >
    {children}
  </InViewLazy>
);

// Preload components for faster navigation
export const preloadComponent = (
  importFunc: () => Promise<{ default: ComponentType<unknown> }>
) => {
  // Preload on hover or during idle time
  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => importFunc());
  } else {
    setTimeout(() => importFunc(), 100);
  }
};

// Hook for preloading routes
export const usePreloadRoute = (routePath: string) => {
  useEffect(() => {
    const links = document.querySelectorAll(`a[href="${routePath}"]`);

    const handleMouseEnter = () => {
      // Preload route component based on path
      switch (routePath) {
        case "/recipes": {
          preloadComponent(() => import("@/pages/Recipes"));
          break;
        }
        case "/about": {
          preloadComponent(() => import("@/pages/About"));
          break;
        }
        case "/benefits": {
          preloadComponent(() => import("@/pages/Benefits"));
          break;
        }
        case "/blog": {
          preloadComponent(() => import("@/pages/Blog"));
          break;
        }
        case "/orders": {
          preloadComponent(() => import("@/pages/Orders"));
          break;
        }
      }
    };

    links.forEach((link) => {
      link.addEventListener("mouseenter", handleMouseEnter);
    });

    return () => {
      links.forEach((link) => {
        link.removeEventListener("mouseenter", handleMouseEnter);
      });
    };
  }, [routePath]);
};

export default {
  withLazyLoading,
  LazyRecipeGenerator,
  LazyCostCalculator,
  InViewLazy,
  LazySection,
  preloadComponent,
  usePreloadRoute,
};
