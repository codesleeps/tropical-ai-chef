import { useState } from 'react';
import { TropicalHero } from '@/components/TropicalHero';
import { LoginForm } from '@/components/LoginForm';
import { RecipeGenerator } from '@/components/RecipeGenerator';
import { RecipeDisplay } from '@/components/RecipeDisplay';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState('');

  const handleGetStarted = () => {
    setShowLogin(true);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLogin(false);
  };

  const handleRecipeGenerated = (recipe: string) => {
    setCurrentRecipe(recipe);
  };

  if (!showLogin && !isLoggedIn) {
    return <TropicalHero onGetStarted={handleGetStarted} />;
  }

  if (showLogin && !isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-6">
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-6 py-12 space-y-12">
        <header className="text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-tropical bg-clip-text text-transparent">
            Welcome to Fresh Tropical Juices! 🌴
          </h1>
          <p className="text-xl text-foreground/70">
            Let's create your perfect tropical juice recipe
          </p>
        </header>
        
        <RecipeGenerator onRecipeGenerated={handleRecipeGenerated} />
        
        {currentRecipe && <RecipeDisplay recipe={currentRecipe} />}
      </div>
    </div>
  );
};

export default Index;
