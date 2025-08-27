import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, AlertCircle, Settings, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { generateRecipeWithOpenAI, generateRecipeWithHuggingFace, generateRecipeLocally, type RecipeRequest } from '@/utils/aiRecipeGenerator';

interface RecipeGeneratorProps {
  onRecipeGenerated: (recipe: string) => void;
}

export const RecipeGenerator = ({ onRecipeGenerated }: RecipeGeneratorProps) => {
  const [fruit, setFruit] = useState('');
  const [vegetables, setVegetables] = useState('');
  const [style, setStyle] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [aiService, setAiService] = useState<'local' | 'openai' | 'huggingface'>('local');
  const [apiKey, setApiKey] = useState('');

  const handleGenerate = async () => {
    if (!fruit || !style) {
      toast.error('Please select a fruit and style');
      return;
    }
    
    setIsGenerating(true);
    setError('');
    
    try {
      const request: RecipeRequest = {
        fruit,
        style,
        vegetables: vegetables || undefined,
        dietaryRestrictions: dietaryRestrictions || undefined,
      };

      let recipe;
      
      switch (aiService) {
        case 'openai':
          if (!apiKey) {
            throw new Error('OpenAI API key is required');
          }
          recipe = await generateRecipeWithOpenAI(request, apiKey);
          break;
          
        case 'huggingface':
          if (!apiKey) {
            throw new Error('Hugging Face API key is required');
          }
          recipe = await generateRecipeWithHuggingFace(request, apiKey);
          break;
          
        case 'local':
        default:
          recipe = generateRecipeLocally(request);
          break;
      }

      // Convert recipe object to formatted text
      const recipeText = formatRecipeToText(recipe);
      onRecipeGenerated(recipeText);
      
      const serviceName = aiService === 'local' ? 'Local AI' : aiService === 'openai' ? 'OpenAI' : 'Hugging Face';
      toast.success(`Recipe generated with ${serviceName}! 🎉`);
      
    } catch (err) {
      console.error('Recipe generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate recipe. Please try again.');
      toast.error('Failed to generate recipe');
      
      // Fallback to local generation
      const request: RecipeRequest = {
        fruit,
        style,
        vegetables: vegetables || undefined,
        dietaryRestrictions: dietaryRestrictions || undefined,
      };
      const fallbackRecipe = generateRecipeLocally(request);
      const recipeText = formatRecipeToText(fallbackRecipe);
      onRecipeGenerated(recipeText);
    } finally {
      setIsGenerating(false);
    }
  };

  const formatRecipeToText = (recipe: any) => {
    return `# ${recipe.title} ${recipe.emoji}

## Ingredients:
${recipe.ingredients.map(ing => `- ${ing}`).join('\n')}

## Instructions:
${recipe.instructions.map((inst, i) => `${i + 1}. ${inst}`).join('\n')}

## Nutritional Benefits:
${recipe.nutritionalBenefits.map(benefit => `- ${benefit}`).join('\n')}

## Tips:
${recipe.tips.map(tip => `- ${tip}`).join('\n')}

## Prep Time: ${recipe.prepTime}
## Servings: ${recipe.servings}

*Enjoy your tropical paradise in a glass! 🌴*`;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-tropical">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold bg-gradient-fresh bg-clip-text text-transparent flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8 text-secondary" />
          AI Recipe Generator
        </CardTitle>
        <CardDescription className="text-lg">
          Create your perfect tropical juice blend with AI
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
                <SelectItem value="lychee">🌰 Lychee</SelectItem>
                <SelectItem value="rambutan">🦔 Rambutan</SelectItem>
                <SelectItem value="mangosteen">💜 Mangosteen</SelectItem>
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
              <SelectItem value="immunity">🛡️ Immunity Booster</SelectItem>
              <SelectItem value="digestive">🌱 Digestive Health</SelectItem>
              <SelectItem value="beauty">✨ Beauty Glow</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dietaryRestrictions" className="text-base font-semibold">Dietary Preferences (Optional)</Label>
          <Textarea
            id="dietaryRestrictions"
            placeholder="e.g., vegan, gluten-free, low-sugar, keto-friendly"
            value={dietaryRestrictions}
            onChange={(e) => setDietaryRestrictions(e.target.value)}
            className="transition-smooth focus:shadow-glow resize-none"
            rows={2}
          />
        </div>

        {/* AI Service Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Settings className="w-4 h-4" />
              AI Service
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs"
            >
              {showAdvanced ? 'Hide' : 'Advanced'}
            </Button>
          </div>
          
          <Select value={aiService} onValueChange={(value: any) => setAiService(value)}>
            <SelectTrigger className="transition-smooth focus:shadow-glow">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="local">🤖 Local AI (Free)</SelectItem>
              <SelectItem value="openai">🧠 OpenAI GPT-3.5</SelectItem>
              <SelectItem value="huggingface">🤗 Hugging Face</SelectItem>
            </SelectContent>
          </Select>
          
          {showAdvanced && (aiService === 'openai' || aiService === 'huggingface') && (
            <div className="space-y-2">
              <Label htmlFor="apiKey" className="text-sm">
                {aiService === 'openai' ? 'OpenAI' : 'Hugging Face'} API Key
              </Label>
              <Input
                id="apiKey"
                type="password"
                placeholder={`Enter your ${aiService === 'openai' ? 'OpenAI' : 'Hugging Face'} API key`}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="transition-smooth focus:shadow-glow"
              />
              <p className="text-xs text-muted-foreground">
                {aiService === 'openai' 
                  ? 'Get your API key from https://platform.openai.com/api-keys'
                  : 'Get your API key from https://huggingface.co/settings/tokens'
                }
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <Button 
          onClick={handleGenerate}
          disabled={!fruit || !style || isGenerating}
          className="w-full gradient-sunset text-foreground font-bold text-lg py-6 hover:scale-105 transition-bounce shadow-tropical"
        >
          {isGenerating ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              AI is Creating Your Recipe...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Generate AI Recipe ✨
            </div>
          )}
        </Button>
        
        <div className="text-center text-xs text-muted-foreground">
          {aiService === 'local' && 'Using local AI generation - no API key required'}
          {aiService === 'openai' && 'Using OpenAI GPT-3.5 - requires API key'}
          {aiService === 'huggingface' && 'Using Hugging Face - requires API key'}
        </div>
      </CardContent>
    </Card>
  );
};