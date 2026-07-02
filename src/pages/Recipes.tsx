import { useState } from "react";
import { RecipeGenerator } from "@/components/RecipeGenerator";
import { RecipeDisplay } from "@/components/RecipeDisplay";
import { CostCalculator } from "@/components/CostCalculator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Heart, Share2, Save, Calculator } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import SEO, { StructuredData } from "@/components/SEO";
import { generateRecipeStructuredData } from "@/utils/seo";
import heroImage from "@/assets/tropical-hero.jpg";
import { AnimatedFruitIcon } from "@/components/AnimatedFruitIcon";

const generateFeaturedRecipeMarkdown = (recipe: { name: string; fruits: string[]; style: string; time: string }) => {
  const fruitList = recipe.fruits.join(" and ");
  const baseIngredients = recipe.fruits.map(f => `- 1.5 cups fresh ${f}, chopped`).join("\n");
  
  return `# ${recipe.name} 🥤

## Ingredients:
${baseIngredients}
- 1 cup coconut water or base liquid
- 1 tablespoon honey or agave nectar (optional)
- Ice cubes
- Fresh mint leaves for garnish

## Instructions:
1. Wash and prepare all tropical fruits: ${recipe.fruits.join(", ")}.
2. Add the chopped ingredients and the liquid base to your blender.
3. Add sweetener if desired and blend on high speed for 60 seconds.
4. Process until smooth and creamy with no large fruit chunks.
5. Pour into a tall chilled glass and garnish with fresh mint.

## Nutritional Benefits:
- Hydrating and refreshing blend packed with raw vitamins.
- Rich in dietary fiber and essential antioxidants from fresh ${fruitList}.
- Low-calorie hydration with natural energy.

## Tips:
- Best consumed within 15 minutes of blending for maximum nutritional absorption.
- Pre-freeze your fruit chunks for an extra-cold smoothie texture.

## Prep Time: ${recipe.time}
## Servings: 2 servings`;
};

