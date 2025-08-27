// AI Configuration
// Add your API keys here for external AI services

export const AI_CONFIG = {
  // OpenAI Configuration
  OPENAI: {
    API_KEY: process.env.REACT_APP_OPENAI_API_KEY || '',
    MODEL: 'gpt-3.5-turbo',
    MAX_TOKENS: 800,
    TEMPERATURE: 0.8,
  },
  
  // Hugging Face Configuration
  HUGGING_FACE: {
    API_KEY: process.env.REACT_APP_HUGGING_FACE_API_KEY || '',
    MODEL: 'microsoft/DialoGPT-medium',
    MAX_LENGTH: 500,
    TEMPERATURE: 0.8,
  },
  
  // Local AI Configuration
  LOCAL: {
    ENABLED: true,
    FALLBACK: true,
  },
};

// Recipe generation prompts
export const RECIPE_PROMPTS = {
  SYSTEM_PROMPT: `You are a professional tropical juice recipe creator with expertise in nutrition, flavor combinations, and healthy living. Create detailed, healthy, and delicious recipes that are both appealing and practical.`,
  
  USER_PROMPT_TEMPLATE: `Create a detailed tropical juice recipe with the following requirements:
    
Main Fruit: {fruit}
Style: {style}
Additional Vegetables: {vegetables}
Dietary Restrictions: {dietaryRestrictions}

Please provide a recipe in this exact format:

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

Make it creative, delicious, and include tropical flavors. The recipe should be healthy and appealing.`,
};

// Available fruits and their properties
export const TROPICAL_FRUITS = {
  mango: { emoji: '🥭', benefits: ['Vitamin C', 'Vitamin A', 'Fiber'], sweetness: 'high' },
  pineapple: { emoji: '🍍', benefits: ['Bromelain', 'Vitamin C', 'Manganese'], sweetness: 'high' },
  passion_fruit: { emoji: '🫐', benefits: ['Vitamin C', 'Fiber', 'Antioxidants'], sweetness: 'medium' },
  dragon_fruit: { emoji: '🐉', benefits: ['Vitamin C', 'Iron', 'Magnesium'], sweetness: 'mild' },
  papaya: { emoji: '🧡', benefits: ['Papain', 'Vitamin C', 'Folate'], sweetness: 'medium' },
  guava: { emoji: '🍃', benefits: ['Vitamin C', 'Fiber', 'Lycopene'], sweetness: 'medium' },
  kiwi: { emoji: '🥝', benefits: ['Vitamin C', 'Vitamin K', 'Fiber'], sweetness: 'medium' },
  lychee: { emoji: '🌰', benefits: ['Vitamin C', 'Copper', 'Polyphenols'], sweetness: 'high' },
  rambutan: { emoji: '🦔', benefits: ['Vitamin C', 'Iron', 'Fiber'], sweetness: 'high' },
  mangosteen: { emoji: '💜', benefits: ['Xanthones', 'Vitamin C', 'Fiber'], sweetness: 'mild' },
};

// Juice styles and their characteristics
export const JUICE_STYLES = {
  smoothie: { emoji: '🥤', description: 'Creamy and satisfying', base: 'yogurt or milk' },
  detox: { emoji: '🌿', description: 'Cleansing and purifying', base: 'water or coconut water' },
  energy: { emoji: '⚡', description: 'Energizing and invigorating', base: 'coconut water or juice' },
  immunity: { emoji: '🛡️', description: 'Immune system support', base: 'water or herbal tea' },
  digestive: { emoji: '🌱', description: 'Digestive health support', base: 'water or aloe vera' },
  beauty: { emoji: '✨', description: 'Skin and hair health', base: 'water or coconut water' },
};
