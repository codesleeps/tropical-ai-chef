import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ChefHat, Loader2, PackageOpen, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  PANTRY_GROUP_LABELS,
  PANTRY_INGREDIENTS,
  type PantryGroup,
} from "@/data/recipeCatalog";
import {
  buildPantryRecipeMarkdown,
  matchPantry,
  pantryToRequestFields,
  type PantryMatch,
} from "@/utils/pantryMatch";
import { chefAiRecipe, isChefAiConfigured } from "@/utils/chefAi";

const PANTRY_STORAGE_KEY = "tropical_pantry";

const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {
      console.warn("localStorage not available:", e);
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn("localStorage not available:", e);
    }
  },
};

const loadPantry = (): string[] => {
  const raw = safeLocalStorage.getItem(PANTRY_STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
};

const GROUPS: PantryGroup[] = ["fruit", "veg", "staple"];

interface PantryModeProps {
  onRecipeGenerated: (recipe: string) => void;
}

export const PantryMode = ({ onRecipeGenerated }: PantryModeProps) => {
  const [pantry, setPantry] = useState<string[]>(loadPantry);
  const [activeMatch, setActiveMatch] = useState<string | null>(null);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const persist = useCallback((next: string[]) => {
    setPantry(next);
    safeLocalStorage.setItem(PANTRY_STORAGE_KEY, JSON.stringify(next));
  }, []);

  const toggle = useCallback((name: string) => {
    // Functional update: rapid consecutive toggles must accumulate, not
    // overwrite each other from a stale closure (React batches in one tick).
    setPantry((prev) => {
      const next = prev.includes(name)
        ? prev.filter((n) => n !== name)
        : [...prev, name];
      safeLocalStorage.setItem(PANTRY_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const matches = useMemo(() => matchPantry(pantry), [pantry]);
  const readyCount = useMemo(
    () => matches.filter((m) => m.ready).length,
    [matches]
  );
  const oneAwayCount = useMemo(
    () => matches.filter((m) => !m.ready && m.missing.length === 1).length,
    [matches]
  );
  const visibleMatches = useMemo(
    () => (pantry.length === 0 ? matches.slice(0, 3) : matches.slice(0, 9)),
    [matches, pantry.length]
  );

  const makeIt = (match: PantryMatch) => {
    setActiveMatch(match.recipe.name);
    const md = buildPantryRecipeMarkdown(match, { useMissingAsOptional: true });
    onRecipeGenerated(md);
    toast.success(`${match.recipe.name} is ready to blend! 🥤`);
  };

  const makeItWithAi = async (match: PantryMatch) => {
    if (!isChefAiConfigured()) {
      toast.error("Chef AI is not configured - using the built-in recipe.");
      return makeIt(match);
    }
    setActiveMatch(match.recipe.name);
    setIsAiGenerating(true);
    try {
      const { fruits, vegetables } = pantryToRequestFields(match.have);
      const md = await chefAiRecipe({
        fruit: fruits[0] ?? match.recipe.fruits[0],
        fruits,
        style: match.recipe.style,
        vegetables,
      });
      onRecipeGenerated(md);
      toast.success("Chef AI wrote your pantry recipe! 🥤🌴");
    } catch (err) {
      console.warn("Pantry AI generation failed, falling back to local:", err);
      const fallback = buildPantryRecipeMarkdown(match, {
        useMissingAsOptional: true,
      });
      onRecipeGenerated(fallback);
      toast.info("Chef AI was unavailable - here's the built-in recipe.");
    } finally {
      setIsAiGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Pantry Mode
        </h3>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          Tick what you already have in your kitchen and we'll show you what you
          can make right now - no shopping trip required.
        </p>
        <p className="text-xs text-muted-foreground">
          Saved to your device · {pantry.length} ingredient
          {pantry.length === 1 ? "" : "s"} in your pantry
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <PackageOpen className="w-5 h-5 text-primary" />
              What's in your pantry?
            </CardTitle>
            {pantry.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground"
                onClick={() => {
                  persist([]);
                  setActiveMatch(null);
                }}
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Clear
              </Button>
            )}
          </div>
          <CardDescription>
            Tap an ingredient to add or remove it. Your pantry is remembered next
            visit.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {GROUPS.map((group) => {
            const items = PANTRY_INGREDIENTS.filter((i) => i.group === group);
            return (
              <div key={group} className="space-y-1.5">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {PANTRY_GROUP_LABELS[group]}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {items.map((item) => {
                    const isSelected = pantry.includes(item.name);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggle(item.name)}
                        aria-pressed={isSelected}
                        className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-all ${
                          isSelected
                            ? "border-primary bg-primary/10 font-medium text-foreground ring-1 ring-primary/40"
                            : "border-border bg-card hover:border-primary/50"
                        }`}
                      >
                        <span aria-hidden="true">{item.emoji}</span>
                        <span>{item.name}</span>
                        {isSelected && <Check className="w-3 h-3 text-primary" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {pantry.length > 0 && (
        <div className="text-center space-y-1">
          <div className="text-xl font-bold text-primary">
            {readyCount === 0
              ? "No complete matches yet"
              : `You can make ${readyCount} recipe${
                  readyCount === 1 ? "" : "s"
                } right now`}
          </div>
          {oneAwayCount > 0 && (
            <div className="text-sm text-muted-foreground">
              {oneAwayCount} more need just one extra ingredient
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleMatches.map((match) => {
          const busy = isAiGenerating && activeMatch === match.recipe.name;
          return (
            <Card
              key={match.recipe.name}
              className={`border-2 transition-all ${
                match.ready ? "border-primary/50 shadow-tropical" : "border-border"
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant={match.ready ? "default" : "secondary"}>
                    {match.ready ? "Ready now" : `${match.matchPct}% match`}
                  </Badge>
                  <span className="text-2xl" aria-hidden="true">
                    {match.recipe.emoji}
                  </span>
                </div>
                <CardTitle className="text-lg">{match.recipe.name}</CardTitle>
                <CardDescription>{match.recipe.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {match.have.map((ing) => (
                      <Badge
                        key={ing}
                        variant="outline"
                        className="text-xs border-primary/40 bg-primary/5"
                      >
                        <Check className="w-3 h-3 mr-1 text-primary" />
                        {ing}
                      </Badge>
                    ))}
                  </div>
                  {match.missing.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {match.missing.map((ing) => (
                        <Badge
                          key={ing}
                          variant="outline"
                          className="text-xs border-amber-400/60 bg-amber-50 text-amber-900 dark:bg-amber-950/30"
                        >
                          + {ing}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1 gradient-tropical text-foreground"
                    onClick={() => makeIt(match)}
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    Make it
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    disabled={busy}
                    onClick={() => makeItWithAi(match)}
                    title="Generate a fresh variation with Chef AI"
                  >
                    {busy ? (
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    ) : (
                      <ChefHat className="w-4 h-4 mr-1" />
                    )}
                    Chef AI
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {pantry.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">
          Showing the most popular recipes - tick ingredients above to see what
          you can make today.
        </p>
      )}
    </div>
  );
};