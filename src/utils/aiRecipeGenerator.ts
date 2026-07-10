// AI Recipe Generator Utility
// This works client-side and can integrate with various AI services

import {
  generateRecipeWithOllama,
  checkOllamaAvailability,
  getAvailableModels,
  OLLAMA_MODELS,
  type OllamaRecipeRequest,
} from "./ollamaRecipeGenerator";

export interface RecipeRequest {
  fruit: string; // Primary fruit (for backward compatibility)
  fruits?: string[]; // Multiple fruits array
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

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a professional tropical juice recipe creator. Create detailed, healthy, and delicious recipes with exact formatting as requested.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 800,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error("OpenAI API request failed");
    }

    const data = await response.json();
    const recipeText = data.choices[0].message.content;

    const recipe = parseRecipeFromText(recipeText);
    return {
      ...recipe,
      model: "gpt-3.5-turbo",
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw error;
  }
}

export interface CustomAiConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
}

// Option 4: Custom OpenAI-compatible API (DeepSeek, Kimi, MiniMax, etc.)
export async function generateRecipeWithCustomProvider(
  request: RecipeRequest,
  config: CustomAiConfig
): Promise<Recipe> {
  const { baseUrl, apiKey, model } = config;
  try {
    const prompt = createPrompt(request);

    let url = baseUrl.trim();
    if (url.endsWith("/")) {
      url = url.slice(0, -1);
    }
    if (!url.endsWith("/chat/completions")) {
      url = `${url}/chat/completions`;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model || "custom-model",
        messages: [
          {
            role: "system",
            content:
              "You are a professional tropical juice recipe creator. Create detailed, healthy, and delicious recipes with exact formatting as requested.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 800,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error(`Custom AI API request failed with status: ${response.status}`);
    }

    const data = await response.json();
    const recipeText = data.choices?.[0]?.message?.content;
    if (!recipeText) {
      throw new Error("Invalid response format from Custom AI provider");
    }

    const recipe = parseRecipeFromText(recipeText);
    return {
      ...recipe,
      model: model || "custom-model",
    };
  } catch (error) {
    console.error("Custom AI API error:", error);
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
      "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
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
      throw new Error("Hugging Face API request failed");
    }

    const data = await response.json();
    const recipeText = data[0].generated_text;

    return parseRecipeFromText(recipeText);
  } catch (error) {
    console.error("Hugging Face API error:", error);
    throw error;
  }
}

// Option 3: Local AI generation (fallback)
export function generateRecipeLocally(request: RecipeRequest): Recipe {
  const { fruit, fruits, style, vegetables, dietaryRestrictions } = request;
  const selectedFruits = fruits && fruits.length > 0 ? fruits : [fruit];
  const primaryFruit = selectedFruits[0];
  const fruitList = selectedFruits.join(", ");

  // Generate creative recipe names - DYNAMIC system for maximum variety
  const fruitPrefixes = [
    "Tropical", "Island", "Sun-Kissed", "Golden", "Caribbean", "Pacific", 
    "Midnight", "Emerald", "Rainforest", "Whipped", "Velvet", "Prism",
    "Crystal", "Ocean", "Volcanic", "Coral", "Palm", "Jungle", "Citrus",
    "Sunrise", "Moonlit", "Starlight", "Aurora", "Tide", "Wave", "Breeze"
  ];
  
  const stylePrefixes = [
    "Sunrise", "Moonlit", "Starlight", "Twilight", "Dawn", "Dusk",
    "Crystal", "Ocean", "Volcanic", "Coral", "Palm", "Jungle", "Citrus",
    "Emerald", "Ruby", "Sapphire", "Amber", "Pearl", "Diamond", "Opal"
  ];
  
  const creativeWords = [
    "Paradise", "Oasis", "Dream", "Fusion", "Blend", "Serenade", "Breeze",
    "Twist", "Magic", "Elixir", "Wave", "Vibe", "Rush", "Glow", "Bloom",
    "Rush", "Pulse", "Spark", "Zen", "Chill", "Lux", "Kiss",
    "Burst", "Splash", "Drift", "Float", "Spin", "Flow", "Ripple"
  ];
  
  const nameStyles = [
    (s: string, f: string, fl: string, c: string) => `${s} ${fl} ${c}`,
    (s: string, f: string, fl: string, c: string) => `${f} ${s} ${c}`,
    (s: string, f: string, fl: string, c: string) => `${c} ${fl} ${s}`,
    (s: string, f: string, fl: string, c: string) => `${fl} ${c} ${s}`,
    (s: string, f: string, fl: string, c: string) => `${f} ${c} Paradise`,
    (s: string, f: string, fl: string, c: string) => `${c} ${f} Oasis`,
    (s: string, f: string, fl: string, c: string) => `${s} ${f} Dream`,
    (s: string, f: string, fl: string, c: string) => `${fl} ${c} Fusion`,
    (s: string, f: string, fl: string, c: string) => `${c} ${fl} Elixir`,
    (s: string, f: string, fl: string, c: string) => `${s} ${fl} Vibe`,
  ];
  
  // Randomly pick each component
  const prefix = fruitPrefixes[Math.floor(Math.random() * fruitPrefixes.length)];
  const styleWord = stylePrefixes[Math.floor(Math.random() * stylePrefixes.length)];
  const creative = creativeWords[Math.floor(Math.random() * creativeWords.length)];
  const nameFn = nameStyles[Math.floor(Math.random() * nameStyles.length)];
  
  const randomName = nameFn(style, primaryFruit, fruitList, creative);

  // Generate ingredients based on style and fruits - VARIED amounts
  const amountVariations = ["1", "1.5", "2", "2.5"];
  const amount1 = amountVariations[Math.floor(Math.random() * amountVariations.length)];
  const amount2 = (Math.random() * 0.5 + 0.25).toFixed(1);
  
  const baseIngredients = [
    selectedFruits.length === 1
      ? `${amount1} cups fresh ${primaryFruit}, chopped`
      : selectedFruits
          .map((f, i) => `${i === 0 ? amount1 : amount2} cups fresh ${f}, chopped`)
          .join("\n- "),
    `${Math.floor(Math.random() * 2 + 1)} cup ${["coconut water", "almond milk", "oat milk", "orange juice", "pineapple juice"][Math.floor(Math.random() * 5)]}`,
    `${(Math.random() * 0.5 + 0.25).toFixed(1)} cup ${["orange juice", "lemon juice", "lime juice", "grapefruit juice"][Math.floor(Math.random() * 4)]}`,
    `${(Math.random() * 2 + 0.5).toFixed(1)} tablespoon ${["honey", "maple syrup", "agave nectar", "stevia", "coconut sugar"][Math.floor(Math.random() * 5)]}`,
    "Ice cubes",
    `${["Mint leaves", "Basil leaves", "Cilantro", "Rosemary", "Lavender"][Math.floor(Math.random() * 5)]} for garnish`,
  ];

  if (vegetables && vegetables !== "none") {
    baseIngredients.splice(2, 0, `${Math.floor(Math.random() * 2 + 1)} cup ${vegetables}, chopped`);
  }

  // Add style-specific ingredients - EXPANDED
  const styleIngredients = {
    smoothie: [
      `${(Math.random() * 0.5 + 0.25).toFixed(1)} cup ${["Greek yogurt", "coconut yogurt", "almond yogurt", "silken tofu"][Math.floor(Math.random() * 4)]}`,
      `${["1/2", "3/4", "1"][Math.floor(Math.random() * 3)]} ${["banana", "frozen banana", "avocado", "mango chunks"][Math.floor(Math.random() * 4)]}`,
      `${(Math.random() * 1 + 0.5).toFixed(1)} tablespoon ${["peanut butter", "almond butter", "cashew butter", "sunflower seed butter"][Math.floor(Math.random() * 4)]}`,
    ],
    detox: [
      `${Math.floor(Math.random() * 3 + 1)} cup ${["spinach", "kale", "mixed greens", "arugula", "swiss chard"][Math.floor(Math.random() * 5)]}`,
      `${(Math.random() * 0.5 + 0.25).toFixed(1)} ${["lemon", "lime", "grapefruit"][Math.floor(Math.random() * 3)]}, juiced`,
      `${(Math.random() * 2 + 0.5).toFixed(1)} inch ${["ginger root", "turmeric root", "fresh mint", "cilantro"][Math.floor(Math.random() * 4)]}`,
      `${(Math.random() * 1 + 0.5).toFixed(1)} tablespoon ${["chia seeds", "flax seeds", "hemp seeds", "pumpkin seeds"][Math.floor(Math.random() * 4)]}`,
    ],
    energy: [
      `${(Math.random() * 0.75 + 0.25).toFixed(1)} cup ${["pomegranate seeds", "goji berries", "acai berries", "mulberries"][Math.floor(Math.random() * 4)]}`,
      `${(Math.random() * 2 + 0.5).toFixed(1)} tablespoon ${["chia seeds", "hemp seeds", "flax seeds", "sunflower seeds"][Math.floor(Math.random() * 4)]}`,
      `${(Math.random() * 1 + 0.5).toFixed(1)} tablespoon ${["cocoa nibs", "cacao powder", "espresso powder", "matcha powder"][Math.floor(Math.random() * 4)]}`,
      `${(Math.random() * 0.5 + 0.25).toFixed(1)} cup ${["oats", "quinoa", "millet", "buckwheat"][Math.floor(Math.random() * 4)]}`,
    ],
    immunity: [
      `${Math.floor(Math.random() * 2 + 1)} cup ${["kale", "spinach", "collard greens", "mustard greens"][Math.floor(Math.random() * 4)]}`,
      `${["1", "1.5", "2"][Math.floor(Math.random() * 3)]} ${["orange", "tangerine", "blood orange", "mandarin"][Math.floor(Math.random() * 4)]}, peeled`,
      `${(Math.random() * 2 + 0.5).toFixed(1)} inch ${["turmeric root", "ginger root", "fresh ginger"][Math.floor(Math.random() * 3)]}`,
      `${(Math.random() * 1 + 0.5).toFixed(1)} tablespoon ${["elderberry syrup", "propolis", "echinacea extract", "garlic-infused honey"][Math.floor(Math.random() * 4)]}`,
    ],
    digestive: [
      `${Math.floor(Math.random() * 2 + 1)} cup ${["cucumber", "zucchini", "celery", "fennel bulb"][Math.floor(Math.random() * 4)]}`,
      `${(Math.random() * 0.75 + 0.25).toFixed(1)} cup ${["aloe vera juice", "kombucha", "kefir", "coconut kefir"][Math.floor(Math.random() * 4)]}`,
      `${(Math.random() * 1 + 0.25).toFixed(1)} teaspoon ${["fennel seeds", "caraway seeds", "dill seeds", "cumin seeds"][Math.floor(Math.random() * 4)]}`,
      `${(Math.random() * 0.5 + 0.25).toFixed(1)} inch ${["fresh ginger", "mint leaves", "lemongrass"][Math.floor(Math.random() * 3)]}`,
    ],
    beauty: [
      `${Math.floor(Math.random() * 2 + 1)} cup ${["strawberries", "raspberries", "blackberries", "mixed berries"][Math.floor(Math.random() * 4)]}`,
      `${(Math.random() * 0.75 + 0.25).toFixed(1)} cup ${["blueberries", "goji berries", "acai", "blackcurrants"][Math.floor(Math.random() * 4)]}`,
      `${(Math.random() * 2 + 0.5).toFixed(1)} tablespoon ${["collagen peptides", "silicon powder", "biotin supplement", "vitamin E oil"][Math.floor(Math.random() * 4)]}`,
      `${(Math.random() * 0.5 + 0.25).toFixed(1)} ${["avocado", "coconut cream", "shea butter", "mango butter"][Math.floor(Math.random() * 4)]}`,
    ],
  };

  const additionalIngredients =
    styleIngredients[style as keyof typeof styleIngredients] || [];
  const allIngredients = [...baseIngredients, ...additionalIngredients];

  // Generate instructions - VARIED
  const instructionTemplates = [
    [
      "Wash and prepare all fruits and vegetables thoroughly",
      `Add ${fruitList}${
        vegetables && vegetables !== "none" ? `, ${vegetables}` : ""
      } and liquids to blender`,
      "Blend on high speed for 60-90 seconds until silky smooth",
      "Taste and adjust sweetness as needed",
      "Pour into a chilled glass and garnish creatively",
    ],
    [
      "Start by soaking any seeds or nuts for 5 minutes",
      `Combine ${fruitList} with your chosen liquid base`,
      `${vegetables && vegetables !== "none" ? `Fold in the ${vegetables}` : "Add leafy greens if desired"}`,
      "Process until completely smooth with no lumps",
      "Serve immediately over fresh ice",
    ],
    [
      "Prep all ingredients - wash, peel, and chop as needed",
      `Layer ${fruitList} in the blender for better blending`,
      `Add ${vegetables && vegetables !== "none" ? vegetables : "optional add-ins"} and blend`,
      "Add sweetener to taste and blend briefly",
      "Decorate with fresh herbs or sliced fruit",
    ],
    [
      "Begin with liquids at room temperature for better blending",
      `Add ${primaryFruit} first, then secondary fruits`,
      `Incorporate ${vegetables && vegetables !== "none" ? vegetables : "any vegetables"}`,
      "Blend until reaching desired consistency",
      "Top with your favorite garnishes",
    ],
  ];

  const instructions = instructionTemplates[Math.floor(Math.random() * instructionTemplates.length)];

  // Generate nutritional benefits - EXPANDED
  const benefitOptions = [
    [
      "Rich in vitamins A, C, and E for immune support",
      "Natural antioxidants from tropical fruits",
      "Hydrating and electrolyte-balancing",
      getStyleBenefit(style),
    ],
    [
      "Excellent source of dietary fiber for digestion",
      "Contains essential minerals like potassium and magnesium",
      "Low in calories but high in nutrients",
      getStyleBenefit(style),
    ],
    [
      "Boosts natural energy without caffeine crash",
      "Supports healthy metabolism and digestion",
      "Provides lasting hydration with coconut water",
      getStyleBenefit(style),
    ],
    [
      "Packed with polyphenols and flavonoids",
      "Supports cardiovascular health",
      "Promotes healthy skin from within",
      getStyleBenefit(style),
    ],
    [
      "High in vitamin C for collagen production",
      "Contains anti-inflammatory compounds",
      "Natural detoxifiers and alkalizers",
      getStyleBenefit(style),
    ],
  ];

  const benefits = benefitOptions[Math.floor(Math.random() * benefitOptions.length)];

  // Generate tips - EXPANDED
  const tipOptions = [
    [
      "Use frozen fruits for a colder, thicker consistency",
      "Add a pinch of sea salt to enhance all flavors",
      "Store in airtight container for up to 24 hours",
      "Best consumed within 30 minutes of making",
    ],
    [
      "For extra creaminess, add ripe avocado",
      "Protein boost: add a scoop of vanilla protein powder",
      "Pre-freeze banana chunks for ice cream texture",
      "Add cinnamon or nutmeg for warming notes",
    ],
    [
      "Organic produce recommended for best taste",
      "Room temperature fruits blend more smoothly",
      "Add ice last to prevent over-dilution",
      "Try coconut cream for richer mouthfeel",
    ],
    [
      "For more fiber, don't strain the mixture",
      "Fresh herbs add complex flavor profiles",
      "Citrus zest intensifies bright flavors",
      "Vanilla extract complements tropical fruits",
    ],
  ];

  const tips = tipOptions[Math.floor(Math.random() * tipOptions.length)];

  const emojiOptions = ["🥤", "🍹", "🧃", "🍓", "🥭", "🍍", "🥝", "🍑", "🫐", "🍊", "🍋", "🍌", "🌴", "🌺", "🫐", "🧉", "🍵", "🥛", "🍹", "🍶"];
  const randomEmoji = emojiOptions[Math.floor(Math.random() * emojiOptions.length)];
  
  // Random prep time between 3-10 minutes
  const prepTimes = ["3 minutes", "5 minutes", "7 minutes", "8 minutes", "10 minutes"];
  const randomPrep = prepTimes[Math.floor(Math.random() * prepTimes.length)];
  
  // Random servings
  const servingOptions = ["1 serving", "2 servings", "3 servings", "4 servings"];
  const randomServings = servingOptions[Math.floor(Math.random() * servingOptions.length)];

  return {
    title: randomName,
    ingredients: allIngredients,
    instructions,
    nutritionalBenefits: benefits,
    tips,
    prepTime: randomPrep,
    servings: randomServings,
    emoji: randomEmoji,
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
      console.log("Ollama available with models:", availableOllamaModels);
    }
  } catch (error) {
    console.log("Ollama not available:", error);
  }
}

