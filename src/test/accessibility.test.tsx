import { describe, it, expect } from "vitest";
import { axeRender } from "@/test/test-utils";
import { Navigation } from "@/components/Navigation";
import { RecipeGenerator } from "@/components/RecipeGenerator";
import Footer from "@/components/Footer";
import Index from "@/pages/Index";

describe("Accessibility Tests", () => {
  describe("Navigation Component", () => {
    it("has no accessibility violations", async () => {
      const { results } = await axeRender(<Navigation />);
      expect(results).toHaveNoViolations();
    });
  });

  describe("RecipeGenerator Component", () => {
    it("has no accessibility violations", async () => {
      const mockOnRecipeGenerated = () => {};
      const { results } = await axeRender(
        <RecipeGenerator onRecipeGenerated={mockOnRecipeGenerated} />
      );
      expect(results).toHaveNoViolations();
    });
  });

  describe("Footer Component", () => {
    it("has no accessibility violations", async () => {
      const { results } = await axeRender(<Footer />);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Index Page", () => {
    it("has no accessibility violations", async () => {
      const { results } = await axeRender(<Index />);
      expect(results).toHaveNoViolations();
    });
  });
});
