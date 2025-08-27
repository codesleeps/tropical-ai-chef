import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface RecipeGeneratorProps {
  onRecipeGenerated: (recipe: string) => void;
}

export const RecipeGenerator = ({ onRecipeGenerated }: RecipeGeneratorProps) => {
  const [fruit, setFruit] = useState('');
  const [vegetables, setVegetables] = useState('');
  const [style, setStyle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!fruit || !style) return;
    
    setIsGenerating(true);
    
    // Simulate recipe generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const recipeName = `${style.charAt(0).toUpperCase() + style.slice(1)} ${fruit} ${vegetables ? `& ${vegetables}` : ''} Blast`;
    
    const recipe = `
# ${recipeName} 🥤

## Ingredients:
- 2 cups fresh ${fruit}, chopped
${vegetables ? `- 1 cup ${vegetables}, chopped` : ''}
- 1 cup coconut water
- 1 tablespoon honey (optional)
- Ice cubes
- Mint leaves for garnish

## Instructions:
1. Wash and prepare all fruits and vegetables
2. Add ${fruit}${vegetables ? `, ${vegetables}` : ''} and coconut water to blender
3. Blend on high speed for 60-90 seconds until smooth
4. Add honey if desired for extra sweetness
5. Pour over ice and garnish with fresh mint

## Benefits:
- Rich in vitamins and antioxidants
- Natural energy boost from tropical fruits
- Hydrating and refreshing
- Perfect for ${style === 'detox' ? 'cleansing and detoxification' : style === 'energy' ? 'pre-workout fuel' : 'a creamy, satisfying treat'}

*Enjoy your tropical paradise in a glass! 🌴*
    `;
    
    onRecipeGenerated(recipe);
    setIsGenerating(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-tropical">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold bg-gradient-fresh bg-clip-text text-transparent flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8 text-secondary" />
          Recipe Generator
        </CardTitle>
        <CardDescription className="text-lg">
          Create your perfect tropical juice blend
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fruit" className="text-base font-semibold">Choose Your Main Fruit</Label>
            <Select value={fruit} onValueChange={setFruit}>
              <SelectTrigger className="transition-smooth focus:shadow-glow">
                <SelectValue placeholder="Select a tropical fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mango">🥭 Mango</SelectItem>
                <SelectItem value="pineapple">🍍 Pineapple</SelectItem>
                <SelectItem value="passion fruit">🫐 Passion Fruit</SelectItem>
                <SelectItem value="dragon fruit">🐉 Dragon Fruit</SelectItem>
                <SelectItem value="papaya">🧡 Papaya</SelectItem>
                <SelectItem value="guava">🍃 Guava</SelectItem>
                <SelectItem value="kiwi">🥝 Kiwi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="vegetables" className="text-base font-semibold">Add Vegetables (Optional)</Label>
            <Input
              id="vegetables"
              placeholder="e.g., spinach, cucumber, celery"
              value={vegetables}
              onChange={(e) => setVegetables(e.target.value)}
              className="transition-smooth focus:shadow-glow"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="style" className="text-base font-semibold">Juice Style</Label>
          <Select value={style} onValueChange={setStyle}>
            <SelectTrigger className="transition-smooth focus:shadow-glow">
              <SelectValue placeholder="Choose your style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="smoothie">🥤 Creamy Smoothie</SelectItem>
              <SelectItem value="detox">🌿 Detox Cleanse</SelectItem>
              <SelectItem value="energy">⚡ Energy Boost</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleGenerate}
          disabled={!fruit || !style || isGenerating}
          className="w-full gradient-sunset text-foreground font-bold text-lg py-6 hover:scale-105 transition-bounce shadow-tropical"
        >
          {isGenerating ? "Creating Your Recipe..." : "Generate Recipe ✨"}
        </Button>
      </CardContent>
    </Card>
  );
};