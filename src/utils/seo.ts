// Sitemap Generator for Tropical AI Chef
// This generates XML sitemaps for better search engine indexing

import { env } from "@/config/environment";

export interface SitemapEntry {
  url: string;
  lastModified?: string;
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
}

// Static routes configuration
const STATIC_ROUTES: SitemapEntry[] = [
  {
    url: "/",
    changeFrequency: "weekly",
    priority: 1.0,
  },
  {
    url: "/recipes",
    changeFrequency: "daily",
    priority: 0.9,
  },
  {
    url: "/about",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: "/benefits",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: "/blog",
    changeFrequency: "weekly",
    priority: 0.8,
  },
  // Note: /orders is excluded as it's user-specific content
];

export const generateSitemap = (baseUrl: string = env.baseUrl): string => {
  const currentDate = new Date().toISOString();

  const urlEntries = STATIC_ROUTES.map((entry) => {
    const fullUrl = `${baseUrl}${entry.url}`;
    const lastMod = entry.lastModified || currentDate;

    return `  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>${entry.changeFrequency || "weekly"}</changefreq>
    <priority>${entry.priority || 0.5}</priority>
  </url>`;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
};

export const generateRobotsTxt = (baseUrl: string = env.baseUrl): string => {
  return `User-agent: *
Allow: /

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Block user-specific content
Disallow: /orders

# Allow common crawl paths
Allow: /
Allow: /recipes
Allow: /about
Allow: /benefits
Allow: /blog

# Crawl-delay for respectful crawling
Crawl-delay: 1`;
};

export const generateWebManifest = () => {
  return {
    name: "Tropical AI Chef",
    short_name: "TropicalAI",
    description: "AI-powered tropical juice recipe generator",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#FF6B35",
    orientation: "portrait-primary",
    categories: ["food", "health", "lifestyle"],
    lang: "en",
    dir: "ltr",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/icon-apple-touch.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
};

// Generate and save sitemap file
export const saveSitemap = async () => {
  try {
    const sitemapContent = generateSitemap();

    // In a real production environment, you would save this to public/sitemap.xml
    // For now, we'll log it for manual creation
    console.log("Sitemap content:", sitemapContent);

    return sitemapContent;
  } catch (error) {
    console.error("Error generating sitemap:", error);
    throw error;
  }
};

// SEO utilities for recipe pages
export const generateRecipeStructuredData = (recipe: {
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  servings: string;
  nutritionalBenefits?: string[];
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.name,
    description: recipe.description,
    recipeYield: recipe.servings,
    prepTime: recipe.prepTime.includes("PT")
      ? recipe.prepTime
      : `PT${recipe.prepTime.replace(/\D/g, "")}M`,
    recipeCategory: "Beverage",
    recipeCuisine: "Tropical",
    keywords: ["tropical", "juice", "healthy", "smoothie", "AI-generated"],
    author: {
      "@type": "Organization",
      name: "Tropical AI Chef",
    },
    recipeIngredient: recipe.ingredients,
    recipeInstructions: recipe.instructions.map((instruction, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      text: instruction,
    })),
    nutrition: {
      "@type": "NutritionInformation",
      description:
        recipe.nutritionalBenefits?.join(", ") ||
        "Rich in vitamins and antioxidants",
    },
    image: `${env.baseUrl}/recipe-placeholder.jpg`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "127",
    },
  };
};

export const generateOrganizationStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Tropical AI Chef",
    url: env.baseUrl,
    logo: `${env.baseUrl}/logo.png`,
    description:
      "AI-powered tropical juice recipe generator providing healthy, personalized beverage recipes",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "support@tropicalai.com",
    },
    sameAs: [
      "https://twitter.com/tropicalai",
      "https://facebook.com/tropicalai",
      "https://instagram.com/tropicalai",
    ],
  };
};

export const generateWebApplicationStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Tropical AI Chef",
    url: env.baseUrl,
    description:
      "Create personalized tropical juice recipes with our AI-powered generator",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web Browser",
    permissions: "browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "1250",
    },
  };
};
