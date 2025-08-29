import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  sizes?: string;
  srcSet?: string;
  loading?: "lazy" | "eager";
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  placeholder = "empty",
  blurDataURL,
  sizes,
  srcSet,
  loading = "lazy",
  onLoad,
  onError,
  fallbackSrc = "/placeholder-image.jpg",
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const [currentSrc, setCurrentSrc] = useState(priority ? src : "");

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setCurrentSrc(src);
          observer.disconnect();
        }
      },
      {
        rootMargin: "50px", // Load image when it's 50px away from viewport
        threshold: 0.1,
      }
    );

    const currentImgRef = imgRef.current;
    if (currentImgRef) {
      observer.observe(currentImgRef);
    }

    return () => {
      if (currentImgRef) {
        observer.unobserve(currentImgRef);
      }
    };
  }, [src, priority, isInView]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    setCurrentSrc(fallbackSrc);
    onError?.();
  };

  const getBlurStyle = () => {
    if (placeholder === "blur" && blurDataURL && isLoading) {
      return {
        backgroundImage: `url(${blurDataURL})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "blur(10px)",
      };
    }
    return {};
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        isLoading && placeholder === "blur" && "animate-pulse",
        className
      )}
      style={{ width, height }}
    >
      {/* Placeholder/Loading state */}
      {isLoading && placeholder === "empty" && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-muted/50 to-muted/80 animate-pulse flex items-center justify-center"
          style={{ width, height }}
        >
          <div className="text-muted-foreground text-sm">Loading...</div>
        </div>
      )}

      {/* Blur placeholder */}
      {placeholder === "blur" && blurDataURL && isLoading && (
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={getBlurStyle()}
        />
      )}

      {/* Main image */}
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        srcSet={srcSet}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        style={{
          objectFit: "cover",
          objectPosition: "center",
        }}
      />

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-muted/50 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <div className="text-2xl mb-2">🖼️</div>
            <div className="text-sm">Image not available</div>
          </div>
        </div>
      )}
    </div>
  );
};

// Responsive image component with multiple breakpoints
interface ResponsiveImageProps
  extends Omit<OptimizedImageProps, "src" | "srcSet" | "sizes"> {
  imageSizes: {
    mobile: string;
    tablet?: string;
    desktop?: string;
    xl?: string;
  };
  alt: string;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  imageSizes,
  alt,
  ...props
}) => {
  // Generate srcSet based on available sizes
  const generateSrcSet = () => {
    const srcSetArray: string[] = [];

    if (imageSizes.mobile) srcSetArray.push(`${imageSizes.mobile} 390w`);
    if (imageSizes.tablet) srcSetArray.push(`${imageSizes.tablet} 768w`);
    if (imageSizes.desktop) srcSetArray.push(`${imageSizes.desktop} 1024w`);
    if (imageSizes.xl) srcSetArray.push(`${imageSizes.xl} 1280w`);

    return srcSetArray.join(", ");
  };

  const generateSizes = () => {
    const sizesArray: string[] = [];

    if (imageSizes.mobile) sizesArray.push("(max-width: 390px) 390px");
    if (imageSizes.tablet) sizesArray.push("(max-width: 768px) 768px");
    if (imageSizes.desktop) sizesArray.push("(max-width: 1024px) 1024px");
    if (imageSizes.xl) sizesArray.push("1280px");

    return sizesArray.join(", ") || "100vw";
  };

  return (
    <OptimizedImage
      src={imageSizes.desktop || imageSizes.tablet || imageSizes.mobile}
      srcSet={generateSrcSet()}
      sizes={generateSizes()}
      alt={alt}
      {...props}
    />
  );
};

// Hero image component optimized for above-the-fold content
export const HeroImage: React.FC<
  Omit<OptimizedImageProps, "priority" | "loading">
> = (props) => (
  <OptimizedImage
    {...props}
    priority={true}
    loading="eager"
    className={cn("w-full h-full object-cover", props.className)}
  />
);

// Card image component with consistent sizing
export const CardImage: React.FC<
  Omit<OptimizedImageProps, "width" | "height"> & {
    size?: "sm" | "md" | "lg";
  }
> = ({ size = "md", ...props }) => {
  const sizeClasses = {
    sm: { width: 200, height: 150 },
    md: { width: 300, height: 200 },
    lg: { width: 400, height: 300 },
  };

  return (
    <OptimizedImage
      {...props}
      width={sizeClasses[size].width}
      height={sizeClasses[size].height}
      className={cn("rounded-lg", props.className)}
    />
  );
};

export default OptimizedImage;
