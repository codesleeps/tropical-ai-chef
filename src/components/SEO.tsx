import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { env } from "@/config/environment";

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
  canonical?: string;
}

interface StructuredDataProps {
  type: "WebSite" | "WebApplication" | "Article" | "Recipe" | "Organization";
  data: Record<string, any>;
}

// Default SEO configuration
const DEFAULT_SEO: Required<
  Omit<SEOProps, "publishedTime" | "modifiedTime" | "canonical">
> = {
  title: "Tropical AI Chef - AI-Powered Recipe Generator",
  description:
    "Create personalized tropical juice recipes with our AI-powered generator. Discover healthy, delicious blends of exotic fruits and vegetables.",
  keywords: [
    "tropical juice",
    "smoothie recipes",
    "healthy drinks",
    "AI recipe generator",
    "fresh fruits",
    "vegetables",
    "nutrition",
    "wellness",
    "detox",
    "energy drinks",
  ],
  image: `${env.baseUrl}/og-image.jpg`,
  url: env.baseUrl,
  type: "website",
  author: "Tropical AI Chef Team",
  noIndex: false,
};

// Page-specific SEO configurations
export const PAGE_SEO_CONFIG: Record<string, Partial<SEOProps>> = {
  "/": {
    title: "Tropical AI Chef - AI-Powered Recipe Generator",
    description:
      "Create personalized tropical juice recipes with our AI-powered generator. Discover healthy, delicious blends of exotic fruits and vegetables.",
    keywords: [
      "tropical juice",
      "AI recipes",
      "healthy drinks",
      "fruit smoothies",
    ],
  },
  "/recipes": {
    title: "AI Recipe Generator - Create Custom Tropical Juice Recipes",
    description:
      "Generate personalized tropical juice recipes using AI. Choose from exotic fruits, vegetables, and dietary preferences for perfect healthy drinks.",
    keywords: [
      "recipe generator",
      "AI recipes",
      "custom smoothies",
      "tropical blends",
    ],
  },
  "/about": {
    title: "About Tropical AI Chef - Our Mission & Story",
    description:
      "Learn about our mission to make healthy tropical juice recipes accessible through AI technology. Discover fresh, natural ingredients and expert nutrition.",
    keywords: ["about us", "tropical fruits", "healthy living", "nutrition"],
  },
  "/benefits": {
    title: "Health Benefits of Tropical Fruits - Nutrition Guide",
    description:
      "Discover the amazing health benefits of tropical fruits and vegetables. Learn about vitamins, antioxidants, and wellness benefits of natural juices.",
    keywords: [
      "health benefits",
      "tropical fruits",
      "nutrition",
      "vitamins",
      "antioxidants",
    ],
    type: "article" as const,
  },
  "/blog": {
    title: "Tropical Juice Blog - Recipes, Tips & Health Articles",
    description:
      "Read the latest articles about tropical juice recipes, health benefits, nutrition tips, and wellness advice from our expert team.",
    keywords: ["blog", "health articles", "recipe tips", "wellness"],
  },
  "/orders": {
    title: "My Orders - Tropical AI Chef",
    description:
      "View and manage your tropical juice orders. Track delivery status and reorder your favorite AI-generated recipes.",
    keywords: ["orders", "delivery", "juice orders"],
    noIndex: true, // User-specific content
  },
};

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  author,
  publishedTime,
  modifiedTime,
  noIndex = false,
  canonical,
}) => {
  const location = useLocation();

  // Get page-specific config or defaults
  const pageConfig = PAGE_SEO_CONFIG[location.pathname] || {};
  const finalConfig = {
    ...DEFAULT_SEO,
    ...pageConfig,
    title,
    description,
    keywords,
    image,
    url,
    type,
    author,
    publishedTime,
    modifiedTime,
    noIndex,
    canonical,
  };

  const fullTitle = finalConfig.title;
  const fullDescription = finalConfig.description;
  const fullUrl = finalConfig.url || `${env.baseUrl}${location.pathname}`;
  const fullImage = finalConfig.image;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update or create meta tags
    updateMetaTag("description", fullDescription);
    updateMetaTag(
      "keywords",
      Array.isArray(finalConfig.keywords)
        ? finalConfig.keywords.join(", ")
        : finalConfig.keywords
    );
    updateMetaTag("author", finalConfig.author);

    // Open Graph tags
    updateMetaProperty("og:title", fullTitle);
    updateMetaProperty("og:description", fullDescription);
    updateMetaProperty("og:type", finalConfig.type);
    updateMetaProperty("og:url", fullUrl);
    updateMetaProperty("og:image", fullImage);
    updateMetaProperty("og:site_name", "Tropical AI Chef");

    // Twitter Card tags
    updateMetaName("twitter:card", "summary_large_image");
    updateMetaName("twitter:title", fullTitle);
    updateMetaName("twitter:description", fullDescription);
    updateMetaName("twitter:image", fullImage);
    updateMetaName("twitter:creator", "@tropicalai");

    // Article-specific tags
    if (finalConfig.type === "article") {
      if (publishedTime)
        updateMetaProperty("article:published_time", publishedTime);
      if (modifiedTime)
        updateMetaProperty("article:modified_time", modifiedTime);
      if (finalConfig.author)
        updateMetaProperty("article:author", finalConfig.author);
    }

    // Robots meta tag
    if (noIndex) {
      updateMetaName("robots", "noindex, nofollow");
    } else {
      updateMetaName("robots", "index, follow");
    }

    // Canonical URL
    updateCanonicalLink(canonical || fullUrl);

    // Additional SEO meta tags
    updateMetaName("theme-color", "#FF6B35"); // Primary brand color
    updateMetaName("apple-mobile-web-app-capable", "yes");
    updateMetaName("apple-mobile-web-app-status-bar-style", "default");
    updateMetaName("apple-mobile-web-app-title", "Tropical AI Chef");
  }, [
    fullTitle,
    fullDescription,
    fullUrl,
    fullImage,
    finalConfig,
    publishedTime,
    modifiedTime,
    noIndex,
    canonical,
  ]);

  return null; // This component doesn't render anything
};

// Utility functions
const updateMetaTag = (name: string, content: string) => {
  let element = document.querySelector(
    `meta[name="${name}"]`
  ) as HTMLMetaElement;
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("name", name);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
};

const updateMetaProperty = (property: string, content: string) => {
  let element = document.querySelector(
    `meta[property="${property}"]`
  ) as HTMLMetaElement;
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("property", property);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
};

const updateMetaName = (name: string, content: string) => {
  let element = document.querySelector(
    `meta[name="${name}"]`
  ) as HTMLMetaElement;
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("name", name);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
};

const updateCanonicalLink = (href: string) => {
  let element = document.querySelector(
    'link[rel="canonical"]'
  ) as HTMLLinkElement;
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
};

// Structured Data Component
export const StructuredData: React.FC<StructuredDataProps> = ({
  type,
  data,
}) => {
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

  return null;
};

// Preload important resources
export const PreloadResources: React.FC = () => {
  useEffect(() => {
    // Preload critical fonts
    const fontLinks = [
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
    ];

    fontLinks.forEach((href) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "style";
      link.href = href;
      link.onload = () => {
        link.onload = null;
        link.rel = "stylesheet";
      };
      document.head.appendChild(link);
    });

    // Preload critical images
    const criticalImages = [
      `${env.baseUrl}/og-image.jpg`,
      `${env.baseUrl}/favicon.ico`,
    ];

    criticalImages.forEach((src) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      document.head.appendChild(link);
    });
  }, []);

  return null;
};

export default SEO;
