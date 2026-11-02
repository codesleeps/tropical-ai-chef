import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ChefHat,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Zap,
  Shield,
  Settings,
} from "lucide-react";
import { RecipeGenerationLoader } from "@/components/LoadingStates";
import { useErrorHandler } from "@/hooks/use-error-handler";
import { useSecureForm } from "@/hooks/use-security";
import { useAnalytics, usePerformanceTracking } from "@/hooks/use-analytics";
import { toast } from "sonner";
import {
  generateRecipeWithOpenAI,
  generateRecipeLocally,
  generateRecipeWithCustomProvider,
  generateRecipeWithGemini,
  parseRecipeFromText,
  type RecipeRequest,
  type Recipe,
} from "@/utils/aiRecipeGenerator";
import { chefAiRecipe, isChefAiConfigured } from "@/utils/chefAi";
import { ADD_IN_CATEGORIES, SMOOTHIE_ADD_INS } from "@/data/smoothieAddins";
import {
  generateRecipeWithOllama,
  checkOllamaAvailability,
  getAvailableModels,
  OLLAMA_MODELS,
} from "@/utils/ollamaRecipeGenerator";
import { env, hasOpenAIKey, hasGeminiKey } from "@/config/environment";
import { Mic } from "lucide-react";
import { getSpeechRecognition } from "@/utils/speechRecognition";

interface RecipeGeneratorProps {
  onRecipeGenerated: (recipe: string) => void;
}

type GenerationService = "chef" | "local" | "ollama" | "openai" | "gemini" | "custom";

const TROPICAL_FRUITS = [
  { id: "mango", name: "Mango", emoji: "🥭", color: "bg-orange-100" },
  { id: "pineapple", name: "Pineapple", emoji: "🍍", color: "bg-yellow-100" },
  {
    id: "passion-fruit",
    name: "Passion Fruit",
    emoji: "🟣",
    color: "bg-purple-100",
  },
  {
    id: "dragon-fruit",
    name: "Dragon Fruit",
    emoji: "🐲",
    color: "bg-pink-100",
  },
  { id: "papaya", name: "Papaya", emoji: "🧡", color: "bg-orange-100" },
  { id: "guava", name: "Guava", emoji: "🟢", color: "bg-green-100" },
  { id: "kiwi", name: "Kiwi", emoji: "🥝", color: "bg-green-100" },
  { id: "banana", name: "Banana", emoji: "🍌", color: "bg-yellow-100" },
  { id: "blueberries", name: "Blueberries", emoji: "🫐", color: "bg-blue-100" },
  { id: "pear", name: "Pear", emoji: "🍐", color: "bg-green-100" },
  { id: "coconut", name: "Coconut", emoji: "🥥", color: "bg-white" },
];

const JUICE_STYLES = [
  "Smoothie",
  "Fresh Juice",
  "Detox",
  "Energy Boost",
  "Immunity",
  "Digestive",
  "Beauty",
  "Recovery",
  "Weight Loss",
  "Hydrating",
];

const VEGETABLES = [
  { id: "spinach", name: "Spinach", emoji: "🥬", color: "bg-green-100" },
  { id: "kale", name: "Kale", emoji: "🥬", color: "bg-green-100" },
  { id: "cucumber", name: "Cucumber", emoji: "🥒", color: "bg-green-100" },
  { id: "celery", name: "Celery", emoji: "🥬", color: "bg-green-100" },
  { id: "carrot", name: "Carrot", emoji: "🥕", color: "bg-orange-100" },
  { id: "beetroot", name: "Beetroot", emoji: "🟣", color: "bg-purple-100" },
  { id: "ginger", name: "Ginger", emoji: "🟤", color: "bg-yellow-100" },
  { id: "turmeric", name: "Turmeric", emoji: "🟡", color: "bg-yellow-100" },
  { id: "mint", name: "Mint", emoji: "🌿", color: "bg-green-100" },
  { id: "parsley", name: "Parsley", emoji: "🌿", color: "bg-green-100" },
];

const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {
      console.warn("localStorage not available:", e);
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn("localStorage not available:", e);
    }
  }
};

