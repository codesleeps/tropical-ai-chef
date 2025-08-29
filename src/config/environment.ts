// Environment Configuration
// Centralized environment variable management with validation

interface EnvironmentConfig {
  // App Information
  appName: string;
  appVersion: string;
  environment: "development" | "production" | "test";

  // API Keys (Optional)
  openaiApiKey?: string;
  huggingfaceApiKey?: string;

  // Feature Flags
  enableAnalytics: boolean;
  enableErrorTracking: boolean;

  // API Configuration
  apiTimeout: number;
  maxRecipesPerSession: number;

  // URLs
  baseUrl: string;
  productionUrl?: string;

  // Analytics
  gaTrackingId?: string;
}

// Get environment variable with fallback
function getEnvVar(key: string, fallback: string = ""): string {
  return import.meta.env[key] || fallback;
}

// Get boolean environment variable
function getBooleanEnvVar(key: string, fallback: boolean = false): boolean {
  const value = import.meta.env[key];
  if (value === undefined) return fallback;
  return value === "true" || value === "1";
}

// Get number environment variable
function getNumberEnvVar(key: string, fallback: number): number {
  const value = import.meta.env[key];
  if (value === undefined) return fallback;
  const num = parseInt(value, 10);
  return isNaN(num) ? fallback : num;
}

// Environment configuration
export const env: EnvironmentConfig = {
  // App Information
  appName: getEnvVar("VITE_APP_NAME", "Tropical AI Chef"),
  appVersion: getEnvVar("VITE_APP_VERSION", "1.0.0"),
  environment: getEnvVar("VITE_APP_ENVIRONMENT", "development") as
    | "development"
    | "production"
    | "test",

  // API Keys (Optional)
  openaiApiKey: getEnvVar("VITE_OPENAI_API_KEY"),
  huggingfaceApiKey: getEnvVar("VITE_HUGGINGFACE_API_KEY"),

  // Feature Flags
  enableAnalytics: getBooleanEnvVar("VITE_ENABLE_ANALYTICS", false),
  enableErrorTracking: getBooleanEnvVar("VITE_ENABLE_ERROR_TRACKING", false),

  // API Configuration
  apiTimeout: getNumberEnvVar("VITE_API_TIMEOUT", 30000),
  maxRecipesPerSession: getNumberEnvVar("VITE_MAX_RECIPES_PER_SESSION", 50),

  // URLs
  baseUrl: getEnvVar("VITE_BASE_URL", "http://localhost:5173"),
  productionUrl: getEnvVar("VITE_PRODUCTION_URL"),

  // Analytics
  gaTrackingId: getEnvVar("VITE_GA_TRACKING_ID"),
};

// Validation helpers
export const isProduction = () => env.environment === "production";
export const isDevelopment = () => env.environment === "development";
export const isTest = () => env.environment === "test";

// API Key validation
export const hasOpenAIKey = () =>
  !!env.openaiApiKey && env.openaiApiKey.length > 0;
export const hasHuggingFaceKey = () =>
  !!env.huggingfaceApiKey && env.huggingfaceApiKey.length > 0;

// Feature flags
export const shouldEnableAnalytics = () =>
  env.enableAnalytics && isProduction();
export const shouldEnableErrorTracking = () =>
  env.enableErrorTracking && isProduction();

// Security helpers
export const sanitizeApiKey = (key: string): string => {
  if (!key) return "";
  return key.length > 8
    ? `${key.substring(0, 4)}...${key.substring(key.length - 4)}`
    : "***";
};

// Debug helper (only in development)
export const logEnvironmentInfo = () => {
  if (isDevelopment()) {
    console.log("🌴 Tropical AI Chef Environment Info:", {
      environment: env.environment,
      appName: env.appName,
      appVersion: env.appVersion,
      hasOpenAIKey: hasOpenAIKey(),
      hasHuggingFaceKey: hasHuggingFaceKey(),
      enableAnalytics: env.enableAnalytics,
      enableErrorTracking: env.enableErrorTracking,
      baseUrl: env.baseUrl,
    });
  }
};

export default env;
