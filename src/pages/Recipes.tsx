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
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${
          i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ⭐
      </span>
    ));
  };

  return (
    <>
      {/* Page-specific SEO */}
      <SEO
        title="AI Recipe Generator - Create Custom Tropical Juice Recipes"
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
          <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-background/90 to-primary/30" />
          <div className="relative z-10 container mx-auto max-w-4xl text-center px-6">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight relative">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-extrabold">
                Create Amazing
              </span>
              <br />
              <span className="bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent font-extrabold">
                Tropical Recipes
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Our advanced AI analyzes your preferences to craft the perfect
              tropical juice blend.
              <br />
              <span className="text-lg text-primary font-semibold">
                ✨ Personalized • 🌿 Healthy • 🎯 Perfect for You
              </span>
            </p>
            <div className="flex justify-center gap-6 text-4xl mb-8">
              <span className="animate-bounce delay-100">🥭</span>
              <span className="animate-bounce delay-200">🍍</span>
              <span className="animate-bounce delay-300">🥥</span>
              <span className="animate-bounce delay-400">🥝</span>
              <span className="animate-bounce delay-500">🫐</span>
            </div>
          </div>
        </section>

        {/* Recipe Generator */}
        <section className="px-6 pb-12">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 relative">
                <span className="bg-gradient-to-r from-secondary via-primary to-accent bg-clip-text text-transparent">
                   Create Your Recipe
                </span>
              </h2>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto mb-8">
                Select your favorite tropical fruits and let our AI create the
                perfect recipe just for you!
              </p>
            </div>
            <RecipeGenerator onRecipeGenerated={handleRecipeGenerated} />
          </div>
        </section>

        {/* Current Recipe Display */}
        {currentRecipe && (
          <section className="px-6 pb-16">
            <div className="container mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4 text-secondary">
                  Your Custom Recipe
                </h2>
                <div className="flex justify-center gap-4">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save Recipe
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                  <Button className="gradient-tropical text-foreground flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Add to Favorites
                  </Button>
                </div>
              </div>
              <RecipeDisplay recipe={currentRecipe} />
            </div>
          </section>
        )}

        {/* Featured Recipes */}
        <section className="px-6 pb-16 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-fresh bg-clip-text text-transparent">
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

                      <Button className="w-full gradient-tropical text-foreground">
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
              <h2 className="text-3xl font-bold mb-4 bg-gradient-fresh bg-clip-text text-transparent flex items-center justify-center gap-2">
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