const Recipes = () => {
  const [currentRecipe, setCurrentRecipe] = useState("");

  const handleRecipeGenerated = (recipe: string) => {
    setCurrentRecipe(recipe);
  };

  const featuredRecipes = [
    {
      name: "Tropical Paradise Smoothie",
      fruits: ["Mango", "Pineapple", "Coconut"],
      style: "Smoothie",
      time: "5 mins",
      rating: 4.9,
      reviews: 128,
      description:
        "A creamy blend of tropical fruits that tastes like vacation in a glass",
    },
    {
      name: "Green Goddess Detox",
      fruits: ["Kiwi", "Spinach", "Apple"],
      style: "Detox",
      time: "3 mins",
      rating: 4.7,
      reviews: 95,
      description:
        "Cleansing green juice packed with vitamins and antioxidants",
    },
    {
      name: "Dragon Fruit Energy Blast",
      fruits: ["Dragon Fruit", "Passion Fruit", "Ginger"],
      style: "Energy",
      time: "4 mins",
      rating: 4.8,
      reviews: 76,
      description: "Exotic energy booster with natural caffeine alternatives",
    },
    {
      name: "Pineapple Coconut Refresher",
      fruits: ["Pineapple", "Coconut", "Lime"],
      style: "Refresher",
      time: "3 mins",
      rating: 4.9,
      reviews: 215,
      description: "Refreshing hydration with a cool mint finish",
    },
    {
      name: "Mango Banana Bliss",
      fruits: ["Mango", "Banana", "Almond Milk"],
      style: "Smoothie",
      time: "4 mins",
      rating: 4.8,
      reviews: 189,
      description: "Creamy and indulgent tropical treat",
    },
    {
      name: "Berry Tropical Fusion",
      fruits: ["Blueberry", "Strawberry", "Mango"],
      style: "Smoothie",
      time: "4 mins",
      rating: 4.7,
      reviews: 156,
      description: "Antioxidant-rich blend with berries and tropical fruits",
    },
    {
      name: "Pear Ginger Zing",
      fruits: ["Pear", "Ginger", "Lemon"],
      style: "Juice",
      time: "3 mins",
      rating: 4.6,
      reviews: 89,
      description: "Warming and immune-boosting combination",
    },
    {
      name: "Coconut Mango Delight",
      fruits: ["Coconut", "Mango", "Papaya"],
      style: "Smoothie",
      time: "5 mins",
      rating: 4.9,
      reviews: 234,
      description: "Ultra-creamy tropical paradise in a glass",
    },
    {
      name: "Pineapple Mint Cooler",
      fruits: ["Pineapple", "Mint", "Cucumber"],
      style: "Refresher",
      time: "3 mins",
      rating: 4.8,
      reviews: 167,
      description: "Refreshing hydration with a cool mint finish",
    },
    {
      name: "Banana Oat Breakfast",
      fruits: ["Banana", "Oat Milk", "Honey"],
      style: "Smoothie",
      time: "4 mins",
      rating: 4.7,
      reviews: 198,
      description: "Filling breakfast smoothie with sustained energy",
    },
    {
      name: "Blueberry Acai Bowl",
      fruits: ["Blueberry", "Acai", "Banana"],
      style: "Bowl",
      time: "5 mins",
      rating: 4.9,
      reviews: 312,
      description: "Instagram-worthy acai bowl with fresh toppings",
    },
    {
      name: "Tropical Citrus Burst",
      fruits: ["Orange", "Mango", "Pineapple", "Grapefruit"],
      style: "Juice",
      time: "4 mins",
      rating: 4.8,
      reviews: 145,
      description: "Vitamin C-packed citrus explosion",
    },
    {
      name: "Coconut Water Recovery",
      fruits: ["Coconut Water", "Banana", "Spinach"],
      style: "Recovery",
      time: "3 mins",
      rating: 4.6,
      reviews: 78,
      description: "Post-workout recovery drink with electrolytes",
    },
    {
      name: "Mango Peach Summer",
      fruits: ["Mango", "Peach", "Vanilla"],
      style: "Smoothie",
      time: "4 mins",
      rating: 4.9,
      reviews: 267,
      description: "Sweet summer stone fruit tropical blend",
    },
    {
      name: "Pear Apple Wellness",
      fruits: ["Pear", "Apple", "Celery"],
      style: "Juice",
      time: "3 mins",
      rating: 4.5,
      reviews: 92,
      description: "Classic fruit and veggie combination for wellness",
    },
    {
      name: "Tropical Berry Antioxidant",
      fruits: ["Blueberry", "Raspberry", "Mango", "Pineapple"],
      style: "Smoothie",
      time: "4 mins",
      rating: 4.8,
      reviews: 176,
      description: "Power-packed antioxidant smoothie",
    },
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`full-${i}`} className="text-yellow-400">
          ★
        </span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-400">
          ½
        </span>
      );
    }

    return stars;
  };

  const handleFeaturedRecipeClick = (recipe: typeof featuredRecipes[0]) => {
    const md = generateFeaturedRecipeMarkdown(recipe);
    setCurrentRecipe(md);
    // Use setTimeout to ensure the DOM section renders before scrolling
    setTimeout(() => {
      const displayElement = document.getElementById("recipe-display-section");
      if (displayElement) {
        displayElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <>
      {/* Page-specific SEO */}
      <SEO
        title="AI Juice & Smoothie Recipe Generator"
        description="Generate personalized tropical juice recipes using AI. Choose from exotic fruits, vegetables, and dietary preferences for perfect healthy drinks."
        keywords={[
          "recipe generator",
          "AI recipes",
          "custom smoothies",
          "tropical blends",
        ]}
      />

      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-black/60 bg-gradient-to-br from-accent/30 via-background/90 to-primary/30" />
          </div>
          <div className="relative z-10 container mx-auto max-w-4xl text-center px-6">
            <AnimatedFruitIcon />
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-xl">
              Create Amazing<br />Tropical Recipes
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Our advanced AI analyzes your preferences to craft the perfect
              tropical juice blend.
            </p>
          </div>
        </section>

        {/* Recipe Generator */}
        <section className="px-6 pb-12">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 relative">
                Custom Recipe Creator
              </h2>
            </div>
            <RecipeGenerator onRecipeGenerated={handleRecipeGenerated} />
          </div>
        </section>

        {/* Recipe Display */}
        {currentRecipe && (
          <section id="recipe-display-section" className="px-6 pb-12 transition-all duration-500">
            <div className="container mx-auto">
              <RecipeDisplay recipe={currentRecipe} />
            </div>
          </section>
        )}

        {/* Featured Recipes */}
        <section className="px-6 pb-16 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 gradient-fresh bg-clip-text text-transparent">
                Featured Recipes
              </h2>
              <p className="text-foreground/70">
                Try these popular recipes created by our AI and loved by our
                community
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredRecipes.map((recipe, index) => (
                <Card
                  key={index}
                  className="shadow-tropical border-0 hover:scale-105 transition-bounce cursor-pointer"
                  onClick={() => handleFeaturedRecipeClick(recipe)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start mb-3">
                      <Badge variant="secondary">{recipe.style}</Badge>
                      <div className="text-2xl">🥤</div>
                    </div>
                    <CardTitle className="text-xl">{recipe.name}</CardTitle>
                    <CardDescription>{recipe.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {recipe.fruits.map((fruit) => (
                          <Badge
                            key={fruit}
                            variant="outline"
                            className="text-xs"
                          >
                            {fruit}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-foreground/70">
                          <Sparkles className="w-4 h-4" />
                          {recipe.time}
                        </div>
                        <div className="flex items-center gap-1">
                          {renderStars(recipe.rating)}
                          <span className="text-foreground/70 ml-1">
                            ({recipe.reviews})
                          </span>
                        </div>
                      </div>

                      <Button 
                        className="w-full gradient-tropical text-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFeaturedRecipeClick(recipe);
                        }}
                      >
                        Try This Recipe
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="px-6 pb-16">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12 text-secondary">
              How Our AI Creates Perfect Recipes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="font-bold text-lg mb-2 text-primary">
                  Analyze Preferences
                </h3>
                <p className="text-sm text-foreground/70">
                  Our AI considers your fruit choices, dietary needs, and taste
                  preferences
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🧠</div>
                <h3 className="font-bold text-lg mb-2 text-secondary">
                  Smart Combinations
                </h3>
                <p className="text-sm text-foreground/70">
                  Advanced algorithms find the perfect balance of flavors and
                  nutrition
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="font-bold text-lg mb-2 text-accent">
                  Personalized Recipe
                </h3>
                <p className="text-sm text-foreground/70">
                  Get a unique recipe with ingredients, instructions, and health
                  benefits
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cost Calculator */}
        <section className="px-6 pb-16 bg-muted/30">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 gradient-fresh bg-clip-text text-transparent flex items-center justify-center gap-2">
                <Calculator className="w-6 h-6" />
                AI Service Cost Calculator
              </h2>
              <p className="text-foreground/70 max-w-2xl mx-auto">
                Understand the costs of running AI-powered recipe generation at
                scale. Perfect for developers and businesses planning to deploy
                similar apps.
              </p>
            </div>
            <CostCalculator />
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Recipes;
