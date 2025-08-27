// Ollama Recipe Generator
// Connects to local Ollama models for high-quality recipe generation

export interface OllamaModel {
  name: string;
  size: string;
  quality: 'fast' | 'balanced' | 'premium';
  description: string;
}

export interface OllamaRecipeRequest {
  fruit: string;
  style: string;
  vegetables?: string;
  dietaryRestrictions?: string;
  model?: string;
}

export interface OllamaRecipe {
  title: string;
  ingredients: string[];
  instructions: string[];
  nutritionalBenefits: string[];
  tips: string[];
  prepTime: string;
  servings: string;
  emoji: string;
  model: string;
  generationTime: number;
}

// Available Ollama models with their characteristics
export const OLLAMA_MODELS: Record<string, OllamaModel> = {
  'llama3.3:latest': {
    name: 'Llama 3.3',
    size: '42 GB',
    quality: 'premium',
    description: 'Highest quality - Best for creative recipes'
  },
  'llama2:latest': {
    name: 'Llama 2',
    size: '3.8 GB',
    quality: 'balanced',
    description: 'Great balance of quality and speed'
  },
  'gemma3:270m': {
    name: 'Gemma 3 (270M)',
    size: '291 MB',
    quality: 'fast',
    description: 'Lightning fast - Good quality for quick recipes'
  },
  'deepseek-coder-v2:latest': {
    name: 'DeepSeek Coder v2',
    size: '8.9 GB',
    quality: 'premium',
    description: 'Excellent for detailed instructions'
  }
};

// Check if Ollama is available
export async function checkOllamaAvailability(): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:11434/api/tags');
    return response.ok;
  } catch {
    return false;
  }
}

// Get available models from Ollama
export async function getAvailableModels(): Promise<string[]> {
  try {
    const response = await fetch('http://localhost:11434/api/tags');
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.models?.map((model: any) => model.name) || [];
  } catch {
    return [];
  }
}

// Generate recipe using Ollama
export async function generateRecipeWithOllama(
  request: OllamaRecipeRequest,
  model: string = 'llama3.3:latest'
): Promise<OllamaRecipe> {
  const startTime = Date.now();
  
  try {
    // Create the prompt for the model
    const prompt = createOllamaPrompt(request);
    
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.8,
          top_p: 0.9,
          max_tokens: 800,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    const recipeText = data.response;
    
    const generationTime = Date.now() - startTime;
    
    // Parse the recipe from the AI response
    const recipe = parseOllamaRecipe(recipeText, model, generationTime);
    
    return recipe;
    
  } catch (error) {
    console.error('Ollama generation error:', error);
    throw new Error(`Failed to generate recipe with ${model}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Create optimized prompt for Ollama models
function createOllamaPrompt(request: OllamaRecipeRequest): string {
  return `You are a professional tropical juice recipe creator with expertise in nutrition, flavor combinations, and healthy living.

Create a detailed tropical juice recipe with these requirements:
- Main Fruit: ${request.fruit}
- Style: ${request.style}
- Additional Vegetables: ${request.vegetables || 'none'}
- Dietary Restrictions: ${request.dietaryRestrictions || 'none'}

Please provide the recipe in this EXACT format:

# [Creative Recipe Name] 🥤

## Ingredients:
- [List ingredients with measurements]

## Instructions:
1. [Step-by-step instructions]

## Nutritional Benefits:
- [List health benefits]

## Tips:
- [Helpful tips for best results]

## Prep Time: [X minutes]
## Servings: [X servings]

Make it creative, delicious, and include tropical flavors. The recipe should be healthy and appealing. Be specific with measurements and provide practical tips.`;
}

// Parse recipe from Ollama response
function parseOllamaRecipe(text: string, model: string, generationTime: number): OllamaRecipe {
  const lines = text.split('\n').filter(line => line.trim());
  
  let title = 'Tropical Paradise Blend';
  let ingredients: string[] = [];
  let instructions: string[] = [];
  let nutritionalBenefits: string[] = [];
  let tips: string[] = [];
  let prepTime = '5 minutes';
  let servings = '2 servings';
  
  let currentSection = '';
  
  for (const line of lines) {
    if (line.startsWith('# ')) {
      title = line.replace('# ', '').replace(' 🥤', '');
    } else if (line.startsWith('## ')) {
      currentSection = line.replace('## ', '').toLowerCase();
    } else if (line.startsWith('- ')) {
      const item = line.replace('- ', '');
      switch (currentSection) {
        case 'ingredients:':
          ingredients.push(item);
          break;
        case 'nutritional benefits:':
          nutritionalBenefits.push(item);
          break;
        case 'tips:':
          tips.push(item);
          break;
      }
    } else if (line.match(/^\d+\./)) {
      instructions.push(line);
    } else if (line.includes('Prep Time:')) {
      prepTime = line.split(':')[1]?.trim() || '5 minutes';
    } else if (line.includes('Servings:')) {
      servings = line.split(':')[1]?.trim() || '2 servings';
    }
  }
  
  // Fallback if parsing didn't work well
  if (ingredients.length === 0) {
    ingredients = [
      `2 cups fresh ${request.fruit}, chopped`,
      '1 cup coconut water',
      '1 tablespoon honey (optional)',
      'Ice cubes',
      'Mint leaves for garnish'
    ];
  }
  
  if (instructions.length === 0) {
    instructions = [
      'Wash and prepare all fruits and vegetables',
      'Add ingredients to blender',
      'Blend until smooth',
      'Pour over ice and garnish'
    ];
  }
  
  if (nutritionalBenefits.length === 0) {
    nutritionalBenefits = [
      'Rich in vitamins and antioxidants',
      'Natural energy boost',
      'Hydrating and refreshing'
    ];
  }
  
  if (tips.length === 0) {
    tips = [
      'Use frozen fruits for better texture',
      'Add a pinch of sea salt to enhance flavors',
      'Store in airtight container for up to 24 hours'
    ];
  }
  
  return {
    title,
    ingredients,
    instructions,
    nutritionalBenefits,
    tips,
    prepTime,
    servings,
    emoji: '🥤',
    model,
    generationTime
  };
}

// Get model recommendations based on user preferences
export function getModelRecommendation(preference: 'speed' | 'quality' | 'balanced'): string {
  switch (preference) {
    case 'speed':
      return 'gemma3:270m';
    case 'quality':
      return 'llama3.3:latest';
    case 'balanced':
    default:
      return 'llama2:latest';
  }
}

// Test model availability
export async function testModel(model: string): Promise<{ available: boolean; responseTime?: number }> {
  try {
    const startTime = Date.now();
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        prompt: 'Hello, this is a test.',
        stream: false,
        options: {
          max_tokens: 10,
        }
      }),
    });
    
    const responseTime = Date.now() - startTime;
    
    return {
      available: response.ok,
      responseTime
    };
  } catch {
    return { available: false };
  }
}