// Initialize Ollama when module loads
initializeOllama();

// Option 1: Ollama (Local AI - FREE)
export async function generateRecipeWithOllamaLocal(
  request: RecipeRequest,
  model: string = "llama3.3:latest"
): Promise<Recipe> {
  try {
    if (!ollamaAvailable) {
      throw new Error("Ollama is not available");
    }

    const ollamaRequest: OllamaRecipeRequest = {
      fruit: request.fruit,
      style: request.style,
      vegetables: request.vegetables,
      dietaryRestrictions: request.dietaryRestrictions,
      model: model,
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
      generationTime: ollamaRecipe.generationTime,
    };
  } catch (error) {
    console.error("Ollama generation error:", error);
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
  const fruits =
    request.fruits && request.fruits.length > 0
      ? request.fruits.join(", ")
      : request.fruit;

  return `Create a detailed tropical juice recipe with the following requirements:
    
Main Fruits: ${fruits}
Style: ${request.style}
Additional Vegetables: ${request.vegetables || "none"}
Dietary Restrictions: ${request.dietaryRestrictions || "none"}

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
  const lines = text.split("\n").filter((line) => line.trim());

  let title = "Tropical Paradise Blend";
  let ingredients: string[] = [];
  let instructions: string[] = [];
  let nutritionalBenefits: string[] = [];
  let tips: string[] = [];
  let prepTime = "5 minutes";
  let servings = "2 servings";

  let currentSection = "";

  for (const line of lines) {
    if (line.startsWith("# ")) {
      title = line.replace("# ", "").replace(" 🥤", "");
    } else if (line.startsWith("## ")) {
      currentSection = line.replace("## ", "").toLowerCase();
    } else if (line.startsWith("- ")) {
      const item = line.replace("- ", "");
      switch (currentSection) {
        case "ingredients:":
          ingredients.push(item);
          break;
        case "nutritional benefits:":
          nutritionalBenefits.push(item);
          break;
        case "tips:":
          tips.push(item);
          break;
      }
    } else if (line.match(/^\d+\./)) {
      instructions.push(line);
    } else if (line.includes("Prep Time:")) {
      prepTime = line.split(":")[1]?.trim() || "5 minutes";
    } else if (line.includes("Servings:")) {
      servings = line.split(":")[1]?.trim() || "2 servings";
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
    emoji: "🥤",
  };
}

function getStyleBenefit(style: string): string {
  const benefits = {
    smoothie: "Perfect for a creamy, satisfying treat",
    detox: "Ideal for cleansing and detoxification",
    energy: "Great pre-workout fuel",
    immunity: "Supports immune system health",
    digestive: "Promotes digestive wellness",
    beauty: "Enhances skin and hair health",
  };

  return benefits[style as keyof typeof benefits] || "Delicious and nutritious";
}

// Option 5: Google Gemini API (requires Gemini API key)
export async function generateRecipeWithGemini(
  request: RecipeRequest,
  apiKey: string
): Promise<Recipe> {
  try {
    const prompt = createPrompt(request);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 1000,
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API request failed with status: ${response.status}`);
    }

    const data = await response.json();
    const recipeText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!recipeText) {
      throw new Error("Invalid response format from Gemini API");
    }

    const recipe = parseRecipeFromText(recipeText);
    return {
      ...recipe,
      model: "gemini-1.5-flash",
    };
  } catch (error) {
    console.error("Gemini API error:", error);
    throw error;
  }
}

