import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  userEvent,
  waitFor,
  axeRender,
  createMockRecipe,
} from "@/test/test-utils";
import { RecipeGenerator } from "../RecipeGenerator";

// Mock the hooks and utilities
vi.mock("@/hooks/use-analytics", () => ({
  useAnalytics: () => ({
    trackEvent: vi.fn(),
    trackTiming: vi.fn(),
    trackRecipeGeneration: vi.fn(),
    trackEngagement: vi.fn(),
  }),
  usePerformanceTracking: () => ({
    measureFunction: vi.fn((name, fn) => fn()),
  }),
  useErrorTracking: () => ({
    trackError: vi.fn(),
  }),
}));

vi.mock("@/utils/security", () => ({
  InputValidator: {
    validateRecipeInput: vi.fn(() => ({
      isValid: true,
      sanitized: "test input",
      errors: [],
    })),
  },
}));

vi.mock("@/hooks/use-security", () => ({
  useSecureForm: () => ({
    validateField: vi.fn(() => true),
    handleSecureSubmit: vi.fn((fn) => fn()), // execute the submit callback!
    formErrors: {},
    checkRateLimit: vi.fn(() => true),
    getSecurityStatus: vi.fn(() => ({})),
  }),
}));

describe("RecipeGenerator Component", () => {
  const mockOnRecipeGenerated = vi.fn();

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

  it("renders all form elements", () => {
    render(<RecipeGenerator onRecipeGenerated={mockOnRecipeGenerated} />);

    // Check for main headings and form elements
    expect(screen.getByText("AI Recipe Generator")).toBeInTheDocument();
    expect(screen.getByText("AI Service")).toBeInTheDocument();
    expect(screen.getByText("Ingredients")).toBeInTheDocument();
  });

  it("displays service options correctly", () => {
    render(<RecipeGenerator onRecipeGenerated={mockOnRecipeGenerated} />);

    // Check for service badges (we use getAllByText since the label/loader/badge may contain matching text)
    expect(screen.getAllByText(/Local AI/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Custom API/i).length).toBeGreaterThanOrEqual(1);
  });

  it("shows ingredient options", () => {
    render(<RecipeGenerator onRecipeGenerated={mockOnRecipeGenerated} />);

    // Should show popular tropical ingredients
    const expectedIngredients = [
      "Mango",
      "Pineapple",
      "Passion Fruit",
      "Dragon Fruit",
      "Coconut",
      "Papaya",
      "Kiwi",
    ];

    expectedIngredients.forEach((ingredient) => {
      expect(screen.getByText(ingredient)).toBeInTheDocument();
    });
  });

  it("allows selecting multiple ingredients and styles", async () => {
    const user = userEvent.setup();
    render(<RecipeGenerator onRecipeGenerated={mockOnRecipeGenerated} />);

    // Click mango and pineapple cards
    const mangoCard = screen.getByText("Mango");
    const pineappleCard = screen.getByText("Pineapple");

    await user.click(mangoCard);
    await user.click(pineappleCard);

    // Open style select and click Smoothie
    const styleSelect = screen.getByRole("combobox", { name: /Juice Style/i });
    await user.click(styleSelect);
    const smoothieOption = screen.getByRole("option", { name: "Smoothie" });
    await user.click(smoothieOption);

    // Verify generate button is enabled
    const generateButton = screen.getByRole("button", {
      name: /Generate My Perfect Recipe/i,
    });
    expect(generateButton).toBeEnabled();
  });

  it("handles recipe generation successfully with Local AI", async () => {
    const user = userEvent.setup();
    render(<RecipeGenerator onRecipeGenerated={mockOnRecipeGenerated} />);

    // Select ingredients and style
    const mangoCard = screen.getByText("Mango");
    await user.click(mangoCard);

    // Open style select and click Smoothie
    const styleSelect = screen.getByRole("combobox", { name: /Juice Style/i });
    await user.click(styleSelect);
    const smoothieOption = screen.getByRole("option", { name: "Smoothie" });
    await user.click(smoothieOption);

    const generateButton = screen.getByRole("button", {
      name: /Generate My Perfect Recipe/i,
    });
    await user.click(generateButton);

    // Wait for recipe to be generated
    await waitFor(() => {
      expect(mockOnRecipeGenerated).toHaveBeenCalled();
    });
  });

  it("shows Custom AI configuration fields when selected", async () => {
    const user = userEvent.setup();
    render(<RecipeGenerator onRecipeGenerated={mockOnRecipeGenerated} />);

    const customBadge = screen.getAllByText(/Custom API/i)[0];
    await user.click(customBadge);

    expect(screen.getByLabelText(/API Base URL/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/API Key/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Model Name/i)).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { results } = await axeRender(
      <RecipeGenerator onRecipeGenerated={mockOnRecipeGenerated} />
    );
    expect(results).toHaveNoViolations();
  });
});
