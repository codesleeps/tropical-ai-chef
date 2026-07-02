vi.mock("@/config/environment", async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    env: { ...actual.env, appName: "Test", environment: "test", enableAnalytics: false },
    default: { ...actual.default, appName: "Test", environment: "test", enableAnalytics: false },
    isProduction: vi.fn(() => false),
    isDevelopment: vi.fn(() => false),
    isTest: vi.fn(() => true),
    hasCustomAiConfig: vi.fn(() => false),
  };
});

vi.mock("@/hooks/use-analytics", async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    useAnalytics: () => ({ 
      trackEvent: vi.fn(),
      trackRecipeGeneration: vi.fn(),
      trackEngagement: vi.fn(),
    }),
    useAnalyticsConsent: () => ({
      consent: "undecided",
      acceptAnalytics: vi.fn(),
      declineAnalytics: vi.fn(),
    }),
  };
});

vi.mock("@/utils/security", async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    initializeSecurity: vi.fn(),
    InputValidator: {
      ...actual.InputValidator,
      validateRecipeInput: vi.fn(() => ({
        isValid: true,
        sanitized: "test input",
        errors: [],
      })),
    },
  };
});

vi.mock("@/utils/performance", () => ({
  usePerformanceMonitoring: vi.fn(),
  preloadCriticalResources: vi.fn(),
  registerServiceWorker: vi.fn(),
  usePerformanceTracking: () => ({
    measureFunction: vi.fn((name, fn) => fn()),
  }),
}));

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import {
  screen,
  userEvent,
  waitFor,
  createMockRecipe,
} from "@/test/test-utils";
import App from "@/App";

describe("Integration Tests - User Workflows", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    
    // Stub missing jsdom methods for radix-ui components
    if (typeof window !== "undefined" && window.HTMLElement) {
      window.HTMLElement.prototype.scrollIntoView = vi.fn();
      window.HTMLElement.prototype.hasPointerCapture = vi.fn(() => false);
      window.HTMLElement.prototype.setPointerCapture = vi.fn();
      window.HTMLElement.prototype.releasePointerCapture = vi.fn();
    }
  });

  describe("Recipe Generation Workflow", () => {
    it("allows complete recipe generation workflow", async () => {
      const user = userEvent.setup();
      
      // Stub global fetch mock response for recipe generator
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          choices: [
            {
              message: {
                content: "# Paradise Smoothie 🥤\n\n## Ingredients:\n- Mango\n- Coconut\n\n## Instructions:\n1. Blend it.",
              },
            },
          ],
        }),
      });

      render(<App />);

      // Navigate to recipes page (link is named "Recipe Generator")
      const recipesLinks = await screen.findAllByRole("link", {
        name: /recipe generator/i,
      }, { timeout: 2000 });
      await user.click(recipesLinks[0]);

      await waitFor(() => {
        expect(screen.getByText("Custom Recipe Creator")).toBeInTheDocument();
      }, { timeout: 2000 });

      // Select ingredients (Mango card)
      const mangoCard = screen.getAllByText("Mango")[0];
      await user.click(mangoCard);

      // Select style (open Select and choose Smoothie)
      const styleSelect = screen.getByRole("combobox", { name: /Juice Style/i });
      await user.click(styleSelect);
      const smoothieOption = screen.getByRole("option", { name: "Smoothie" });
      await user.click(smoothieOption);

      const generateButton = screen.getByRole("button", {
        name: /Generate My Perfect Recipe/i,
      });
      await user.click(generateButton);

      // Verify result displays the recipe inside the display section
      await waitFor(() => {
        const displaySection = document.getElementById("recipe-display-section");
        expect(displaySection).toBeInTheDocument();
        expect(displaySection).toHaveTextContent(/Mango/i);
      }, { timeout: 2000 });
    });
  });

  describe("Navigation Workflow", () => {
    it("navigates between main pages successfully", async () => {
      const user = userEvent.setup();
      render(<App />);

      // Test navigation flow
      const aboutLinks = await screen.findAllByRole("link", { name: /^about$/i }, { timeout: 2000 });
      await user.click(aboutLinks[0]);

      await waitFor(() => {
        expect(screen.getByText("Come Join Us")).toBeInTheDocument();
      }, { timeout: 2000 });
    });
  });

  describe("Error Handling", () => {
    it("shows 404 for invalid routes", async () => {
      window.history.pushState({}, "Test", "/invalid-route");

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/Oops! Page Not Found/i)).toBeInTheDocument();
      }, { timeout: 2000 });
    });
  });
});
