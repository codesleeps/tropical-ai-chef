// Pantry Mode matching engine.
// Pure, offline, zero-dependency: given what a user says they have at home,
// score every catalog recipe by how much of it they can already make.

import {
  FEATURED_RECIPES,
  PANTRY_INGREDIENTS,
  type CatalogRecipe,
} from "@/data/recipeCatalog";

// Singular/plural and spelling variants that would otherwise fail an exact match.
const INGREDIENT_ALIASES: Record<string, string> = {
  blueberries: "blueberry",
  strawberries: "strawberry",
  raspberries: "raspberry",
  cherry: "cherries",
  "greek yogurt": "yogurt",
  "soya milk": "oat milk",
  "soy milk": "oat milk",
  "coconut milk": "coconut",
  "agave": "honey",
  "agave nectar": "honey",
};

/** Lowercase, trim, collapse whitespace, then resolve known aliases. */
export function normalizeIngredient(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return INGREDIENT_ALIASES[base] ?? base;
}

export interface PantryMatch {
  recipe: CatalogRecipe;
  have: string[];
  missing: string[];
  /** 0-100, share of the recipe's ingredients the pantry covers. */
  matchPct: number;
  /** True when nothing is missing - the recipe can be made right now. */
  ready: boolean;
}

/**
 * Rank catalog recipes against a pantry. Ready-to-make recipes come first,
 * then the closest near-misses (fewest missing, highest coverage, best rated).
 */
export function matchPantry(
  pantry: string[],
  catalog: CatalogRecipe[] = FEATURED_RECIPES
): PantryMatch[] {
  const have = new Set(pantry.map(normalizeIngredient).filter(Boolean));

  return catalog
    .map((recipe) => {
      const ingredients = recipe.fruits.map(normalizeIngredient);
      const haveList: string[] = [];
      const missingList: string[] = [];

      recipe.fruits.forEach((original, i) => {
        (have.has(ingredients[i]) ? haveList : missingList).push(original);
      });

      const matchPct =
        ingredients.length === 0
          ? 0
          : Math.round((haveList.length / ingredients.length) * 100);

      return {
        recipe,
        have: haveList,
        missing: missingList,
        matchPct,
        ready: missingList.length === 0,
      };
    })
    .sort((a, b) => {
      if (a.ready !== b.ready) return a.ready ? -1 : 1;
      if (a.missing.length !== b.missing.length)
        return a.missing.length - b.missing.length;
      if (b.matchPct !== a.matchPct) return b.matchPct - a.matchPct;
      return b.recipe.rating - a.recipe.rating;
    });
}

/** The ingredients of a match that the user actually has, in catalog order. */
export function availableIngredients(match: PantryMatch): string[] {
  return match.have;
}

/** Split pantry names into the fruit / vegetable fields the AI prompt expects. */
export function pantryToRequestFields(pantry: string[]): {
  fruits: string[];
  vegetables: string;
} {
  const byName = new Map(
    PANTRY_INGREDIENTS.map((p) => [normalizeIngredient(p.name), p])
  );

  const fruits: string[] = [];
  const vegetables: string[] = [];

  pantry.forEach((name) => {
    const known = byName.get(normalizeIngredient(name));
    if (known?.group === "veg") vegetables.push(name);
    // Staples ride along as fruits for the prompt; liquids/ice are not "fruit"
    // but the AI treats them as additions, so they are harmless there.
    else fruits.push(name);
  });

  return { fruits, vegetables: vegetables.join(", ") };
}

/** Deterministic, offline markdown for a matched recipe - no AI required. */
export function buildPantryRecipeMarkdown(
  match: PantryMatch,
  options: { useMissingAsOptional?: boolean } = {}
): string {
  const { recipe } = match;
  const useMissingAsOptional = options.useMissingAsOptional ?? false;

  const quantityFor = (ing: string) => {
    const n = normalizeIngredient(ing);
    if (n === "ice") return "- A handful of ice cubes";
    if (n === "water" || n === "coconut water") return `- 1 cup ${ing}`;
    if (n === "almond milk" || n === "oat milk" || n === "yogurt")
      return `- 1 cup ${ing}`;
    if (n === "honey" || n === "vanilla" || n === "acai")
      return `- 1 tablespoon ${ing}`;
    return `- 1.5 cups fresh ${ing}, chopped`;
  };

  const ingredientLines = recipe.fruits.map(quantityFor).join("\n");
  const optionalLines =
    useMissingAsOptional && match.missing.length > 0
      ? `\n\n**Optional (not in your pantry yet)**\n${match.missing
          .map((m) => `- ${m}`)
          .join("\n")}`
      : "";

  const fruitList = recipe.fruits.join(", ");

  return `# ${recipe.name} ${recipe.emoji}

## Ingredients:
${ingredientLines}${optionalLines}

## Instructions:
1. Wash and prepare all ingredients: ${fruitList}.
2. Add everything to your blender, liquid base first.
3. Blend on high speed for 60 seconds until smooth and creamy.
4. Pour into a tall chilled glass and serve immediately.

## Nutritional Benefits:
- Made entirely from ingredients already in your pantry.
- Hydrating and refreshing, packed with raw vitamins and antioxidants from ${fruitList}.
- Rich in dietary fiber with no added refined sugar.

## Tips:
- Best consumed within 15 minutes of blending for maximum nutrition.
- Pre-freeze your fruit for an extra-cold, thicker texture.
- Taste and adjust: a squeeze of lime or extra honey balances the blend.
- Made with Pantry Mode - ${match.matchPct}% of this recipe was already in your kitchen.

## Prep Time: ${recipe.time}
## Servings: 2 servings`;
}