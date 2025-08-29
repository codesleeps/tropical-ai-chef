import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, ChefHat, Sparkles } from "lucide-react";

// Generic loading spinner
export const LoadingSpinner = ({
  size = "default",
  text = "Loading...",
  className = "",
}: {
  size?: "small" | "default" | "large";
  text?: string;
  className?: string;
}) => {
  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-6 h-6",
    large: "w-8 h-8",
  };

  const textSizeClasses = {
    small: "text-sm",
    default: "text-base",
    large: "text-lg",
  };

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Loader2 className={`animate-spin ${sizeClasses[size]}`} />
      <span className={`text-muted-foreground ${textSizeClasses[size]}`}>
        {text}
      </span>
    </div>
  );
};

// Page loading overlay
export const PageLoader = ({
  message = "Loading page...",
}: {
  message?: string;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
    <Card className="shadow-tropical">
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <ChefHat className="w-12 h-12 text-primary animate-bounce" />
            <Sparkles className="w-6 h-6 text-secondary absolute -top-1 -right-1 animate-pulse" />
          </div>
          <LoadingSpinner size="default" text={message} />
        </div>
      </CardContent>
    </Card>
  </div>
);

// Recipe generation loading
export const RecipeGenerationLoader = ({
  aiService = "AI",
}: {
  aiService?: string;
}) => (
  <div className="space-y-4">
    <div className="text-center space-y-2">
      <div className="flex items-center justify-center gap-2">
        <ChefHat className="w-6 h-6 text-primary animate-pulse" />
        <Sparkles className="w-5 h-5 text-secondary animate-bounce" />
      </div>
      <p className="text-lg font-semibold bg-gradient-fresh bg-clip-text text-transparent">
        {aiService} is crafting your perfect recipe...
      </p>
      <p className="text-sm text-muted-foreground">
        This may take a few moments while we analyze your preferences
      </p>
    </div>

    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        <span className="text-sm text-muted-foreground">
          Analyzing fruit combinations...
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-secondary rounded-full animate-pulse delay-300"></div>
        <span className="text-sm text-muted-foreground">
          Calculating nutritional benefits...
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-accent rounded-full animate-pulse delay-700"></div>
        <span className="text-sm text-muted-foreground">
          Generating instructions...
        </span>
      </div>
    </div>
  </div>
);

// Skeleton loaders for different content types
export const RecipeCardSkeleton = () => (
  <Card className="shadow-tropical">
    <CardHeader>
      <div className="flex justify-between items-start mb-3">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-14" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
    </CardContent>
  </Card>
);

export const BlogPostSkeleton = () => (
  <Card className="shadow-tropical">
    <CardHeader>
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-between text-xs mb-4">
        <div className="flex items-center gap-1">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        <Skeleton className="h-5 w-12" />
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-10" />
      </div>
    </CardContent>
  </Card>
);

export const FeatureCardSkeleton = () => (
  <Card className="shadow-tropical text-center">
    <CardHeader>
      <Skeleton className="w-12 h-12 mx-auto mb-4 rounded-full" />
      <Skeleton className="h-6 w-3/4 mx-auto" />
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6 mx-auto" />
        <Skeleton className="h-4 w-4/5 mx-auto" />
      </div>
    </CardContent>
  </Card>
);

// List loading skeletons
export const RecipeListSkeleton = ({ count = 3 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {Array.from({ length: count }, (_, i) => (
      <RecipeCardSkeleton key={i} />
    ))}
  </div>
);

export const BlogListSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {Array.from({ length: count }, (_, i) => (
      <BlogPostSkeleton key={i} />
    ))}
  </div>
);

export const FeatureListSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
    {Array.from({ length: count }, (_, i) => (
      <FeatureCardSkeleton key={i} />
    ))}
  </div>
);

// Page section skeleton
export const PageSectionSkeleton = () => (
  <section className="py-20 px-6">
    <div className="container mx-auto max-w-6xl">
      <div className="text-center mb-16">
        <Skeleton className="h-12 w-3/4 mx-auto mb-6" />
        <Skeleton className="h-6 w-2/3 mx-auto" />
      </div>
      <FeatureListSkeleton />
    </div>
  </section>
);

export default {
  LoadingSpinner,
  PageLoader,
  RecipeGenerationLoader,
  RecipeCardSkeleton,
  BlogPostSkeleton,
  FeatureCardSkeleton,
  RecipeListSkeleton,
  BlogListSkeleton,
  FeatureListSkeleton,
  PageSectionSkeleton,
};
