import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  userEvent,
  waitFor,
  createMockRecipe,
} from "@/test/test-utils";
import App from "@/App";

// Mock environment and utilities
vi.mock("@/config/environment", () => ({
  env: { appName: "Test", environment: "test", enableAnalytics: false },
  logEnvironmentInfo: vi.fn(),
}));

vi.mock("@/hooks/use-analytics", () => ({
  useAnalytics: () => ({ trackEvent: vi.fn() }),
}));

vi.mock("@/utils/security", () => ({
  initializeSecurity: vi.fn(),
}));

vi.mock("@/utils/performance", () => ({
  usePerformanceMonitoring: vi.fn(),
  preloadCriticalResources: vi.fn(),
  registerServiceWorker: vi.fn(),
}));

describe("Integration Tests - User Workflows", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  describe("Recipe Generation Workflow", () => {
    it("allows complete recipe generation workflow", async () => {
      const user = userEvent.setup();
      const mockRecipe = createMockRecipe();

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ recipe: mockRecipe, status: "success" }),
      });

      render(<App />);

      // Navigate to recipes page
      const recipesLink = screen.getByRole("link", {
        name: /recipe generator/i,
      });
      await user.click(recipesLink);

      await waitFor(() => {
        expect(screen.getByText(/create your perfect/i)).toBeInTheDocument();
      });

      // Select ingredients and generate
      const mangoCheckbox = screen.getByLabelText(/mango/i);
      await user.click(mangoCheckbox);

      const generateButton = screen.getByRole("button", {
        name: /generate recipe/i,
      });
      await user.click(generateButton);

      // Verify loading state and result
      expect(screen.getByText(/creating your recipe/i)).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText(/test tropical smoothie/i)).toBeInTheDocument();
      });
    });
  });

  describe("Navigation Workflow", () => {
    it("navigates between main pages successfully", async () => {
      const user = userEvent.setup();
      render(<App />);

      // Test navigation flow
      const aboutLink = screen.getByRole("link", { name: /about/i });
      await user.click(aboutLink);

      await waitFor(() => {
        expect(screen.getByText(/about fresh tropical/i)).toBeInTheDocument();
      });
    });
  });

  describe("Error Handling", () => {
    it("shows 404 for invalid routes", async () => {
      render(<App />);

      window.history.pushState({}, "Test", "/invalid-route");

      await waitFor(() => {
        expect(screen.getByText(/page not found/i)).toBeInTheDocument();
      });
    });
  });
});
