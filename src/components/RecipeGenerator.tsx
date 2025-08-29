import { useState, useCallback } from "react";
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
} from "lucide-react";
import { RecipeGenerationLoader } from "@/components/LoadingStates";
import { useErrorHandler } from "@/hooks/use-error-handler";
import { useSecureForm } from "@/hooks/use-security";
import { useAnalytics, usePerformanceTracking } from "@/hooks/use-analytics";
import { toast } from "sonner";
import {
  generateRecipeWithOpenAI,
  generateRecipeLocally,
  type RecipeRequest,
  type Recipe,
} from "@/utils/aiRecipeGenerator";
import {
  generateRecipeWithOllama,
  checkOllamaAvailability,
  getAvailableModels,
  OLLAMA_MODELS,
} from "@/utils/ollamaRecipeGenerator";
import { env, hasOpenAIKey } from "@/config/environment";

interface RecipeGeneratorProps {
  onRecipeGenerated: (recipe: string) => void;
}

type GenerationService = "local" | "ollama" | "openai";

const TROPICAL_FRUITS = [
  "Mango",
  "Pineapple",
  "Passion Fruit",
  "Dragon Fruit",
  "Papaya",
  "Guava",
  "Kiwi",
  "Lychee",
  "Rambutan",
  "Mangosteen",
  "Coconut",
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
  "Spinach",
  "Kale",
  "Cucumber",
  "Celery",
  "Carrot",
  "Beetroot",
  "Ginger",
  "Turmeric",
  "Mint",
  "Parsley",
];

