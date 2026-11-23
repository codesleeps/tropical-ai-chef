import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  userEvent,
  waitFor,
  axeRender,
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

/**
 * The redesigned RecipeGenerator is a 3-step wizard:
 *   1 Pick fruit  ->  2 Tailor it  ->  3 Generate
 * AI-provider controls live inside the "Advanced settings" dialog.
 */
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

  it("renders the guided wizard shell (step 1 + advanced trigger)", () => {
    render(<RecipeGenerator onRecipeGenerated={mockOnRecipeGenerated} />);

    // Main heading + first step
    expect(screen.getByText("AI Recipe Generator")).toBeInTheDocument();
    expect(screen.getByText("Pick your fruit")).toBeInTheDocument();

    // Advanced settings entry point is present...
    expect(
      screen.getByRole("button", { name: /advanced settings/i })
    ).toBeInTheDocument();

    // ...but the AI-provider controls are NOT in the main flow.
    expect(screen.queryByText("AI Service")).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/API Base URL/i)).not.toBeInTheDocument();
  });

  it("keeps AI service + provider config behind the Advanced settings dialog", async () => {
    const user = userEvent.setup();
    render(<RecipeGenerator onRecipeGenerated={mockOnRecipeGenerated} />);

    await user.click(
      screen.getByRole("button", { name: /advanced settings/i })
    );

    // Now the service picker is visible (label + badges)
    expect(await screen.findByText("AI Service")).toBeInTheDocument();
    expect(screen.getAllByText(/Local AI/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Custom API/i).length).toBeGreaterThanOrEqual(1);
  });

  it("shows ingredient options on the first step", () => {
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

  it("allows selecting multiple ingredients and styles, then reaching Generate", async () => {
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

    // Advance through the wizard: step 1 -> 2 -> 3
    await user.click(screen.getByRole("button", { name: /next: tailor it/i }));
    expect(screen.getByRole("heading", { name: "Tailor it" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /next: generate/i }));

    // Verify generate button is enabled
    const generateButton = screen.getByRole("button", {
      name: /Generate My Perfect Recipe/i,
    });
    expect(generateButton).toBeEnabled();
  });

  it("blocks forward navigation until fruit + style are chosen", async () => {
    const user = userEvent.setup();
    render(<RecipeGenerator onRecipeGenerated={mockOnRecipeGenerated} />);

    const nextButton = screen.getByRole("button", { name: /next: tailor it/i });
    expect(nextButton).toBeDisabled();

    await user.click(screen.getByText("Mango"));
    expect(nextButton).toBeDisabled(); // still needs a style

    const styleSelect = screen.getByRole("combobox", { name: /Juice Style/i });
    await user.click(styleSelect);
    await user.click(screen.getByRole("option", { name: "Smoothie" }));

    expect(nextButton).toBeEnabled();
  });

  it("handles recipe generation successfully with Local AI", async () => {
    const user = userEvent.setup();
    render(<RecipeGenerator onRecipeGenerated={mockOnRecipeGenerated} />);

    // Select ingredients and style
    await user.click(screen.getByText("Mango"));

    const styleSelect = screen.getByRole("combobox", { name: /Juice Style/i });
    await user.click(styleSelect);
    await user.click(screen.getByRole("option", { name: "Smoothie" }));

    // Navigate to the generate step
    await user.click(screen.getByRole("button", { name: /next: tailor it/i }));
    await user.click(screen.getByRole("button", { name: /next: generate/i }));

    const generateButton = screen.getByRole("button", {
      name: /Generate My Perfect Recipe/i,
    });
    await user.click(generateButton);

    // Wait for recipe to be generated
    await waitFor(() => {
      expect(mockOnRecipeGenerated).toHaveBeenCalled();
    });
  });

  it("shows Custom AI configuration fields when selected in Advanced settings", async () => {
    const user = userEvent.setup();
    render(<RecipeGenerator onRecipeGenerated={mockOnRecipeGenerated} />);

    await user.click(
      screen.getByRole("button", { name: /advanced settings/i })
    );

    const customBadge = screen.getAllByText(/Custom API/i)[0];
    await user.click(customBadge);

    expect(screen.getByLabelText(/API Base URL/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/API Key/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Model Name/i)).toBeInTheDocument();
  });

  it("keeps optional extras collapsed until step 2 is opened", async () => {
    const user = userEvent.setup();
    render(<RecipeGenerator onRecipeGenerated={mockOnRecipeGenerated} />);

    // Add-ins are not visible on step 1
    expect(screen.queryByText(/Healthy add-ins/i)).not.toBeInTheDocument();

    await user.click(screen.getByText("Mango"));
    const styleSelect = screen.getByRole("combobox", { name: /Juice Style/i });
    await user.click(styleSelect);
    await user.click(screen.getByRole("option", { name: "Smoothie" }));

    await user.click(screen.getByRole("button", { name: /next: tailor it/i }));

    // Section headers exist on step 2, but their contents stay collapsed.
    const addInsTrigger = screen.getByRole("button", {
      name: /Healthy add-ins/i,
    });
    expect(addInsTrigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("button", { name: /Hemp Hearts/i })).not.toBeInTheDocument();

    // Expanding reveals the add-in chips, which are aria-pressed toggles.
    await user.click(addInsTrigger);
    expect(addInsTrigger).toHaveAttribute("aria-expanded", "true");

    const chip = await screen.findByRole("button", { name: /Hemp Hearts/i });
    expect(chip).toHaveAttribute("aria-pressed", "false");
    await user.click(chip);
    expect(chip).toHaveAttribute("aria-pressed", "true");
  });

  it("has no accessibility violations", async () => {
    const { results } = await axeRender(
      <RecipeGenerator onRecipeGenerated={mockOnRecipeGenerated} />
    );
    expect(results).toHaveNoViolations();
  });
});
