import { Button } from '@/components/ui/button';
import { ChefHat, Sparkles, Leaf } from 'lucide-react';
import heroImage from '@/assets/tropical-hero.jpg';

interface TropicalHeroProps {
  onGetStarted: () => void;
}

export const TropicalHero = ({ onGetStarted }: TropicalHeroProps) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background/80 to-secondary/20" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight border-4 border-primary/50 rounded-3xl px-12 py-8 inline-block backdrop-blur-sm bg-white/10 shadow-tropical" style={{
          background: 'linear-gradient(135deg, hsl(45, 100%, 55%) 0%, hsl(340, 82%, 55%) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Tropical
          <br />
          AI Chef
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-foreground/80 max-w-2xl mx-auto leading-relaxed">
          Discover the perfect blend of tropical fruits and healthy vegetables. 
          Create personalized juice recipes that energize your body and delight your taste buds.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button 
            size="lg" 
            onClick={onGetStarted}
            className="gradient-tropical text-foreground font-bold text-lg px-8 py-6 hover:scale-105 transition-bounce shadow-tropical"
          >
            <ChefHat className="w-6 h-6 mr-2" />
            Start Creating Recipes
          </Button>
          
          <div className="flex items-center gap-6 text-sm text-foreground/70">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-secondary" />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-accent" />
              <span>100% Natural</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-20">
          <div className="bg-card/80 backdrop-blur-sm rounded-lg p-6 shadow-tropical">
            <div className="text-3xl mb-3">🌱</div>
            <h3 className="font-bold text-lg mb-2 text-accent">Detox Blends</h3>
            <p className="text-sm text-foreground/70">Cleansing recipes for a healthier you</p>
          </div>
          
          <div className="bg-card/80 backdrop-blur-sm rounded-lg p-6 shadow-tropical">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-bold text-lg mb-2 text-secondary">Energy Boosts</h3>
            <p className="text-sm text-foreground/70">Power-packed juices for active lifestyles</p>
          </div>
          
          <div className="bg-card/80 backdrop-blur-sm rounded-lg p-6 shadow-tropical">
            <div className="text-3xl mb-3">🥤</div>
            <h3 className="font-bold text-lg mb-2 text-primary">Creamy Smoothies</h3>
            <p className="text-sm text-foreground/70">Rich, satisfying tropical blends</p>
          </div>
        </div>
      </div>
    </div>
  );
};