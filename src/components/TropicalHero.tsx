import { Button } from "@/components/ui/button";
import { ChefHat, Sparkles, Leaf, ArrowDown } from "lucide-react";
import heroImage from "@/assets/tropical-hero.jpg";
import { useState, useEffect } from "react";

interface TropicalHeroProps {
  onGetStarted: () => void;
}

export const TropicalHero = ({ onGetStarted }: TropicalHeroProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentFruit, setCurrentFruit] = useState(0);

  const fruits = ["🥭", "🍍", "🥥", "🥝", "🫐", "🍓"];

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setCurrentFruit((prev) => (prev + 1) % fruits.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Fruit Elements */}
        {fruits.map((fruit, index) => (
          <div
            key={index}
            className={`absolute text-4xl opacity-20 animate-bounce ${
              index % 2 === 0 ? "animation-delay-1000" : "animation-delay-2000"
            }`}
            style={{
              left: `${10 + ((index * 15) % 80)}%`,
              top: `${20 + ((index * 10) % 60)}%`,
              animationDuration: `${3 + index}s`,
              animationDelay: `${index * 0.5}s`,
            }}
          >
            {fruit}
          </div>
        ))}
      </div>

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background/80 to-secondary/20" />
      </div>

      {/* Main Hero Content Section */}
      <div
        className={`relative z-10 text-center px-6 max-w-4xl mx-auto transition-all duration-1000 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Animated Fruit Icon */}
        <div className="text-6xl mb-4 transition-all duration-500 hover:scale-110">
          {fruits[currentFruit]}
        </div>

        <h1
          className={`text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[12rem] font-bold mb-4 md:mb-6 leading-tight transition-all duration-1000 relative ${
            isLoaded ? "scale-100" : "scale-95"
          }`}
        >
          <span
            className="relative inline-block"
            style={{
              background:
                "linear-gradient(45deg, hsl(45, 100%, 55%), hsl(340, 82%, 55%), hsl(88, 50%, 53%), hsl(45, 100%, 55%))",
              backgroundSize: "300% 300%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "gradientShift 3s ease-in-out infinite",
            }}
          >
            Tropical
          </span>
          <br />
          <span
            className="relative inline-block"
            style={{
              background:
                "linear-gradient(45deg, hsl(340, 82%, 55%), hsl(88, 50%, 53%), hsl(45, 100%, 55%), hsl(340, 82%, 55%))",
              backgroundSize: "300% 300%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "gradientShift 4s ease-in-out infinite reverse",
            }}
          >
            AI Chef
          </span>
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl mb-6 md:mb-8 text-foreground/80 max-w-2xl mx-auto leading-relaxed px-4">
          Discover the perfect blend of tropical fruits and healthy vegetables.
          Create personalized juice recipes that energize your body and delight
          your taste buds.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 md:mb-12">
          <Button
            size="lg"
            onClick={onGetStarted}
            className="gradient-tropical text-foreground font-bold text-lg px-8 py-6 hover:scale-105 transition-all duration-300 shadow-tropical animate-pulse hover:animate-none"
          >
            <ChefHat className="w-6 h-6 mr-2" />
            Start Creating Recipes
          </Button>

          <div className="flex items-center gap-6 text-sm text-foreground/70">
            <div className="flex items-center gap-2 group">
              <Sparkles className="w-5 h-5 text-secondary group-hover:animate-spin transition-transform" />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center gap-2 group">
              <Leaf className="w-5 h-5 text-accent group-hover:animate-bounce transition-transform" />
              <span>100% Natural</span>
            </div>
          </div>
        </div>

        {/* Recipe Type Showcase Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto mb-12 md:mb-20 px-4">
          <div className="bg-card/80 backdrop-blur-sm rounded-lg p-6 shadow-tropical hover:shadow-xl transition-all duration-300 hover:scale-105 group">
            <div className="text-3xl mb-3 group-hover:animate-bounce">🌱</div>
            <h3 className="font-bold text-lg mb-2 text-accent">Detox Blends</h3>
            <p className="text-sm text-foreground/70">
              Cleansing recipes for a healthier you
            </p>
          </div>

          <div className="bg-card/80 backdrop-blur-sm rounded-lg p-6 shadow-tropical hover:shadow-xl transition-all duration-300 hover:scale-105 group">
            <div className="text-3xl mb-3 group-hover:animate-bounce">⚡</div>
            <h3 className="font-bold text-lg mb-2 text-secondary">
              Energy Boosts
            </h3>
            <p className="text-sm text-foreground/70">
              Power-packed juices for active lifestyles
            </p>
          </div>

          <div className="bg-card/80 backdrop-blur-sm rounded-lg p-6 shadow-tropical hover:shadow-xl transition-all duration-300 hover:scale-105 group">
            <div className="text-3xl mb-3 group-hover:animate-bounce">🥤</div>
            <h3 className="font-bold text-lg mb-2 text-primary">
              Creamy Smoothies
            </h3>
            <p className="text-sm text-foreground/70">
              Rich, satisfying tropical blends
            </p>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="animate-bounce text-foreground/50">
          <ArrowDown className="w-6 h-6 mx-auto" />
        </div>
      </div>
    </div>
  );
};
