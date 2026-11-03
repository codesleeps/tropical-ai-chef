import { describe, it, expect } from "vitest";
import {
  normalizeIngredient,
  matchPantry,
  pantryToRequestFields,
  buildPantryRecipeMarkdown,
  type PantryMatch,
} from "@/utils/pantryMatch";
import { FEATURED_RECIPES } from "@/data/recipeCatalog";

describe("normalizeIngredient", () => {
  it("lowercases, trims and collapses separators", () => {
    expect(normalizeIngredient("  Dragon_Fruit ")).toBe("dragon fruit");
    expect(normalizeIngredient("Coconut-Water")).toBe("coconut water");
  });

  it("resolves plural and spelling variants", () => {
    expect(normalizeIngredient("Blueberries")).toBe("blueberry");
    expect(normalizeIngredient("Strawberries")).toBe("strawberry");
  });
});

describe("matchPantry", () => {
  it("marks a recipe ready when every ingredient is in the pantry", () => {
    const results = matchPantry(["Mango", "Pineapple", "Coconut"]);
    const paradise = results.find(
      (r) => r.recipe.name === "Tropical Paradise Smoothie"
    ) as PantryMatch;
    expect(paradise.ready).toBe(true);
    expect(paradise.missing).toEqual([]);
    expect(paradise.matchPct).toBe(100);
  });

  it("is case- and plural-insensitive against the catalog", () => {
    // Catalog says "Blueberry"; the user's chip is "Blueberries".
    const [top] = matchPantry(["blueberries", "mango", "strawberry"]);
    expect(top.recipe.name).toBe("Berry Tropical Fusion");
    expect(top.ready).toBe(true);
  });

  it("reports what is missing on a near miss", () => {
    const results = matchPantry(["Mango", "Banana"]);
    const bliss = results.find(
      (r) => r.recipe.name === "Mango Banana Bliss"
    ) as PantryMatch;
    expect(bliss.ready).toBe(false);
    expect(bliss.missing).toEqual(["Almond Milk"]);
    expect(bliss.matchPct).toBe(67);
  });

  it("ranks ready recipes above near misses, then by fewest missing", () => {
    const results = matchPantry(["Mango", "Banana", "Pineapple", "Coconut"]);
    const firstReady = results.findIndex((r) => !r.ready);
    const lastReady = results
      .map((r) => r.ready)
      .lastIndexOf(true);
    // every ready entry sits before every non-ready entry
    expect(lastReady).toBeLessThan(firstReady);
    // among non-ready, missing counts are non-decreasing
    const missingCounts = results
      .filter((r) => !r.ready)
      .map((r) => r.missing.length);
    expect([...missingCounts].sort((a, b) => a - b)).toEqual(missingCounts);
  });

  it("returns nothing ready for an empty pantry", () => {
    const results = matchPantry([]);
    expect(results).toHaveLength(FEATURED_RECIPES.length);
    expect(results.every((r) => !r.ready)).toBe(true);
    expect(results.every((r) => r.matchPct === 0)).toBe(true);
  });
});

describe("pantryToRequestFields", () => {
  it("splits vegetables out and keeps fruit + staples in the fruit field", () => {
    const { fruits, vegetables } = pantryToRequestFields([
      "Mango",
      "Spinach",
      "Ginger",
      "Coconut Water",
    ]);
    expect(vegetables).toBe("Spinach, Ginger");
    expect(fruits).toEqual(["Mango", "Coconut Water"]);
  });
});

describe("buildPantryRecipeMarkdown", () => {
  it("produces a parseable recipe containing every ingredient", () => {
    const [top] = matchPantry(["Mango", "Pineapple", "Coconut"]);
    const md = buildPantryRecipeMarkdown(top);
    expect(md).toContain("## Ingredients:");
    expect(md).toContain("## Instructions:");
    expect(md).toContain("Mango");
    expect(md).toContain("Pineapple");
    expect(md).toContain("100% of this recipe");
  });

  it("lists missing items as optional when asked", () => {
    const [top] = matchPantry(["Mango", "Banana"]);
    const match = top.recipe.name === "Mango Banana Bliss" ? top : null;
    expect(match).not.toBeNull();
    const md = buildPantryRecipeMarkdown(match as PantryMatch, {
      useMissingAsOptional: true,
    });
    expect(md).toContain("Optional (not in your pantry yet)");
    expect(md).toContain("Almond Milk");
  });
});