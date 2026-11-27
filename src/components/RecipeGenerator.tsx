import { useState, useCallback, useEffect, Fragment } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ChefHat,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Zap,
  Shield,
  Settings,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  Mic,
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
import { useAuth } from "@/components/auth/AuthContext";
import { ADD_IN_CATEGORIES, SMOOTHIE_ADD_INS } from "@/data/smoothieAddins";
import {
  addInsByIds,
  checkAddInConflicts,
  detectRestrictions,
} from "@/utils/dietaryConflicts";
import {
  generateRecipeWithOllama,
  checkOllamaAvailability,
  getAvailableModels,
  OLLAMA_MODELS,
} from "@/utils/ollamaRecipeGenerator";
import { env, hasOpenAIKey, hasGeminiKey } from "@/config/environment";
import { getSpeechRecognition } from "@/utils/speechRecognition";

interface RecipeGeneratorProps {
  onRecipeGenerated: (recipe: string) => void;
}

type GenerationService = "chef" | "local" | "ollama" | "openai" | "gemini" | "custom";

/**
 * Guided 3-step wizard ("1 Pick fruit -> 2 Tailor it -> 3 Generate").
 *
 * Progressive disclosure: only the required inputs (fruit + style) live on the
 * first screen; optional extras are collapsed until the user opens them, and all
 * AI-provider plumbing (service/model/API key) is hidden behind the gear icon.
 */
const STEPS = [
  { id: 1, label: "Pick fruit" },
  { id: 2, label: "Tailor it" },
  { id: 3, label: "Generate" },
] as const;

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
  },
};

/**
 * Collapsed, opt-in section used inside step 2. Keeps optional controls out of
 * the way until the user explicitly opens them.
 */
