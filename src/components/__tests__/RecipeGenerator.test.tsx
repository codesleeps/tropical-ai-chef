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
  }),
  usePerformanceTracking: () => ({
    measureFunction: vi.fn((fn) => fn()),
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
  useSecurity: () => ({
    checkRateLimit: vi.fn(() => true),
    validateInput: vi.fn(() => ({
      isValid: true,
      sanitized: "test input",
      errors: [],
    })),
  }),
}));

describe("RecipeGenerator Component", () => {
  const mockOnRecipeGenerated = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset fetch mock
    global.fetch = vi.fn();
  });

  it("renders all form elements", () => {
    render(<RecipeGenerator onRecipeGenerated={mockOnRecipeGenerated} />);

    // Check for main headings and form elements
    expect(screen.getByText(/create your perfect/i)).toBeInTheDocument();
    expect(screen.getByText(/ai service/i)).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /ai service/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /generate recipe/i })
    ).toBeInTheDocument();
  });

  it("displays service options correctly", async () => {
    const user = userEvent.setup();
    render(<RecipeGenerator onRecipeGenerated={mockOnRecipeGenerated} />);

    // Open the service selector
    const serviceSelect = screen.getByRole("combobox", { name: /ai service/i });
    await user.click(serviceSelect);

    // Check for service options
    await waitFor(() => {
      expect(screen.getByText(/local browser ai/i)).toBeInTheDocument();
      expect(screen.getByText(/openai gpt/i)).toBeInTheDocument();
      expect(screen.getByText(/hugging face/i)).toBeInTheDocument();
    });
  });

  it("shows ingredient checkboxes", () => {
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
      "Lime",
    ];

    expectedIngredients.forEach((ingredient) => {
      expect(screen.getByText(ingredient)).toBeInTheDocument();
    });
  });

  it("allows selecting multiple ingredients", async () => {
    const user = userEvent.setup();
    render(<RecipeGenerator onRecipeGenerated={mockOnRecipeGenerated} />);

    // Select multiple ingredients
    const mangoCheckbox = screen.getByLabelText(/mango/i);
    const pineappleCheckbox = screen.getByLabelText(/pineapple/i);

    await user.click(mangoCheckbox);
    await user.click(pineappleCheckbox);

    expect(mangoCheckbox).toBeChecked();
    expect(pineappleCheckbox).toBeChecked();
  });

  it("shows dietary preference options", () => {
    render(<RecipeGenerator onRecipeGenerated={mockOnRecipeGenerated} />);

    const dietaryOptions = [
      "Regular",
      "Low Sugar",
      "High Protein",
      "Detox",
      "Energy Boost",
      "Immunity",
    ];

    dietaryOptions.forEach((option) => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  it("handles recipe generation successfully", async () => {
    const user = userEvent.setup();
    const mockRecipe = createMockRecipe();

    // Mock successful API response
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        recipe: mockRecipe,
        status: "success",
      }),
    });

    render(<RecipeGenerator onRecipeGenerated={mockOnRecipeGenerated} />);

    // Select ingredients and generate
    const mangoCheckbox = screen.getByLabelText(/mango/i);
    await user.click(mangoCheckbox);

    const generateButton = screen.getByRole("button", {
      name: /generate recipe/i,
    });
    await user.click(generateButton);

    // Should show loading state
    expect(screen.getByText(/creating your recipe/i)).toBeInTheDocument();

    // Wait for recipe to be generated
    await waitFor(() => {
      expect(mockOnRecipeGenerated).toHaveBeenCalledWith(
        expect.stringContaining("Test Tropical Smoothie")
      );
    });
  });

  it("handles recipe generation errors", async () => {
    const user = userEvent.setup();

    // Mock failed API response
    global.fetch = vi.fn().mockRejectedValueOnce(new Error("API Error"));

    render(<RecipeGenerator onRecipeGenerated={mockOnRecipeGenerated} />);

    // Select ingredients and generate
    const mangoCheckbox = screen.getByLabelText(/mango/i);
    await user.click(mangoCheckbox);

    const generateButton = screen.getByRole("button", {
      name: /generate recipe/i,
    });
    await user.click(generateButton);

    // Should show error message
    await waitFor(() => {
      expect(
        screen.getByText(/failed to generate recipe/i)
      ).toBeInTheDocument();
    });
  });

  it("validates minimum ingredient selection", async () => {
    const user = userEvent.setup();
    render(<RecipeGenerator onRecipeGenerated={mockOnRecipeGenerated} />);

    // Try to generate without selecting ingredients
    const generateButton = screen.getByRole("button", {
      name: /generate recipe/i,
    });
    await user.click(generateButton);

    // Should show validation message
    expect(screen.getByText(/please select at least/i)).toBeInTheDocument();
  });

  it("shows cost information", () => {
    render(<RecipeGenerator onRecipeGenerated={mockOnRecipeGenerated} />);

    // Should display cost information for different services
    expect(screen.getByText(/estimated cost/i)).toBeInTheDocument();
    expect(screen.getByText(/\\$0\\.00/)).toBeInTheDocument(); // Free option
  });

  it("displays advanced options when enabled", async () => {
    const user = userEvent.setup();
    render(<RecipeGenerator onRecipeGenerated={mockOnRecipeGenerated} />);

    // Look for advanced options toggle
    const advancedToggle = screen.getByText(/advanced options/i);
    await user.click(advancedToggle);

    // Should show additional options
    await waitFor(() => {
      expect(screen.getByText(/servings/i)).toBeInTheDocument();
      expect(screen.getByText(/preparation time/i)).toBeInTheDocument();
    });
  });

  it("has no accessibility violations", async () => {
    const { results } = await axeRender(
      <RecipeGenerator onRecipeGenerated={mockOnRecipeGenerated} />
    );
    expect(results).toHaveNoViolations();
  });

  it("handles keyboard navigation properly", async () => {
    const user = userEvent.setup();
    render(<RecipeGenerator onRecipeGenerated={mockOnRecipeGenerated} />);

    // Tab through interactive elements
    await user.tab();
    expect(screen.getByRole("combobox", { name: /ai service/i })).toHaveFocus();

    await user.tab();
    // Should focus on first ingredient checkbox
    expect(screen.getByLabelText(/mango/i)).toHaveFocus();
  });

  it("maintains responsive layout", () => {
    render(<RecipeGenerator onRecipeGenerated={mockOnRecipeGenerated} />);

    // Check for responsive grid classes
    const ingredientGrid =
      screen.getByTestId("ingredients-grid") ||
      screen.getByText(/mango/i).closest(".grid");

    if (ingredientGrid) {
      expect(ingredientGrid).toHaveClass(/grid/);
    }
  });
});
