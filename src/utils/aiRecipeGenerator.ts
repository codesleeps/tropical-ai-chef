// AI Recipe Generator Utility
// This works client-side and can integrate with various AI services

import { generateRecipeWithOllama, checkOllamaAvailability, getAvailableModels, OLLAMA_MODELS, type OllamaRecipeRequest } from './ollamaRecipeGenerator';

export interface RecipeRequest {
  fruit: string;
  style: string;
  vegetables?: string;
  dietaryRestrictions?: string;
}

export interface Recipe {
  title: string;
  ingredients: string[];
  instructions: string[];
  nutritionalBenefits: string[];
  tips: string[];
  prepTime: string;
  servings: string;
  emoji: string;
  model?: string;
  generationTime?: number;
}

// Option 1: OpenAI API (requires API key)
export async function generateRecipeWithOpenAI(
  request: RecipeRequest,
  apiKey: string
): Promise<Recipe> {
  try {
    const prompt = createPrompt(request);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional tropical juice recipe creator. Create detailed, healthy, and delicious recipes with exact formatting as requested.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API request failed');
    }

    const data = await response.json();
    const recipeText = data.choices[0].message.content;
    
    return parseRecipeFromText(recipeText);
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

// Option 2: Hugging Face API (free tier available)
export async function generateRecipeWithHuggingFace(
  request: RecipeRequest,
  apiKey: string
): Promise<Recipe> {
  try {
    const prompt = createPrompt(request);
    
    const response = await fetch(
      'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_length: 500,
            temperature: 0.8,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Hugging Face API request failed');
    }

    const data = await response.json();
    const recipeText = data[0].generated_text;
    
    return parseRecipeFromText(recipeText);
  } catch (error) {
    console.error('Hugging Face API error:', error);
    throw error;
  }
}

// Option 3: Local AI generation (fallback)
export function generateRecipeLocally(request: RecipeRequest): Recipe {
  const { fruit, style, vegetables, dietaryRestrictions } = request;
  
  // Generate creative recipe names
  const recipeNames = [
    `${style.charAt(0).toUpperCase() + style.slice(1)} ${fruit} Paradise`,
    `Tropical ${fruit} ${style} Delight`,
    `${fruit} ${style} Fusion`,
    `Island ${fruit} ${style} Blend`,
    `${style.charAt(0).toUpperCase() + style.slice(1)} ${fruit} Dream`
  ];
  
  const randomName = recipeNames[Math.floor(Math.random() * recipeNames.length)];
  
  // Generate ingredients based on style and fruit
  const baseIngredients = [
    `2 cups fresh ${fruit}, chopped`,
    '1 cup coconut water',
    '1/2 cup fresh orange juice',
    '1 tablespoon honey (optional)',
    'Ice cubes',
    'Mint leaves for garnish'
  ];
  
  if (vegetables) {
    baseIngredients.splice(2, 0, `1 cup ${vegetables}, chopped`);
  }
  
  // Add style-specific ingredients
  const styleIngredients = {
    smoothie: ['1/2 cup Greek yogurt', '1 banana'],
    detox: ['1 cup spinach', '1/2 lemon, juiced', '1 inch ginger root'],
    energy: ['1/2 cup pomegranate seeds', '1 tablespoon chia seeds'],
    immunity: ['1 cup kale', '1 orange, peeled', '1 inch turmeric root'],
    digestive: ['1 cup cucumber', '1/2 cup aloe vera juice', '1 teaspoon fennel seeds'],
    beauty: ['1 cup strawberries', '1/2 cup blueberries', '1 tablespoon collagen powder']
  };
  
  const additionalIngredients = styleIngredients[style as keyof typeof styleIngredients] || [];
  const allIngredients = [...baseIngredients, ...additionalIngredients];
  
  // Generate instructions
  const instructions = [
    'Wash and prepare all fruits and vegetables',
    `Add ${fruit}${vegetables ? `, ${vegetables}` : ''} and coconut water to blender`,
    'Add remaining ingredients and blend on high speed for 60-90 seconds until smooth',
    'Add honey if desired for extra sweetness',
    'Pour over ice and garnish with fresh mint'
  ];
  
  // Generate nutritional benefits
  const benefits = [
    'Rich in vitamins and antioxidants',
    'Natural energy boost from tropical fruits',
    'Hydrating and refreshing',
    getStyleBenefit(style)
  ];
  
  // Generate tips
  const tips = [
    'Use frozen fruits for a colder, thicker consistency',
    'Add a pinch of sea salt to enhance flavors',
    'Store in an airtight container for up to 24 hours',
    'Perfect for post-workout recovery'
  ];
  
  return {
    title: randomName,
    ingredients: allIngredients,
    instructions,
    nutritionalBenefits: benefits,
    tips,
    prepTime: '5 minutes',
    servings: '2 servings',
    emoji: '🥤'
  };
}

// Check Ollama availability on startup
let ollamaAvailable = false;
let availableOllamaModels: string[] = [];

export async function initializeOllama() {
  try {
    ollamaAvailable = await checkOllamaAvailability();
    if (ollamaAvailable) {
      availableOllamaModels = await getAvailableModels();
      console.log('Ollama available with models:', availableOllamaModels);
    }
  } catch (error) {
    console.log('Ollama not available:', error);
  }
}

// Initialize Ollama when module loads
initializeOllama();

// Option 1: Ollama (Local AI - FREE)
export async function generateRecipeWithOllamaLocal(
  request: RecipeRequest,
  model: string = 'llama3.3:latest'
): Promise<Recipe> {
  try {
    if (!ollamaAvailable) {
      throw new Error('Ollama is not available');
    }
    
    const ollamaRequest: OllamaRecipeRequest = {
      fruit: request.fruit,
      style: request.style,
      vegetables: request.vegetables,
      dietaryRestrictions: request.dietaryRestrictions,
      model: model
    };
    
    const ollamaRecipe = await generateRecipeWithOllama(ollamaRequest, model);
    
    // Convert to standard Recipe format
    return {
      title: ollamaRecipe.title,
      ingredients: ollamaRecipe.ingredients,
      instructions: ollamaRecipe.instructions,
      nutritionalBenefits: ollamaRecipe.nutritionalBenefits,
      tips: ollamaRecipe.tips,
      prepTime: ollamaRecipe.prepTime,
      servings: ollamaRecipe.servings,
      emoji: ollamaRecipe.emoji,
      model: ollamaRecipe.model,
      generationTime: ollamaRecipe.generationTime
    };
  } catch (error) {
    console.error('Ollama generation error:', error);
    throw error;
  }
}

// Get Ollama model info
export function getOllamaModels() {
  return OLLAMA_MODELS;
}

export function isOllamaAvailable() {
  return ollamaAvailable;
}

export function getAvailableOllamaModels() {
  return availableOllamaModels;
}

// Helper functions
function createPrompt(request: RecipeRequest): string {
  return `Create a detailed tropical juice recipe with the following requirements:
    
Main Fruit: ${request.fruit}
Style: ${request.style}
Additional Vegetables: ${request.vegetables || 'none'}
Dietary Restrictions: ${request.dietaryRestrictions || 'none'}

Please provide a recipe in this exact format:

# [Recipe Name] 🥤

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

Make it creative, delicious, and include tropical flavors. The recipe should be healthy and appealing.`;
}

function parseRecipeFromText(text: string): Recipe {
  // Simple parsing logic - you can enhance this
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
  
  return {
    title,
    ingredients,
    instructions,
    nutritionalBenefits,
    tips,
    prepTime,
    servings,
    emoji: '🥤'
  };
}

function getStyleBenefit(style: string): string {
  const benefits = {
    smoothie: 'Perfect for a creamy, satisfying treat',
    detox: 'Ideal for cleansing and detoxification',
    energy: 'Great pre-workout fuel',
    immunity: 'Supports immune system health',
    digestive: 'Promotes digestive wellness',
    beauty: 'Enhances skin and hair health'
  };
  
  return benefits[style as keyof typeof benefits] || 'Delicious and nutritious';
}