export const RecipeGenerator = ({
  onRecipeGenerated,
}: RecipeGeneratorProps) => {
  const [formData, setFormData] = useState<RecipeRequest>({
    fruit: "",
    style: "",
    vegetables: "",
    dietaryRestrictions: "",
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [availableServices, setAvailableServices] = useState<
    GenerationService[]
  >(["local"]);
  const [selectedService, setSelectedService] =
    useState<GenerationService>("local");
  const [ollamaModels, setOllamaModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [retryCount, setRetryCount] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);

  const { handleError, handleAsyncError, handleApiError } = useErrorHandler();
  const {
    validateField,
    handleSecureSubmit,
    formErrors,
    checkRateLimit,
    getSecurityStatus,
  } = useSecureForm("recipe-generator");
  const { trackRecipeGeneration, trackEngagement } = useAnalytics();
  const { measureFunction } = usePerformanceTracking();

  // Check available services on component mount
  const checkAvailableServices = useCallback(async () => {
    const services: GenerationService[] = ["local"]; // Always available

    // Check OpenAI availability
    if (hasOpenAIKey()) {
      services.push("openai");
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
    if (services.includes("ollama")) {
      setSelectedService("ollama");
    } else if (services.includes("openai")) {
      setSelectedService("openai");
    } else {
      setSelectedService("local");
    }
  }, []);

  // Initialize on component mount
  useState(() => {
    checkAvailableServices();
  });

  const validateForm = (): boolean => {
    if (!formData.fruit || !formData.style) {
      toast.error("Please select both a fruit and style for your recipe");
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

    // Try primary service first
    try {
      switch (selectedService) {
        case "openai":
          if (!hasOpenAIKey()) {
            throw new Error("OpenAI API key not configured");
          }
          return await generateRecipeWithOpenAI(request, env.openaiApiKey!);

        case "ollama":
          if (!selectedModel) {
            throw new Error("No Ollama model selected");
          }
          return await generateRecipeWithOllama({
            ...request,
            model: selectedModel,
          });

        case "local":
        default:
          return generateRecipeLocally(request);
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
            case "local":
              return generateRecipeLocally(request);

            case "ollama":
              if (ollamaModels.length > 0) {
                return await generateRecipeWithOllama({
                  ...request,
                  model: ollamaModels[0],
                });
              }
              break;

            case "openai":
              if (hasOpenAIKey()) {
                return await generateRecipeWithOpenAI(
                  request,
                  env.openaiApiKey!
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

    await handleSecureSubmit(async () => {
      setIsGenerating(true);
      setLastError(null);

      const result = await handleAsyncError(
        async () => {
          // Track recipe generation attempt
          trackEngagement("recipe_generation_started", {
            fruit: formData.fruit,
            style: formData.style,
            service: selectedService,
            has_vegetables: !!formData.vegetables,
            has_dietary_restrictions: !!formData.dietaryRestrictions.trim(),
          });

          // Measure performance of recipe generation
          const recipe = await measureFunction(
            "recipe_generation_duration",
            () => generateWithFallback(formData)
          );

          const formattedRecipe = formatRecipeForDisplay(recipe);

          onRecipeGenerated(formattedRecipe);

          // Track successful recipe generation
          trackRecipeGeneration({
            fruit: formData.fruit,
            style: formData.style,
            service: selectedService,
            success: true,
            duration: recipe.generationTime,
          });

          toast.success("Your tropical recipe is ready! 🥤✨", {
            description: `Generated: ${recipe.title}`,
            duration: 5000,
          });

          // Reset retry count on success
          setRetryCount(0);

          return recipe;
        },
        {
          context: "recipe_generation",
          showToast: false, // We handle our own toasts
          onError: (error) => {
            // Track failed recipe generation
            trackRecipeGeneration({
              fruit: formData.fruit,
              style: formData.style,
              service: selectedService,
              success: false,
            });

            setLastError(error.message);
            setRetryCount((prev) => prev + 1);
          },
        }
      );

      setIsGenerating(false);
    });
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
      case "openai":
        return "OpenAI GPT";
      case "ollama":
        return `Ollama ${selectedModel ? `(${selectedModel})` : ""}`;
      case "local":
        return "Local AI";
      default:
        return service;
    }
  };

  const getServiceDescription = (service: GenerationService): string => {
    switch (service) {
      case "openai":
        return "Premium AI with highest quality results";
      case "ollama":
        return "Local AI models for privacy and speed";
      case "local":
        return "Built-in recipe logic (always available)";
      default:
        return "";
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-tropical">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold bg-gradient-fresh bg-clip-text text-transparent flex items-center gap-2 justify-center">
          <ChefHat className="w-8 h-8" />
          AI Recipe Generator
        </CardTitle>
        <CardDescription className="text-lg">
          Create your perfect tropical juice recipe with AI assistance
        </CardDescription>

        {/* Service Selection */}
        <div className="flex flex-wrap gap-2 justify-center mt-4">
          {availableServices.map((service) => (
            <Badge
              key={service}
              variant={selectedService === service ? "default" : "outline"}
              className={`cursor-pointer transition-all hover:scale-105 ${
                selectedService === service
                  ? "bg-primary text-primary-foreground"
                  : ""
              }`}
              onClick={() => {
                setSelectedService(service);
                // Track service selection
                trackEngagement("ai_service_selected", {
                  service,
                  previous_service: selectedService,
                  available_services: availableServices.length,
                });
              }}
            >
              {service === "openai" && <Zap className="w-3 h-3 mr-1" />}
              {service === "ollama" && <Sparkles className="w-3 h-3 mr-1" />}
              {service === "local" && <ChefHat className="w-3 h-3 mr-1" />}
              {getServiceDisplayName(service)}
            </Badge>
          ))}
        </div>

        <p className="text-sm text-muted-foreground mt-2">
          {getServiceDescription(selectedService)}
        </p>
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

        {/* Ollama Model Selection */}
        {selectedService === "ollama" && ollamaModels.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="model">Ollama Model</Label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger>
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
        )}

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fruit">Primary Tropical Fruit *</Label>
            <Select
              value={formData.fruit}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, fruit: value }));
                // Track fruit selection
                trackEngagement("ingredient_selected", {
                  type: "fruit",
                  value,
                  step: 1,
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose your main fruit" />
              </SelectTrigger>
              <SelectContent>
                {TROPICAL_FRUITS.map((fruit) => (
                  <SelectItem key={fruit} value={fruit}>
                    {fruit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="style">Juice Style *</Label>
            <Select
              value={formData.style}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, style: value }));
                // Track style selection
                trackEngagement("recipe_style_selected", {
                  style: value,
                  step: 2,
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your style" />
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

        <div className="space-y-2">
          <Label htmlFor="vegetables">Additional Vegetables (Optional)</Label>
          <Select
            value={formData.vegetables}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, vegetables: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Add vegetables for extra nutrition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No vegetables</SelectItem>
              {VEGETABLES.map((vegetable) => (
                <SelectItem key={vegetable} value={vegetable}>
                  {vegetable}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dietary">Dietary Restrictions (Optional)</Label>
          <Textarea
            id="dietary"
            placeholder="e.g., vegan, gluten-free, low sugar, keto-friendly..."
            value={formData.dietaryRestrictions}
            onChange={(e) => {
              const newValue = e.target.value;
              setFormData((prev) => ({
                ...prev,
                dietaryRestrictions: newValue,
              }));

              // Validate input on change
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

        {/* Generate Button */}
        <div className="text-center pt-4">
          {isGenerating ? (
            <div className="space-y-4">
              <RecipeGenerationLoader
                aiService={getServiceDisplayName(selectedService)}
              />
            </div>
          ) : (
            <Button
              onClick={handleGenerateRecipe}
              size="lg"
              className="gradient-tropical text-foreground font-bold text-lg px-8 py-6 hover:scale-105 transition-bounce shadow-tropical"
              disabled={!formData.fruit || !formData.style}
            >
              <Sparkles className="w-6 h-6 mr-2" />
              Generate My Recipe
            </Button>
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
