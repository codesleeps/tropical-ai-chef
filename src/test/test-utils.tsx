import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { TooltipProvider } from "@/components/ui/tooltip";

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>{children}</BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

// Mock data generators
export const createMockRecipe = () => ({
  name: "Test Tropical Smoothie",
  ingredients: ["Mango", "Pineapple", "Coconut Water"],
  instructions: ["Blend all ingredients", "Serve chilled"],
  nutritionalInfo: {
    calories: 150,
    vitamins: ["Vitamin C", "Vitamin A"],
    minerals: ["Potassium", "Magnesium"],
  },
  healthBenefits: ["Immune support", "Hydration"],
  preparationTime: "5 minutes",
  servings: 2,
});

export const createMockUser = () => ({
  preferences: {
    dietaryRestrictions: ["vegetarian"],
    favoriteIngredients: ["mango", "pineapple"],
    dislikedIngredients: ["ginger"],
  },
});

// Accessibility testing helper
export const axeRender = async (ui: ReactElement) => {
  const { container } = customRender(ui);
  const { axe } = await import("jest-axe");
  const results = await axe(container);
  return { container, results };
};

// Mock environment variables for testing
export const mockEnv = {
  appName: "Tropical AI Chef Test",
  appVersion: "1.0.0-test",
  environment: "test" as const,
  enableAnalytics: false,
  enableErrorTracking: false,
  apiTimeout: 5000,
  maxRecipesPerSession: 10,
  baseURL: "http://localhost:3000",
  productionURL: "https://test.example.com",
};

// Mock API responses
export const mockApiResponses = {
  recipeGeneration: {
    success: {
      recipe: createMockRecipe(),
      status: "success",
      executionTime: 1200,
    },
    error: {
      error: "Failed to generate recipe",
      status: "error",
      code: "GENERATION_FAILED",
    },
  },
  healthBenefits: {
    success: {
      benefits: [
        "Rich in Vitamin C",
        "Supports immune system",
        "Natural hydration",
      ],
      ingredients: ["mango", "pineapple"],
    },
  },
};

// Test performance helper
export const measureRenderTime = async (renderFn: () => void) => {
  const start = performance.now();
  renderFn();
  const end = performance.now();
  return end - start;
};

// Form testing helpers
export const fillForm = async (
  user: any,
  form: HTMLElement,
  data: Record<string, string>
) => {
  for (const [fieldName, value] of Object.entries(data)) {
    const field = form.querySelector(
      `[name="${fieldName}"]`
    ) as HTMLInputElement;
    if (field) {
      await user.clear(field);
      await user.type(field, value);
    }
  }
};

export const submitForm = async (user: any, form: HTMLElement) => {
  const submitButton = form.querySelector(
    '[type="submit"]'
  ) as HTMLButtonElement;
  if (submitButton) {
    await user.click(submitButton);
  }
};

// Re-export everything from testing library
export * from "@testing-library/react";
export { customRender as render };
export { default as userEvent } from "@testing-library/user-event";