// Chatbot assistant function
export async function chatWithCoco(
  messages: { role: string; content: string }[],
  service: string,
  apiKeys: { gemini?: string; openai?: string; customBaseUrl?: string; customApiKey?: string; customModel?: string }
): Promise<string> {
  const systemPrompt = `You are Coco, the friendly Tropical AI Chef. You help users design delicious tropical juices, smoothies, refreshers, and healthy boosters. 
Use tropical emojis (🥥, 🍍, 🥭, 🍹, 🌴, 🍋) frequently, keep your tone sunny, warm, and helpful.
Answer general healthy fruit nutrition questions, suggest combinations, and walk them through recipes.
CRITICAL: If the user explicitly asks for a recipe, you MUST generate a complete recipe and format it exactly inside your message as a markdown block starting with "# [Recipe Name] 🥤" followed by "## Ingredients:", "## Instructions:", "## Nutritional Benefits:", "## Tips:", "## Prep Time:", and "## Servings:" so our application can automatically render it as a premium recipe card!`;

  if (service === "gemini" && apiKeys.gemini) {
    try {
      // Map roles to gemini (user -> user, assistant/model -> model)
      const contents = messages.map(msg => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }]
      }));

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKeys.gemini}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents,
            systemInstruction: {
              parts: [{ text: systemPrompt }]
            },
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 800,
            }
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini Chat request failed: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process that. 🥥";
    } catch (e) {
      console.error("Gemini Chat error, falling back", e);
    }
  }

  // Fallback to OpenAI if configured
  if (service === "openai" && apiKeys.openai) {
    try {
      const formattedMessages = [
        { role: "system", content: systemPrompt },
        ...messages.map(m => ({ role: m.role === "model" ? "assistant" : m.role, content: m.content }))
      ];

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKeys.openai}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: formattedMessages,
          max_tokens: 800,
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that. 🥥";
      }
    } catch (e) {
      console.error("OpenAI Chat error", e);
    }
  }

  // Fallback to Custom Provider (e.g. DeepSeek) if configured
  if (service === "custom" && apiKeys.customApiKey && apiKeys.customBaseUrl) {
    try {
      const formattedMessages = [
        { role: "system", content: systemPrompt },
        ...messages.map(m => ({ role: m.role === "model" ? "assistant" : m.role, content: m.content }))
      ];

      let url = apiKeys.customBaseUrl.trim();
      if (url.endsWith("/")) url = url.slice(0, -1);
      if (!url.endsWith("/chat/completions")) url = `${url}/chat/completions`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKeys.customApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: apiKeys.customModel || "custom-model",
          messages: formattedMessages,
          max_tokens: 800,
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that. 🥥";
      }
    } catch (e) {
      console.error("Custom Chat error", e);
    }
  }

  // Local/Offline mock fallback response
  const lastUserMessage = messages[messages.length - 1]?.content.toLowerCase() || "";
  let responseText = "Hello! 🌴 I am Coco, your local Tropical AI Chef. ";

  if (lastUserMessage.includes("recipe") || lastUserMessage.includes("juice") || lastUserMessage.includes("smoothie") || lastUserMessage.includes("blend")) {
    const localRecipe = generateRecipeLocally({
      fruit: "Mango",
      fruits: ["Mango", "Pineapple"],
      style: "Smoothie",
      vegetables: "Ginger",
      dietaryRestrictions: "none"
    });
    responseText += `Here is a custom local recipe I whipped up for you! 🥭🍍\n\n` + 
      `# ${localRecipe.title} 🥤\n\n` + 
      `## Ingredients:\n${localRecipe.ingredients.map(i => `- ${i}`).join("\n")}\n\n` +
      `## Instructions:\n${localRecipe.instructions.map((ins, idx) => `${idx + 1}. ${ins}`).join("\n")}\n\n` +
      `## Nutritional Benefits:\n${localRecipe.nutritionalBenefits.map(b => `- ${b}`).join("\n")}\n\n` +
      `## Tips:\n${localRecipe.tips.map(t => `- ${t}`).join("\n")}\n\n` +
      `## Prep Time: ${localRecipe.prepTime}\n` +
      `## Servings: ${localRecipe.servings}`;
  } else if (lastUserMessage.includes("benefit") || lastUserMessage.includes("health") || lastUserMessage.includes("nutrition")) {
    responseText += "Tropical fruits like Mangoes are rich in Vitamin C, Pineapples contain bromelain which helps digestion, and Dragon Fruits are high in fiber and prebiotics. Eating them fresh boosts your immunity and keeps you hydrated! 🥭🍍🌴";
  } else if (lastUserMessage.includes("hello") || lastUserMessage.includes("hi")) {
    responseText += "Aloha! How can I help you blend something delicious today? You can ask me to write a recipe (e.g., 'give me a green mango smoothie') or ask about fruit benefits! 🥥🍹";
  } else {
    responseText += "I love anything tropical! Tell me what ingredients you have (like mangoes, pineapple, spinach, or ginger) and I can suggest a delicious smoothie, fresh juice, or detox blend for you! 🥥🍍";
  }

  return responseText;
}
