import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, AlertCircle, Settings, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { generateRecipeWithOpenAI, generateRecipeWithHuggingFace, generateRecipeLocally, generateRecipeWithOllamaLocal, getOllamaModels, isOllamaAvailable, getAvailableOllamaModels, type RecipeRequest } from '@/utils/aiRecipeGenerator';

interface RecipeGeneratorProps {
  onRecipeGenerated: (recipe: string) => void;
}

export const RecipeGenerator = ({ onRecipeGenerated }: RecipeGeneratorProps) => {
  const [fruits, setFruits] = useState<string[]>([]);
  const [vegetables, setVegetables] = useState<string[]>([]);
  const [style, setStyle] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [aiService, setAiService] = useState<'local' | 'ollama' | 'openai' | 'huggingface'>('local');
  const [apiKey, setApiKey] = useState('');
  const [ollamaModel, setOllamaModel] = useState('llama3.3:latest');
  const [ollamaAvailable, setOllamaAvailable] = useState(false);
  const [ollamaModels, setOllamaModels] = useState<Record<string, any>>({});

  // Initialize Ollama on component mount
  useEffect(() => {
    const initOllama = async () => {
      const available = isOllamaAvailable();
      const models = getOllamaModels();
      setOllamaAvailable(available);
      setOllamaModels(models);
      
      // Check if Ollama becomes available
      if (!available) {
        setTimeout(async () => {
          const checkAvailable = await isOllamaAvailable();
          if (checkAvailable) {
            setOllamaAvailable(true);
            setOllamaModels(getOllamaModels());
            // Auto-switch to Ollama if it becomes available
            setAiService('ollama');
          }
        }, 2000);
      }
    };
    
    initOllama();
  }, []);

  const handleGenerate = async () => {
    if (!fruits.length || !style) {
      toast.error('Please select at least one fruit and style');
      return;
    }
    
    setIsGenerating(true);
    setError('');
    
    try {
      const request: RecipeRequest = {
        fruit: fruits.join(', '), // Join multiple fruits into a string
        style,
        vegetables: vegetables.length > 0 ? vegetables.join(', ') : undefined,
        dietaryRestrictions: dietaryRestrictions || undefined,
      };

      let recipe;
      
      switch (aiService) {
        case 'ollama':
          if (!ollamaAvailable) {
            throw new Error('Ollama is not available. Please start Ollama or switch to another service.');
          }
          recipe = await generateRecipeWithOllamaLocal(request, ollamaModel);
          break;
          
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
        fruit: fruits.join(', '), // Join multiple fruits into a string
        style,
        vegetables: vegetables.length > 0 ? vegetables.join(', ') : undefined,
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fruits" className="text-base font-semibold">Choose Your Fruits (Select up to 5)</Label>
            <div className="border rounded-lg p-3 max-h-56 overflow-y-auto bg-background">
              <div className="grid grid-cols-1 gap-3">
                {[
                  { value: "apples", label: "🍎 Apples" },
                  { value: "strawberries", label: "🍓 Strawberries" },
                  { value: "blueberries", label: "🫐 Blueberries" },
                  { value: "pomegranate", label: "🍇 Pomegranate" },
                  { value: "raspberries", label: "🫐 Raspberries" },
                  { value: "blackberries", label: "🫐 Blackberries" },
                  { value: "mango", label: "🥭 Mango" },
                  { value: "pineapple", label: "🍍 Pineapple" },
                  { value: "passion fruit", label: "🫐 Passion Fruit" },
                  { value: "dragon fruit", label: "🐉 Dragon Fruit" },
                  { value: "papaya", label: "🧡 Papaya" },
                  { value: "guava", label: "🍃 Guava" },
                  { value: "kiwi", label: "🥝 Kiwi" },
                  { value: "lychee", label: "🌰 Lychee" },
                  { value: "rambutan", label: "🦔 Rambutan" },
                  { value: "mangosteen", label: "💜 Mangosteen" }
                ].map((fruit) => (
                  <label key={fruit.value} className="flex items-center space-x-3 cursor-pointer hover:bg-accent/10 p-3 rounded-lg border border-transparent hover:border-accent/20 transition-all">
                    <input
                      type="checkbox"
                      value={fruit.value}
                      checked={fruits.includes(fruit.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          if (fruits.length < 5) {
                            setFruits([...fruits, fruit.value]);
                          } else {
                            toast.error('You can only select up to 5 fruits');
                          }
                        } else {
                          setFruits(fruits.filter(f => f !== fruit.value));
                        }
                      }}
                      className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4"
                    />
                    <span className="text-sm font-medium">{fruit.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Selected: {fruits.length}/5 fruits
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="vegetables" className="text-base font-semibold">Add Vegetables (Select up to 5)</Label>
            <div className="border rounded-lg p-3 max-h-56 overflow-y-auto bg-background">
              <div className="grid grid-cols-1 gap-3">
                {[
                  { value: "kale", label: "🥬 Kale" },
                  { value: "cucumber", label: "🥒 Cucumber" },
                  { value: "spinach", label: "🥬 Spinach" },
                  { value: "beetroot", label: "🫘 Beetroot" },
                  { value: "ginger", label: "🫚 Ginger" },
                  { value: "sorrel", label: "🌺 Sorrel (Hibiscus)" },
                  { value: "celery", label: "🥬 Celery" },
                  { value: "carrot", label: "🥕 Carrot" },
                  { value: "bell pepper", label: "🫑 Bell Pepper" },
                  { value: "broccoli", label: "🥦 Broccoli" },
                  { value: "lettuce", label: "🥬 Lettuce" },
                  { value: "mushroom", label: "🍄 Mushroom" },
                  { value: "tomato", label: "🍅 Tomato" },
                  { value: "lemon", label: "🍋 Lemon" },
                  { value: "lime", label: "🍈 Lime" }
                ].map((vegetable) => (
                  <label key={vegetable.value} className="flex items-center space-x-3 cursor-pointer hover:bg-accent/10 p-3 rounded-lg border border-transparent hover:border-accent/20 transition-all">
                    <input
                      type="checkbox"
                      value={vegetable.value}
                      checked={vegetables.includes(vegetable.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          if (vegetables.length < 5) {
                            setVegetables([...vegetables, vegetable.value]);
                          } else {
                            toast.error('You can only select up to 5 vegetables');
                          }
                        } else {
                          setVegetables(vegetables.filter(v => v !== vegetable.value));
                        }
                      }}
                      className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4"
                    />
                    <span className="text-sm font-medium">{vegetable.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Selected: {vegetables.length}/5 vegetables
            </div>
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
              <SelectItem value="ollama" disabled={!ollamaAvailable}>
                🚀 Ollama Local AI {ollamaAvailable ? '(FREE - Premium Quality)' : '(Not Available)'}
              </SelectItem>
              <SelectItem value="local">🤖 Local AI (FREE - Unlimited)</SelectItem>
              <SelectItem value="openai">🧠 OpenAI GPT-3.5 (Premium)</SelectItem>
              <SelectItem value="huggingface">🤗 Hugging Face (Budget)</SelectItem>
            </SelectContent>
          </Select>
          
          {showAdvanced && aiService === 'ollama' && ollamaAvailable && (
            <div className="space-y-2">
              <Label htmlFor="ollamaModel" className="text-sm">
                Select Ollama Model
              </Label>
              <Select value={ollamaModel} onValueChange={setOllamaModel}>
                <SelectTrigger className="transition-smooth focus:shadow-glow">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ollamaModels).map(([key, model]) => (
                    <SelectItem key={key} value={key}>
                      {model.name} ({model.size}) - {model.quality} quality
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-xs text-muted-foreground space-y-1">
                <p className="text-green-600 font-medium">
                  🚀 Premium AI quality - Completely FREE!
                </p>
                <p>
                  {ollamaModels[ollamaModel]?.description || 'Select a model for recipe generation'}
                </p>
              </div>
            </div>
          )}

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
              <div className="text-xs text-muted-foreground space-y-1">
                <p>
                  {aiService === 'openai' 
                    ? 'Get your API key from https://platform.openai.com/api-keys'
                    : 'Get your API key from https://huggingface.co/settings/tokens'
                  }
                </p>
                <p className="text-amber-600 font-medium">
                  💡 Tip: Local AI is FREE and unlimited - no API key needed!
                </p>
              </div>
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
          disabled={!fruits.length || !style || isGenerating}
          className="w-full gradient-sunset text-foreground font-bold text-lg py-8 hover:scale-105 transition-bounce shadow-tropical touch-manipulation"
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
          {aiService === 'ollama' && '🚀 Premium AI Quality - Completely FREE with Ollama!'}
          {aiService === 'local' && '🎉 FREE & Unlimited - Perfect for giving away!'}
          {aiService === 'openai' && '💎 Premium AI - Costs per request'}
          {aiService === 'huggingface' && '💰 Budget AI - Lower cost option'}
        </div>
      </CardContent>
    </Card>
  );
};