export const RecipeGenerator = ({
  onRecipeGenerated,
}: RecipeGeneratorProps) => {
  const [formData, setFormData] = useState<RecipeRequest>({
    fruit: "",
    style: "",
    vegetables: "none",
    dietaryRestrictions: "",
  });

  const [selectedFruits, setSelectedFruits] = useState<string[]>([]);
  const [selectedVegetables, setSelectedVegetables] = useState<string[]>([]);
  const [selectedAddIns, setSelectedAddIns] = useState<string[]>([]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [availableServices, setAvailableServices] = useState<
    GenerationService[]
  >(isChefAiConfigured() ? ["chef", "local", "custom"] : ["local", "custom"]);
  const [selectedService, setSelectedService] =
    useState<GenerationService>("local");
  const [ollamaModels, setOllamaModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [customBaseUrl, setCustomBaseUrl] = useState<string>(
    () => safeLocalStorage.getItem("custom_ai_base_url") || env.customAiBaseUrl || "https://api.deepseek.com/v1"
  );
  const [customApiKey, setCustomApiKey] = useState<string>(
    () => safeLocalStorage.getItem("custom_ai_key") || env.customAiApiKey || ""
  );
  const [customModel, setCustomModel] = useState<string>(
    () => safeLocalStorage.getItem("custom_ai_model") || env.customAiModel || "deepseek-chat"
  );
  const [retryCount, setRetryCount] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    safeLocalStorage.setItem("custom_ai_base_url", customBaseUrl);
  }, [customBaseUrl]);

  useEffect(() => {
    safeLocalStorage.setItem("custom_ai_key", customApiKey);
  }, [customApiKey]);

  useEffect(() => {
    safeLocalStorage.setItem("custom_ai_model", customModel);
  }, [customModel]);

  const { handleError, handleApiError } = useErrorHandler();
  const { validateField, formErrors, checkRateLimit } = useSecureForm(
    "recipe-generator"
  );
  const { trackRecipeGeneration, trackEngagement } = useAnalytics();
  const { measureFunction } = usePerformanceTracking();

  // Healthy add-ins picked from the Scout research set
  const selectedAddInData = SMOOTHIE_ADD_INS.filter((a) => selectedAddIns.includes(a.id));
  const addInPayload = selectedAddInData.map((a) => `${a.name} - ${a.dose}`);
  const selectedAddInDoses = selectedAddInData.map((a) => `${a.name}: ${a.dose}`);
  const selectedAddInCautions = selectedAddInData
    .map((a) => a.cautions)
    .filter((c): c is string => Boolean(c));

  const toggleAddIn = (id: string) => {
    setSelectedAddIns((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Check available services on component mount
  const checkAvailableServices = useCallback(async () => {
    const services: GenerationService[] = ["local", "custom"]; // Always available

    // Server-side AI proxy (Supabase Edge Function) - no key in the bundle
    if (isChefAiConfigured()) {
      services.unshift("chef");
    }

    // Check OpenAI availability
    if (hasOpenAIKey()) {
      services.push("openai");
    }

    // Check Gemini availability
    if (hasGeminiKey()) {
      services.push("gemini");
    }

    // Check Ollama availability
    try {
      const isOllamaAvailable = await checkOllamaAvailability();
      if (isOllamaAvailable) {
        services.push("ollama");
        const models = await getAvailableModels();
        setOllamaModels(models);
        if (models.length > 0) {
          setSelectedModel(models[0]);
        }
      }
    } catch (error) {
      console.log("Ollama not available:", error);
    }

    setAvailableServices(services);

    // Set default service preference
    if (services.includes("chef")) {
      setSelectedService("chef");
    } else if (services.includes("gemini")) {
      setSelectedService("gemini");
    } else if (services.includes("openai")) {
      setSelectedService("openai");
    } else if (services.includes("ollama")) {
      setSelectedService("ollama");
    } else if (services.includes("custom") && safeLocalStorage.getItem("custom_ai_key")) {
      setSelectedService("custom");
    } else {
      setSelectedService("local");
    }
  }, []);

  // Initialize on component mount
  useState(() => {
    checkAvailableServices();
  });

  const handleVoiceCommand = () => {
    const SpeechRecognition = getSpeechRecognition();

    if (!SpeechRecognition) {
      toast.error("Voice search is not supported in this browser. Please try Chrome or Safari! 🎙️");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      toast.info("Listening... Tell me your tropical preferences! 🎙️", { id: "voice-listen" });
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error("Voice recognition failed. Please try again! 🎙️", { id: "voice-listen" });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      toast.success(`Transcribed: "${transcript}" 🍍`, { id: "voice-listen" });

      // Automatically search for fruit names in transcription and select them!
      const foundFruits: string[] = [];
      TROPICAL_FRUITS.forEach((f) => {
        if (transcript.toLowerCase().includes(f.name.toLowerCase()) || 
            transcript.toLowerCase().includes(f.id.toLowerCase())) {
          foundFruits.push(f.name);
        }
      });

      if (foundFruits.length > 0) {
        setSelectedFruits((prev) => {
          const combined = Array.from(new Set([...prev, ...foundFruits])).slice(0, 5);
          return combined;
        });
        setFormData((prev) => ({
          ...prev,
          fruit: foundFruits[0]
        }));
      }

      // Automatically select style if mentioned
      const styles = ["smoothie", "juice", "detox", "energy", "immunity", "digestive", "beauty", "recovery", "hydrating"];
      const foundStyle = styles.find((s) => transcript.toLowerCase().includes(s));
      if (foundStyle) {
        let styleDisplay = "Smoothie";
        if (foundStyle === "juice") styleDisplay = "Fresh Juice";
        else if (foundStyle === "detox") styleDisplay = "Detox";
        else if (foundStyle === "energy") styleDisplay = "Energy Boost";
        else if (foundStyle === "immunity") styleDisplay = "Immunity";
        else if (foundStyle === "digestive") styleDisplay = "Digestive";
        else if (foundStyle === "beauty") styleDisplay = "Beauty";
        else if (foundStyle === "recovery") styleDisplay = "Recovery";
        else if (foundStyle === "hydrating") styleDisplay = "Hydrating";

        setFormData((prev) => ({ ...prev, style: styleDisplay }));
      }

      // Add everything else to dietary restrictions / preferences!
      setFormData((prev) => {
        const existing = prev.dietaryRestrictions ? prev.dietaryRestrictions + ", " : "";
        return {
          ...prev,
          dietaryRestrictions: existing + transcript
        };
      });
    };

    recognition.start();
  };

  const validateForm = (): boolean => {
    if (selectedFruits.length === 0 || !formData.style) {
      toast.error(
        "Please select at least one fruit and a style for your recipe"
      );
      return false;
    }

    // Validate dietary restrictions input if provided
    if (formData.dietaryRestrictions.trim()) {
      const isValid = validateField(
        "dietaryRestrictions",
        formData.dietaryRestrictions,
        "recipe"
      );
      if (!isValid) {
        toast.error("Please check your dietary restrictions input");
        return false;
      }
    }

    return true;
  };

  const generateWithFallback = async (
    request: RecipeRequest
  ): Promise<Recipe> => {
    const errors: Error[] = [];

    // Clean the request - convert "none" to empty string for vegetables
    const cleanRequest = {
      ...request,
      fruits: selectedFruits.length > 0 ? selectedFruits : [request.fruit],
      vegetables: request.vegetables === "none" ? "" : request.vegetables,
    };

    // Try primary service first
    try {
      switch (selectedService) {
        case "chef": {
          const markdown = await chefAiRecipe({
            fruit: cleanRequest.fruit,
            fruits: cleanRequest.fruits,
            style: cleanRequest.style,
            vegetables: cleanRequest.vegetables,
            addIns: cleanRequest.addIns,
            dietaryRestrictions: cleanRequest.dietaryRestrictions,
          });
          return { ...parseRecipeFromText(markdown), model: "deepseek-chat" };
        }

        case "openai":
          if (!hasOpenAIKey()) {
            throw new Error("OpenAI API key not configured");
          }
          return await generateRecipeWithOpenAI(
            cleanRequest,
            env.openaiApiKey!
          );

        case "gemini":
          if (!hasGeminiKey()) {
            throw new Error("Gemini API key not configured");
          }
          return await generateRecipeWithGemini(
            cleanRequest,
            env.geminiApiKey!
          );

        case "custom":
          if (!customApiKey || !customBaseUrl) {
            throw new Error("Custom AI configuration is incomplete. Base URL and API Key are required.");
          }
          return await generateRecipeWithCustomProvider(
            cleanRequest,
            {
              baseUrl: customBaseUrl,
              apiKey: customApiKey,
              model: customModel,
            }
          );

        case "ollama":
          if (!selectedModel) {
            throw new Error("No Ollama model selected");
          }
          return await generateRecipeWithOllama({
            ...cleanRequest,
            model: selectedModel,
          });

        case "local":
        default:
          return generateRecipeLocally(cleanRequest);
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      errors.push(err);

      handleApiError(err, selectedService);

      // Try fallback services
      const fallbackServices = availableServices.filter(
        (s) => s !== selectedService
      );

      for (const fallbackService of fallbackServices) {
        try {
          toast.info(`Trying ${fallbackService} as fallback...`);

          switch (fallbackService) {
            case "chef":
              if (isChefAiConfigured()) {
                const markdown = await chefAiRecipe({
                  fruit: cleanRequest.fruit,
                  fruits: cleanRequest.fruits,
                  style: cleanRequest.style,
                  vegetables: cleanRequest.vegetables,
                  addIns: cleanRequest.addIns,
            dietaryRestrictions: cleanRequest.dietaryRestrictions,
                });
                return { ...parseRecipeFromText(markdown), model: "deepseek-chat" };
              }
              break;

            case "local":
              return generateRecipeLocally(cleanRequest);

            case "ollama":
              if (ollamaModels.length > 0) {
                return await generateRecipeWithOllama({
                  ...cleanRequest,
                  model: ollamaModels[0],
                });
              }
              break;

            case "openai":
              if (hasOpenAIKey()) {
                return await generateRecipeWithOpenAI(
                  cleanRequest,
                  env.openaiApiKey!
                );
              }
              break;

            case "gemini":
              if (hasGeminiKey()) {
                return await generateRecipeWithGemini(
                  cleanRequest,
                  env.geminiApiKey!
                );
              }
              break;

            case "custom":
              if (customApiKey && customBaseUrl) {
                return await generateRecipeWithCustomProvider(
                  cleanRequest,
                  {
                    baseUrl: customBaseUrl,
                    apiKey: customApiKey,
                    model: customModel,
                  }
                );
              }
              break;
          }
        } catch (fallbackError) {
          const fallbackErr =
            fallbackError instanceof Error
              ? fallbackError
              : new Error(String(fallbackError));
          errors.push(fallbackErr);
          console.warn(`Fallback ${fallbackService} failed:`, fallbackErr);
        }
      }

      // If all services fail, throw the original error
      throw errors[0];
    }
  };

  const formatRecipeForDisplay = (recipe: Recipe): string => {
    return `# ${recipe.title} ${recipe.emoji}

## Ingredients:
${recipe.ingredients.map((ingredient) => `- ${ingredient}`).join("\n")}

## Instructions:
${recipe.instructions
  .map((instruction, index) => `${index + 1}. ${instruction}`)
  .join("\n")}

## Nutritional Benefits:
${recipe.nutritionalBenefits.map((benefit) => `- ${benefit}`).join("\n")}

## Tips:
${recipe.tips.map((tip) => `- ${tip}`).join("\n")}

**Prep Time:** ${recipe.prepTime}  
**Servings:** ${recipe.servings}

${recipe.model ? `*Generated with ${recipe.model}*` : ""}
${recipe.generationTime ? ` *in ${recipe.generationTime}ms*` : ""}`;
  };



  const handleGenerateRecipe = async () => {
    if (!validateForm()) return;

    // Security: Check rate limiting before proceeding
    if (!checkRateLimit("recipe_generation")) {
      return;
    }

    setIsGenerating(true);
    setLastError(null);

    const request: RecipeRequest = {
      ...formData,
      fruit: selectedFruits[0] || formData.fruit,
      fruits: selectedFruits,
      addIns: addInPayload.length > 0 ? addInPayload : undefined,
      vegetables:
        selectedVegetables.length > 0
          ? selectedVegetables.join(", ")
          : formData.vegetables,
    };

    const startedAt = Date.now();

    try {
      const recipe = await measureFunction("recipe_generation", () =>
        generateWithFallback(request)
      );

      const formatted = formatRecipeForDisplay({
        ...recipe,
        generationTime: recipe.generationTime ?? Date.now() - startedAt,
      });

      onRecipeGenerated(formatted);
      setRetryCount(0);
      toast.success("Your tropical recipe is ready! 🥤🌴");

      trackRecipeGeneration({
        fruit: request.fruits?.join(", ") || request.fruit,
        style: request.style,
        service: selectedService,
        success: true,
        duration: Date.now() - startedAt,
      });
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));

      handleError(err, { context: "recipe_generation", severity: "medium" });
      setLastError(
        err.message || "Failed to generate recipe. Please try again."
      );
      setRetryCount((count) => count + 1);

      trackRecipeGeneration({
        fruit: request.fruits?.join(", ") || request.fruit,
        style: request.style,
        service: selectedService,
        success: false,
        duration: Date.now() - startedAt,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRetryGeneration = () => {
    if (retryCount < 3) {
      handleGenerateRecipe();
    } else {
      toast.error(
        "Maximum retry attempts reached. Please try again later or contact support."
      );
    }
  };

  const getServiceDisplayName = (service: GenerationService): string => {
    switch (service) {
      case "chef":
        return "Chef AI (DeepSeek)";
      case "openai":
        return "OpenAI GPT";
      case "gemini":
        return "Google Gemini 1.5 Flash";
      case "ollama":
        return `Ollama ${selectedModel ? `(${selectedModel})` : ""}`;
      case "local":
        return "Local AI";
      case "custom":
        return `Custom API (${customModel || "OpenAI-compatible"})`;
      default:
        return service;
    }
  };

  const getServiceDescription = (service: GenerationService): string => {
    switch (service) {
      case "chef":
        return "Real AI recipes, generated securely on our server";
      case "openai":
        return "Premium AI with highest quality results";
      case "gemini":
        return "Google's ultra-fast multimodal AI model";
      case "ollama":
        return "Local AI models for privacy and speed";
      case "local":
        return "Built-in recipe logic (always available)";
      case "custom":
        return "Use DeepSeek, Moonshot/Kimi, MiniMax, or any OpenAI-compatible API";
      default:
        return "";
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-tropical">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold gradient-fresh bg-clip-text text-transparent flex items-center gap-2 justify-center">
          <ChefHat className="w-8 h-8" />
          AI Recipe Generator
        </CardTitle>
        <CardDescription className="text-lg">
          Create your perfect tropical juice recipe with AI assistance
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Error Display */}
        {lastError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{lastError}</span>
              {retryCount < 3 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetryGeneration}
                  disabled={isGenerating}
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Retry ({retryCount + 1}/3)
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Form Fields */}
        <div className="space-y-8">
          {/* AI Service Selection */}
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                AI Service
              </h3>
              <p className="text-sm text-muted-foreground">
                Select the AI service to generate your recipe
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {availableServices.map((service) => (
                <Badge
                  key={service}
                  variant={selectedService === service ? "default" : "outline"}
                  className={`cursor-pointer transition-all hover:scale-105 px-4 py-2 text-sm ${
                    selectedService === service
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:bg-accent"
                  }`}
                  onClick={() => {
                    setSelectedService(service);
                    trackEngagement("ai_service_selected", {
                      service,
                      previous_service: selectedService,
                      available_services: availableServices.length,
                    });
                  }}
                >
                  {service === "openai" && <Zap className="w-3 h-3 mr-1" />}
                  {service === "ollama" && (
                    <Sparkles className="w-3 h-3 mr-1" />
                  )}
                  {service === "local" && <ChefHat className="w-3 h-3 mr-1" />}
                  {service === "custom" && <Settings className="w-3 h-3 mr-1" />}
                  {getServiceDisplayName(service)}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {getServiceDescription(selectedService)}
            </p>
          </div>

          {/* Ollama Model Selection */}
          {selectedService === "ollama" && ollamaModels.length > 0 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Select Ollama Model
                </h3>
                <p className="text-sm text-muted-foreground">
                  Choose the AI model for recipe generation
                </p>
              </div>
              <div className="max-w-md mx-auto">
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an Ollama model" />
                  </SelectTrigger>
                  <SelectContent>
                    {ollamaModels.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                        {OLLAMA_MODELS[model as keyof typeof OLLAMA_MODELS] && (
                          <span className="text-xs text-muted-foreground ml-2">
                            (
                            {
                              OLLAMA_MODELS[model as keyof typeof OLLAMA_MODELS]
                                .size
                            }
                            )
                          </span>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Custom API Configuration */}
          {selectedService === "custom" && (
            <Card className="max-w-md mx-auto border-dashed border-2 border-primary/40 bg-accent/10 shadow-sm">
              <CardHeader className="pb-3 text-center">
                <CardTitle className="text-lg flex items-center justify-center gap-2 font-semibold">
                  <Settings className="w-5 h-5 text-primary animate-spin-slow" />
                  Custom AI Settings
                </CardTitle>
                <CardDescription>
                  Configure any OpenAI-compatible API (DeepSeek, Kimi, MiniMax, etc.)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customBaseUrl" className="text-sm font-medium">API Base URL</Label>
                  <Input
                    id="customBaseUrl"
                    placeholder="https://api.deepseek.com/v1"
                    value={customBaseUrl}
                    onChange={(e) => setCustomBaseUrl(e.target.value)}
                    className="h-9"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs h-7 px-2 hover:bg-primary/10 hover:text-primary transition-colors"
                      onClick={() => {
                        setCustomBaseUrl("https://api.deepseek.com/v1");
                        setCustomModel("deepseek-chat");
                      }}
                    >
                      DeepSeek
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs h-7 px-2 hover:bg-primary/10 hover:text-primary transition-colors"
                      onClick={() => {
                        setCustomBaseUrl("https://api.moonshot.cn/v1");
                        setCustomModel("moonshot-v1-8k");
                      }}
                    >
                      Kimi
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs h-7 px-2 hover:bg-primary/10 hover:text-primary transition-colors"
                      onClick={() => {
                        setCustomBaseUrl("https://api.minimax.chat/v1");
                        setCustomModel("abab6.5-chat");
                      }}
                    >
                      MiniMax
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customApiKey" className="text-sm font-medium">API Key</Label>
                  <Input
                    id="customApiKey"
                    type="password"
                    placeholder={customApiKey ? "••••••••••••••••" : "Enter API Key"}
                    value={customApiKey}
                    onChange={(e) => setCustomApiKey(e.target.value)}
                    className="h-9"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customModel" className="text-sm font-medium">Model Name</Label>
                  <Input
                    id="customModel"
                    placeholder="deepseek-chat"
                    value={customModel}
                    onChange={(e) => setCustomModel(e.target.value)}
                    className="h-9"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ingredients */}
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                Ingredients
              </h3>
              <p className="text-sm text-muted-foreground">
                Select your primary ingredients and style preferences
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-base font-medium">
                  Tropical Fruits * (Select up to 5)
                </Label>
                <p className="text-sm text-muted-foreground mb-3">
                  {selectedFruits.length}/5 selected
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {TROPICAL_FRUITS.map((fruit) => {
                    const isSelected = selectedFruits.includes(fruit.name);
                    const canSelect = selectedFruits.length < 5 || isSelected;

                    return (
                      <div
                        key={fruit.id}
                        onClick={() => {
                          if (!canSelect && !isSelected) return;

                          let newSelected;
                          if (isSelected) {
                            // Remove from selection
                            newSelected = selectedFruits.filter(
                              (f) => f !== fruit.name
                            );
                          } else {
                            // Add to selection
                            newSelected = [...selectedFruits, fruit.name];
                          }

                          setSelectedFruits(newSelected);
                          // Update formData.fruit with primary fruit (first selected)
                          setFormData((prev) => ({
                            ...prev,
                            fruit: newSelected.length > 0 ? newSelected[0] : "",
                          }));

                          trackEngagement("ingredient_selected", {
                            type: "fruit",
                            value: fruit.name,
                            total_selected: newSelected.length,
                            step: 1,
                          });
                        }}
                        className={`cursor-pointer rounded-xl p-4 text-center transition-all duration-200 hover:scale-105 border-2 relative ${
                          isSelected
                            ? "border-primary bg-primary/10 shadow-lg"
                            : canSelect
                            ? "border-border bg-card hover:border-primary/50"
                            : "border-border bg-card opacity-50 cursor-not-allowed"
                        } ${fruit.color}`}
                      >
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                            {selectedFruits.indexOf(fruit.name) + 1}
                          </div>
                        )}
                        <div className="text-3xl mb-2">{fruit.emoji}</div>
                        <div className="text-sm font-medium text-foreground">
                          {fruit.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="style" className="text-base font-medium">
                  Juice Style *
                </Label>
                <Select
                  value={formData.style}
                  onValueChange={(value) => {
                    setFormData((prev) => ({ ...prev, style: value }));
                    trackEngagement("recipe_style_selected", {
                      style: value,
                      step: 2,
                    });
                  }}
                >
                  <SelectTrigger id="style" className="h-12" aria-label="Juice Style">
                    <SelectValue placeholder="🥤 Select your style" />
                  </SelectTrigger>
                  <SelectContent>
                    {JUICE_STYLES.map((style) => (
                      <SelectItem key={style} value={style}>
                        {style}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Additions */}
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                Additions
              </h3>
              <p className="text-sm text-muted-foreground">
                Enhance your recipe with vegetables and dietary preferences
              </p>
            </div>

            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="space-y-4">
                <Label className="text-base font-medium">
                  Additional Vegetables (Select up to 5)
                </Label>
                <p className="text-sm text-muted-foreground mb-3">
                  {selectedVegetables.length}/5 selected
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  <div
                    onClick={() => {
                      setSelectedVegetables([]);
                      setFormData((prev) => ({ ...prev, vegetables: "none" }));
                    }}
                    className={`cursor-pointer rounded-xl p-3 text-center transition-all duration-200 hover:scale-105 border-2 ${
                      selectedVegetables.length === 0
                        ? "border-primary bg-primary/10 shadow-lg"
                        : "border-border bg-card hover:border-primary/50"
                    }`}
                  >
                    <div className="text-2xl mb-1">🚫</div>
                    <div className="text-xs font-medium text-foreground">
                      None
                    </div>
                  </div>
                  {VEGETABLES.map((vegetable) => {
                    const isSelected = selectedVegetables.includes(
                      vegetable.name
                    );
                    const canSelect =
                      selectedVegetables.length < 5 || isSelected;

                    return (
                      <div
                        key={vegetable.id}
                        onClick={() => {
                          if (!canSelect && !isSelected) return;

                          let newSelected;
                          if (isSelected) {
                            // Remove from selection
                            newSelected = selectedVegetables.filter(
                              (v) => v !== vegetable.name
                            );
                          } else {
                            // Add to selection
                            newSelected = [
                              ...selectedVegetables,
                              vegetable.name,
                            ];
                          }

                          setSelectedVegetables(newSelected);
                          // Update formData.vegetables with comma-separated list
                          setFormData((prev) => ({
                            ...prev,
                            vegetables:
                              newSelected.length > 0
                                ? newSelected.join(", ")
                                : "none",
                          }));
                        }}
                        className={`cursor-pointer rounded-xl p-3 text-center transition-all duration-200 hover:scale-105 border-2 relative ${
                          isSelected
                            ? "border-primary bg-primary/10 shadow-lg"
                            : canSelect
                            ? "border-border bg-card hover:border-primary/50"
                            : "border-border bg-card opacity-50 cursor-not-allowed"
                        } ${vegetable.color}`}
                      >
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                            {selectedVegetables.indexOf(vegetable.name) + 1}
                          </div>
                        )}
                        <div className="text-2xl mb-1">{vegetable.emoji}</div>
                        <div className="text-xs font-medium text-foreground">
                          {vegetable.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Healthy add-ins - sourced from the Scout research brief (2026-11-02) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Healthy Add-ins (optional)</Label>
                  <span className="text-xs text-muted-foreground">
                    {selectedAddIns.length} selected
                  </span>
                </div>
                {ADD_IN_CATEGORIES.map((category) => {
                  const items = SMOOTHIE_ADD_INS.filter((a) => a.category === category.id);
                  if (items.length === 0) return null;
                  return (
                    <div key={category.id} className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <span>{category.emoji}</span>
                        <span>{category.label}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {items.map((addIn) => {
                          const isSelected = selectedAddIns.includes(addIn.id);
                          return (
                            <button
                              key={addIn.id}
                              type="button"
                              onClick={() => toggleAddIn(addIn.id)}
                              aria-pressed={isSelected}
                              title={`${addIn.rationale} - ${addIn.dose}`}
                              className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-all ${category.color} ${
                                isSelected
                                  ? "border-primary font-medium text-foreground ring-1 ring-primary/40"
                                  : "border-transparent hover:border-primary/50"
                              }`}
                            >
                              <span>{addIn.emoji}</span>
                              <span>{addIn.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                {selectedAddInCautions.length > 0 && (
                  <div className="space-y-1 rounded-lg border border-amber-300 bg-amber-50 p-2.5 text-xs text-amber-900">
                    <div className="font-medium">Watch-outs for your selection</div>
                    <ul className="list-disc space-y-0.5 pl-4">
                      {selectedAddInCautions.map((caution, idx) => (
                        <li key={idx}>{caution}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {selectedAddInDoses.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {selectedAddInDoses.join(" · ")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dietary" className="text-base font-medium">
                    Dietary Restrictions & Preferences
                  </Label>
                  <Button
                    type="button"
                    variant={isListening ? "destructive" : "outline"}
                    size="sm"
                    className={`h-8 px-2.5 rounded-full flex items-center gap-1.5 transition-all ${
                      isListening ? "animate-pulse" : ""
                    }`}
                    onClick={handleVoiceCommand}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span className="text-xs">{isListening ? "Listening..." : "Speak"}</span>
                  </Button>
                </div>
                <Textarea
                  id="dietary"
                  placeholder="💡 e.g., vegan, gluten-free, low sugar, keto-friendly, high protein..."
                  value={formData.dietaryRestrictions}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      dietaryRestrictions: newValue,
                    }));

                    if (newValue.trim()) {
                      validateField("dietaryRestrictions", newValue, "recipe");
                    }
                  }}
                  className={`min-h-20 ${
                    formErrors.dietaryRestrictions?.length > 0
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }`}
                />
                {formErrors.dietaryRestrictions?.length > 0 && (
                  <div className="text-sm text-red-600">
                    {formErrors.dietaryRestrictions.map((error, idx) => (
                      <p key={idx}>{error}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Generate Recipe Section */}
        <div className="space-y-6 pt-6 border-t border-border">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              Generate Your Recipe
            </h3>
            <p className="text-sm text-muted-foreground">
              {selectedFruits.length > 0 && formData.style
                ? `Ready to create your ${selectedFruits.join(", ")} ${
                    formData.style
                  }!`
                : "Select at least one fruit and style to get started"}
            </p>
          </div>

          {isGenerating ? (
            <div className="space-y-4">
              <RecipeGenerationLoader
                aiService={getServiceDisplayName(selectedService)}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <Button
                onClick={handleGenerateRecipe}
                size="lg"
                className="gradient-tropical text-foreground font-bold text-lg px-12 py-6 hover:scale-105 transition-all duration-200 shadow-tropical min-w-[280px]"
                disabled={selectedFruits.length === 0 || !formData.style}
              >
                <Sparkles className="w-6 h-6 mr-3" />
                Generate My Perfect Recipe
              </Button>

              {(selectedFruits.length === 0 || !formData.style) && (
                <p className="text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-md border border-amber-200">
                  💡 Please select at least one fruit and a style to continue
                </p>
              )}
            </div>
          )}
        </div>

        {/* Service Info & Security Status */}
        <div className="text-center text-xs text-muted-foreground border-t pt-4 space-y-2">
          <p>
            Using {getServiceDisplayName(selectedService)} •
            {availableServices.length > 1 && " Automatic fallback enabled •"}
            {retryCount > 0 && ` Attempt ${retryCount + 1} •`}
            Always free to use
          </p>
          <div className="flex items-center justify-center gap-2 text-green-600">
            <Shield className="w-3 h-3" />
            <span>Secured with input validation & rate limiting</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeGenerator;
