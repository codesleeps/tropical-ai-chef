import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, userEvent, waitFor } from "@/test/test-utils";
import { PantryMode } from "@/components/PantryMode";

vi.mock("@/utils/chefAi", () => ({
  CHEF_AI_URL: "http://test.local/functions/v1/chef-ai",
  isChefAiConfigured: vi.fn(() => false),
  chefAiRecipe: vi.fn(),
  chefAiChat: vi.fn(),
}));

const chip = (name: string) =>
  screen.getByRole("button", { name: new RegExp(`${name}$`, "i") });

describe("PantryMode", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("renders the pantry chips", () => {
    render(<PantryMode onRecipeGenerated={vi.fn()} />);
    expect(chip("Mango")).toBeInTheDocument();
    expect(chip("Coconut Water")).toBeInTheDocument();
  });

  it("accumulates multiple rapid chips instead of overwriting (regression)", async () => {
    const user = userEvent.setup();
    render(<PantryMode onRecipeGenerated={vi.fn()} />);

    await user.click(chip("Mango"));
    await user.click(chip("Pineapple"));
    await user.click(chip("Coconut"));

    expect(chip("Mango")).toHaveAttribute("aria-pressed", "true");
    expect(chip("Pineapple")).toHaveAttribute("aria-pressed", "true");
    expect(chip("Coconut")).toHaveAttribute("aria-pressed", "true");
  });

  it("reports how many recipes are makeable right now", async () => {
    const user = userEvent.setup();
    render(<PantryMode onRecipeGenerated={vi.fn()} />);

    await user.click(chip("Mango"));
    await user.click(chip("Pineapple"));
    await user.click(chip("Coconut"));

    await waitFor(() => {
      expect(
        screen.getByText(/you can make 1 recipe right now/i)
      ).toBeInTheDocument();
    });
  });

  it("generates a recipe from the pantry when Make it is clicked", async () => {
    const onRecipeGenerated = vi.fn();
    const user = userEvent.setup();
    render(<PantryMode onRecipeGenerated={onRecipeGenerated} />);

    await user.click(chip("Mango"));
    await user.click(chip("Pineapple"));
    await user.click(chip("Coconut"));

    await waitFor(() =>
      expect(screen.getByText(/ready now/i)).toBeInTheDocument()
    );
    await user.click(screen.getAllByRole("button", { name: /make it/i })[0]);

    expect(onRecipeGenerated).toHaveBeenCalledTimes(1);
    const md = onRecipeGenerated.mock.calls[0][0] as string;
    expect(md).toContain("Tropical Paradise Smoothie");
    expect(md).toContain("## Ingredients:");
  });

  it("persists the pantry to localStorage and restores it", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<PantryMode onRecipeGenerated={vi.fn()} />);
    await user.click(chip("Papaya"));
    expect(JSON.parse(localStorage.getItem("tropical_pantry") || "[]")).toContain(
      "Papaya"
    );
    unmount();

    render(<PantryMode onRecipeGenerated={vi.fn()} />);
    expect(chip("Papaya")).toHaveAttribute("aria-pressed", "true");
  });

  it("clears the pantry", async () => {
    const user = userEvent.setup();
    render(<PantryMode onRecipeGenerated={vi.fn()} />);
    await user.click(chip("Mango"));
    await user.click(screen.getByRole("button", { name: /clear/i }));
    expect(chip("Mango")).toHaveAttribute("aria-pressed", "false");
  });
});