const OptionalSection = ({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) => (
  <Collapsible className="rounded-xl border border-border bg-card/60">
    <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 rounded-xl p-4 text-left transition-colors hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
      <span>
        <span className="block text-sm font-medium text-foreground">{title}</span>
        {hint && (
          <span className="block text-xs text-muted-foreground">{hint}</span>
        )}
      </span>
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform data-[state=open]:rotate-180" />
    </CollapsibleTrigger>
    <CollapsibleContent className="space-y-3 px-4 pb-4">
      {children}
    </CollapsibleContent>
  </Collapsible>
);

export const RecipeGenerator = ({
  onRecipeGenerated,
}: RecipeGeneratorProps) => {
  const [formData, setFormData] = useState<RecipeRequest>({
    fruit: "",
    style: "",
    vegetables: "none",
    dietaryRestrictions: "",
  });

  // Guided flow: which step is on screen (1..3).
  const [activeStep, setActiveStep] = useState(1);

  const [selectedFruits, setSelectedFruits] = useState<string[]>([]);
  const [selectedVegetables, setSelectedVegetables] = useState<string[]>([]);
  const [selectedAddIns, setSelectedAddIns] = useState<string[]>([]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [availableServices, setAvailableServices] = useState<
    GenerationService[]
  >(["local", "custom"]);
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
  const [advancedOpen, setAdvancedOpen] = useState(false);

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

  // DeepSeek ("chef") is paid/authenticated-only; anonymous visitors get the
  // free local engine by default.
  const { user, loading } = useAuth();
  const isAuthed = Boolean(user);

  // Healthy add-ins picked from the Scout research set
  const selectedAddInData = SMOOTHIE_ADD_INS.filter((a) => selectedAddIns.includes(a.id));
  const addInPayload = selectedAddInData.map((a) => `${a.name} - ${a.dose}`);
  const selectedAddInDoses = selectedAddInData.map((a) => `${a.name}: ${a.dose}`);
  const selectedAddInCautions = selectedAddInData
    .map((a) => a.cautions)
    .filter((c): c is string => Boolean(c));

  // Dietary safety: never hand someone an add-in that clashes with a stated restriction.
  const dietConflicts = checkAddInConflicts(formData.dietaryRestrictions, selectedAddInData);
  const hardBlocks = dietConflicts.filter((c) => c.severity === "block");
  const recognisedRestrictions = detectRestrictions(formData.dietaryRestrictions);

  // Step 1 is the only place with required inputs; nothing may advance past it empty.
  const canLeaveStep1 = selectedFruits.length > 0 && Boolean(formData.style);

  const toggleAddIn = (id: string) => {
    setSelectedAddIns((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Check available services on component mount
  const checkAvailableServices = useCallback(async () => {
    const services: GenerationService[] = ["local", "custom"]; // Always available

    // Server-side AI proxy (Supabase Edge Function) - no key in the bundle
    // Reserved for authenticated (paid) users only.
    if (isChefAiConfigured() && isAuthed) {
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

    // Set default service preference: chef -> gemini -> openai -> ollama -> custom -> local
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
  }, [isAuthed]);

  // Re-run service detection once auth has resolved (and on any login change).
  useEffect(() => {
    if (!loading) {
      checkAvailableServices();
    }
  }, [loading, checkAvailableServices]);

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
    if (hardBlocks.length > 0) {
      toast.error(
        "These add-ins clash with your dietary restrictions - remove them to continue",
      );
      return false;
    }

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

  const goToStep = (step: number) => {
    // Gate forward navigation on the required inputs from step 1.
    if (step > 1 && !canLeaveStep1) {
      toast.error("Please select at least one fruit and a style to continue");
      return;
    }
    setActiveStep(step);
    trackEngagement("wizard_step", { step });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-tropical">
      <CardHeader className="text-center relative">
        <CardTitle className="text-3xl font-bold gradient-fresh bg-clip-text text-transparent flex items-center gap-2 justify-center">
          <ChefHat className="w-8 h-8" />
          AI Recipe Generator
        </CardTitle>
        <CardDescription className="text-lg">
          Create your perfect tropical juice recipe with AI assistance
        </CardDescription>

        {/* Advanced settings (AI provider plumbing) lives behind the gear icon */}
        <Dialog open={advancedOpen} onOpenChange={setAdvancedOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Advanced settings"
              title="Advanced settings"
              className="absolute right-2 top-2"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" /> Advanced settings
              </DialogTitle>
              <DialogDescription>
                Power-user options. Choose the AI service that generates your
                recipe. Most people can leave this on the default.
              </DialogDescription>
            </DialogHeader>

            {/* AI Service Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">AI Service</Label>
              <div className="flex flex-wrap gap-2">
                {availableServices.map((service) => (
                  <button
                    key={service}
                    type="button"
                    aria-pressed={selectedService === service}
                    className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm transition-all ${
                      selectedService === service
                        ? "border-primary bg-primary text-primary-foreground shadow-md"
                        : "border-border hover:bg-accent"
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
                    {service === "openai" && <Zap className="w-3 h-3" />}
                    {service === "ollama" && <Sparkles className="w-3 h-3" />}
                    {service === "local" && <ChefHat className="w-3 h-3" />}
                    {service === "custom" && <Settings className="w-3 h-3" />}
                    {getServiceDisplayName(service)}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {getServiceDescription(selectedService)}
              </p>
            </div>

            {/* Ollama Model Selection */}
            {selectedService === "ollama" && ollamaModels.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="ollama-model" className="text-sm font-medium">
                  Ollama model
                </Label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger id="ollama-model" className="w-full">
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

            {/* Custom API Configuration */}
            {selectedService === "custom" && (
              <div className="space-y-4 rounded-lg border border-dashed border-2 border-primary/40 bg-accent/10 p-4">
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
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Step progress */}
        <nav aria-label="Recipe steps" className="flex items-center justify-center gap-2 sm:gap-3">
          {STEPS.map((step, idx) => {
            const isActive = activeStep === step.id;
            const isComplete = activeStep > step.id;
            const isLocked = step.id > 1 && !canLeaveStep1;
            return (
              <Fragment key={step.id}>
                <button
                  type="button"
                  onClick={() => goToStep(step.id)}
                  disabled={isLocked}
                  aria-current={isActive ? "step" : undefined}
                  className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                    isActive
                      ? "border-primary bg-primary text-primary-foreground shadow-md"
                      : isComplete
                      ? "border-primary/40 text-primary hover:bg-primary/10"
                      : "border-border text-muted-foreground hover:bg-accent"
                  }`}
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-background/20 text-xs">
                    {isComplete ? <Check className="h-3 w-3" /> : step.id}
                  </span>
                  <span className="hidden sm:inline">{step.label}</span>
                </button>
                {idx < STEPS.length - 1 && (
                  <span aria-hidden="true" className="h-px w-4 bg-border sm:w-8" />
                )}
              </Fragment>
            );
          })}
        </nav>

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

        {/* ---------------- Step 1: Pick fruit + style ---------------- */}
        {activeStep === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Pick your fruit
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Choose up to 5 tropical fruits and a style - that's all you need
                to get started.
              </p>
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
                    step: 1,
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

            <div className="space-y-2">
              <Label className="text-base font-medium">
                Tropical Fruits * (Select up to 5)
              </Label>
              <p className="text-sm text-muted-foreground">
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

                        // Functional update keeps rapid clicks correct.
                        setSelectedFruits((prev) => {
                          const next = prev.includes(fruit.name)
                            ? prev.filter((f) => f !== fruit.name)
                            : [...prev, fruit.name];
                          // Keep formData.fruit in sync with the primary fruit.
                          setFormData((fd) => ({
                            ...fd,
                            fruit: next.length > 0 ? next[0] : "",
                          }));
                          trackEngagement("ingredient_selected", {
                            type: "fruit",
                            value: fruit.name,
                            total_selected: next.length,
                            step: 1,
                          });
                          return next;
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
          </div>
        )}

        {/* ---------------- Step 2: Tailor it (all optional, collapsed) ---------------- */}
        {activeStep === 2 && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Tailor it
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Optional extras. Open only the ones you want - your recipe works
                great without them.
              </p>
            </div>

            <div className="space-y-3 max-w-2xl mx-auto">
              {/* Vegetables */}
              <OptionalSection
                title="Add vegetables"
                hint={
                  selectedVegetables.length > 0
                    ? `${selectedVegetables.length} selected`
                    : "Optional - greens, ginger, turmeric..."
                }
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Select up to 5
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {selectedVegetables.length}/5 selected
                  </span>
                </div>
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

                          // Functional update keeps rapid clicks correct.
                          setSelectedVegetables((prev) => {
                            const next = prev.includes(vegetable.name)
                              ? prev.filter((v) => v !== vegetable.name)
                              : [...prev, vegetable.name];
                            setFormData((fd) => ({
                              ...fd,
                              vegetables:
                                next.length > 0 ? next.join(", ") : "none",
                            }));
                            return next;
                          });
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
              </OptionalSection>

              {/* Healthy add-ins - sourced from the Scout research brief (2026-11-02) */}
              <OptionalSection
                title="Healthy add-ins"
                hint={
                  selectedAddIns.length > 0
                    ? `${selectedAddIns.length} selected`
                    : "Optional - boosts, powders, seeds..."
                }
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Tap to add or remove
                  </span>
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
              </OptionalSection>

              {/* Dietary restrictions */}
              <OptionalSection
                title="Dietary restrictions & preferences"
                hint={
                  formData.dietaryRestrictions.trim()
                    ? "Set"
                    : "Optional - vegan, gluten-free, low sugar..."
                }
              >
                <div className="flex items-center justify-between">
                  <Label htmlFor="dietary" className="text-sm font-medium">
                    Tell us what to avoid
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
              </OptionalSection>
            </div>
          </div>
        )}

        {/* ---------------- Step 3: Generate ---------------- */}
        {activeStep === 3 && (
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Generate Your Recipe
              </h3>

              {/* Review summary */}
              <div className="mx-auto max-w-lg rounded-xl border bg-card/60 p-4 text-left text-sm">
                <div className="flex justify-between gap-3 py-1">
                  <span className="text-muted-foreground">Fruit</span>
                  <span className="font-medium text-foreground">
                    {selectedFruits.length > 0
                      ? selectedFruits.join(", ")
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between gap-3 py-1">
                  <span className="text-muted-foreground">Style</span>
                  <span className="font-medium text-foreground">
                    {formData.style || "-"}
                  </span>
                </div>
                {selectedVegetables.length > 0 && (
                  <div className="flex justify-between gap-3 py-1">
                    <span className="text-muted-foreground">Vegetables</span>
                    <span className="font-medium text-foreground">
                      {selectedVegetables.join(", ")}
                    </span>
                  </div>
                )}
                {selectedAddIns.length > 0 && (
                  <div className="flex justify-between gap-3 py-1">
                    <span className="text-muted-foreground">Add-ins</span>
                    <span className="font-medium text-foreground text-right">
                      {selectedAddInData.map((a) => a.name).join(", ")}
                    </span>
                  </div>
                )}
                {formData.dietaryRestrictions.trim() && (
                  <div className="flex justify-between gap-3 py-1">
                    <span className="text-muted-foreground">Dietary</span>
                    <span className="font-medium text-foreground text-right">
                      {formData.dietaryRestrictions}
                    </span>
                  </div>
                )}
              </div>

              {(dietConflicts.length > 0 || recognisedRestrictions.length > 0) && (
                <div
                  role="alert"
                  className={`space-y-1.5 rounded-lg border p-3 text-left text-sm ${
                    hardBlocks.length > 0
                      ? "border-destructive/50 bg-destructive/5 text-destructive"
                      : "border-amber-300 bg-amber-50 text-amber-900"
                  }`}
                >
                  {hardBlocks.length > 0 && (
                    <>
                      <div className="text-sm font-medium">
                        These add-ins clash with your dietary restrictions
                      </div>
                      <ul className="list-disc space-y-0.5 pl-4 text-xs">
                        {hardBlocks.map((conflict) => (
                          <li key={`${conflict.addInId}-${conflict.reason}`}>
                            <span className="font-medium">{conflict.addInName}</span> -
                            {" "}{conflict.reason}
                          </li>
                        ))}
                      </ul>
                      <p className="text-xs">
                        Remove the flagged add-ins, or amend your dietary restrictions, to
                        continue.
                      </p>
                    </>
                  )}
                  {dietConflicts.length > hardBlocks.length && (
                    <ul className="list-disc space-y-0.5 pl-4 text-xs">
                      {dietConflicts
                        .filter((c) => c.severity === "warn")
                        .map((conflict) => (
                          <li key={`${conflict.addInId}-${conflict.reason}`}>
                            <span className="font-medium">{conflict.addInName}</span> -
                            {" "}{conflict.reason}
                          </li>
                        ))}
                    </ul>
                  )}
                  {recognisedRestrictions.length > 0 && (
                    <p className="text-xs">
                      Checking add-ins against: {recognisedRestrictions.join(", ")}
                    </p>
                  )}
                </div>
              )}

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
                  disabled={selectedFruits.length === 0 || !formData.style || hardBlocks.length > 0}
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
        )}

        {/* Wizard navigation */}
        <div className="flex items-center justify-between gap-3 border-t pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => goToStep(Math.max(1, activeStep - 1))}
            disabled={activeStep === 1 || isGenerating}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>

          {activeStep < 3 && (
            <Button
              type="button"
              onClick={() => goToStep(activeStep + 1)}
              disabled={activeStep === 1 && !canLeaveStep1}
            >
              {activeStep === 1 ? "Next: tailor it" : "Next: generate"}
              <ChevronRight className="h-4 w-4 ml-1" />
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
