import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, X, Send, Mic, ChefHat, Heart, ShoppingCart } from "lucide-react";
import { chatWithCoco } from "@/utils/aiRecipeGenerator";
import { getSpeechRecognition } from "@/utils/speechRecognition";
import { isChefAiConfigured } from "@/utils/chefAi";
import { env, hasGeminiKey, hasOpenAIKey } from "@/config/environment";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CHAT_STORAGE_KEY = "tropical_coco_chat";
const MAX_STORED_MESSAGES = 50;
const MAX_CONTEXT_MESSAGES = 12;

const GREETING: Message = {
  role: "assistant",
  content:
    "Aloha! 🌴 I am Coco, your Tropical AI Chef. 🥥 Need help whipping up a delicious smoothie, fresh juice, or detox booster? Tell me what ingredients you have, or select one of the suggestions below! 🍹🍍",
};

const RECIPE_TITLE_RE = /^#\s+\S/m;
const RECIPE_SECTION_RE = /^##\s+(ingredients|instructions)/im;

/** True when the assistant reply contains a machine-readable recipe block. */
const looksLikeRecipe = (content: string) =>
  RECIPE_TITLE_RE.test(content) && RECIPE_SECTION_RE.test(content);

const loadStoredMessages = (): Message[] => {
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!raw) return [GREETING];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const valid = parsed.filter(
        (m): m is Message =>
          !!m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string"
      );
      if (valid.length > 0) return valid;
    }
  } catch {
    // Corrupt storage should never break the chat
  }
  return [GREETING];
};

const getActiveAIService = (): string => {
  if (isChefAiConfigured()) return "chef";
  if (hasGeminiKey()) return "gemini";
  if (hasOpenAIKey()) return "openai";
  if (env.customAiApiKey) return "custom";
  return "local";
};

const ENGINE_LABELS: Record<string, string> = {
  chef: "DeepSeek AI",
  gemini: "Gemini",
  openai: "OpenAI",
  custom: "Custom AI",
  local: "Local Chef AI",
};

export const TropicalChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(loadStoredMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const activeService = getActiveAIService();
  const engineLabel = ENGINE_LABELS[activeService] ?? activeService;

  // Persist the conversation so it survives reloads and page navigation
  useEffect(() => {
    try {
      localStorage.setItem(
        CHAT_STORAGE_KEY,
        JSON.stringify(messages.slice(-MAX_STORED_MESSAGES))
      );
    } catch {
      // Storage may be unavailable (private mode) - chat still works in-memory
    }
  }, [messages]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text || isTyping) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const keys = {
        gemini: env.geminiApiKey,
        openai: env.openaiApiKey,
        customApiKey: env.customAiApiKey,
        customBaseUrl: env.customAiBaseUrl,
        customModel: env.customAiModel,
      };

      // Only send recent turns: keeps latency and token cost bounded
      const history = [...messages, userMsg]
        .slice(-MAX_CONTEXT_MESSAGES)
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await chatWithCoco(history, activeService, keys);

      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Oops! 🌴 A small coconut fell on my head and I lost connection. Please try typing that again! 🥥",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setMessages([GREETING]);
    setInput("");
    toast.info("Fresh start! Chat cleared. 🥥");
  };

  const handleVoiceCommand = () => {
    const SpeechRecognition = getSpeechRecognition();

    if (!SpeechRecognition) {
      toast.error("Voice input is not supported in this browser. Please try Chrome or Safari! 🎙️");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      toast.info("Listening to your voice... 🎙️", { id: "chat-voice" });
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error("Speech recognition failed. Try again!", { id: "chat-voice" });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      toast.success("Voice transcribed! 🍍", { id: "chat-voice" });
    };

    recognition.start();
  };

  const quickActions = [
    { text: "🥥 Surprise me!", prompt: "Surprise me with a unique tropical smoothie recipe!" },
    { text: "🍍 Dragon fruit benefits", prompt: "What are the health benefits of dragon fruit?" },
    { text: "🌿 Recommend a detox", prompt: "Recommend a green detox juice recipe" },
    { text: "🛒 How do I order?", prompt: "How can I order my generated juice?" },
  ];

  // Helper to parse Markdown recipes in chatbot messages
  const renderMessageContent = (content: string) => {
    if (looksLikeRecipe(content)) {
      return <ChatRecipeCard recipeText={content} />;
    }

    // Replace linebreaks with <br/> for nice readable text formatting
    return (
      <div className="whitespace-pre-line text-sm leading-relaxed">
        {content}
      </div>
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded Chat Dialog */}
      {isOpen && (
        <Card
          role="dialog"
          aria-label="Coco the Tropical Chef chat"
          className="w-[340px] sm:w-[380px] h-[520px] mb-4 flex flex-col shadow-2xl border-primary/20 backdrop-blur-md bg-background/90 animate-in slide-in-from-bottom duration-200"
        >
          <CardHeader className="p-4 border-b flex flex-row items-center justify-between bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-t-xl">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold animate-bounce shadow">
                🥥
              </div>
              <div>
                <CardTitle className="text-sm font-bold flex items-center gap-1">
                  Coco <span className="text-[10px] bg-primary/20 px-1.5 py-0.2 rounded-full text-primary font-mono">{engineLabel}</span>
                </CardTitle>
                <p className="text-[10px] text-muted-foreground">Ask recipes, benefits or mix guidelines</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-muted"
                aria-label="Clear chat"
                title="Clear chat"
                onClick={handleClearChat}
              >
                <ChefHat className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-muted"
                aria-label="Close chat"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          {/* Chat message thread */}
          <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
            <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 bg-muted/10">
              <div className="space-y-4">
                {messages.map((msg, index) => {
                  const isUser = msg.role === "user";
                  return (
                    <div
                      key={index}
                      className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${
                          isUser
                            ? "bg-primary text-primary-foreground rounded-tr-none"
                            : "bg-card text-card-foreground rounded-tl-none border border-border"
                        }`}
                      >
                        {renderMessageContent(msg.content)}
                      </div>
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex justify-start" aria-live="polite">
                    <div className="bg-card border border-border rounded-2xl rounded-tl-none p-3 max-w-[85%] shadow-sm">
                      <div className="flex gap-1.5 items-center">
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>

          {/* Suggestion Chips */}
          {!isTyping && (
            <div className="px-4 py-2 border-t flex flex-wrap gap-1.5 justify-center bg-muted/5">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(action.prompt)}
                  className="text-xs px-2.5 py-1 rounded-full border bg-card text-card-foreground hover:bg-primary/10 hover:border-primary transition-all font-medium"
                >
                  {action.text}
                </button>
              ))}
            </div>
          )}

          {/* Chat entry form */}
          <CardFooter className="p-3 border-t bg-card/45 flex items-center gap-2">
            <Button
              type="button"
              variant={isListening ? "destructive" : "outline"}
              size="icon"
              className={`rounded-full shrink-0 ${isListening ? "animate-pulse" : ""}`}
              aria-label={isListening ? "Listening for voice input" : "Speak your question"}
              onClick={handleVoiceCommand}
            >
              <Mic className="w-4 h-4" />
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Coco a question..."
              aria-label="Message Coco"
              className="flex-1 h-9 rounded-full px-4"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend(input);
                }
              }}
            />
            <Button
              onClick={() => handleSend(input)}
              size="icon"
              className="rounded-full shrink-0 h-9 w-9"
              aria-label="Send message"
              disabled={!input.trim() || isTyping}
            >
              <Send className="w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Floating Bouncing Trigger Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close Coco, the AI chef chat" : "Open Coco, the AI chef chat"}
        aria-expanded={isOpen}
        className="h-14 w-14 rounded-full shadow-2xl bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-all text-white flex items-center justify-center border-2 border-background animate-pulse duration-1000"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </Button>
    </div>
  );
};

// Subcomponent: Chat Recipe Card
interface ChatRecipeCardProps {
  recipeText: string;
}

const ChatRecipeCard = ({ recipeText }: ChatRecipeCardProps) => {
  const [activeTab, setActiveTab] = useState<"ingredients" | "instructions" | "tips">("ingredients");

  // Basic parser
  const lines = recipeText.split("\n");
  let title = "Tropical Juice";
  const ingredients: string[] = [];
  const instructions: string[] = [];
  const tips: string[] = [];
  const benefits: string[] = [];
  let prepTime = "5 mins";
  let servings = "2 servings";

  let section = "";
  lines.forEach((line) => {
    const l = line.trim();
    if (l.startsWith("# ")) {
      title = l.replace("# ", "").replace(" 🥤", "").trim();
    } else if (l.startsWith("## ")) {
      section = l.replace("## ", "").toLowerCase();
    } else if (l.startsWith("- ")) {
      const val = l.replace("- ", "");
      if (section.includes("ingredients")) ingredients.push(val);
      else if (section.includes("tips")) tips.push(val);
      else if (section.includes("benefits") || section.includes("nutritional")) benefits.push(val);
    } else if (l.match(/^\d+[.)]/)) {
      instructions.push(l.replace(/^\d+[.)]\s*/, ""));
    } else if (l.includes("Prep Time:")) {
      prepTime = l.split(":")[1]?.trim() || "5 mins";
    } else if (l.includes("Servings:")) {
      servings = l.split(":")[1]?.trim() || "2 servings";
    }
  });

  const tabs: { id: "ingredients" | "instructions" | "tips"; label: string }[] = [
    { id: "ingredients", label: "Ingredients" },
    { id: "instructions", label: "Steps" },
    { id: "tips", label: "Benefits" },
  ];

  const handleSaveRecipe = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("tropical_saved_recipes") || "[]");
      const alreadySaved = saved.some((r: { title: string }) => r.title === title);
      if (alreadySaved) {
        toast.info("Recipe is already saved! 💛");
        return;
      }
      saved.push({ title, ingredients, instructions, tips, benefits, prepTime, servings, date: new Date().toISOString() });
      localStorage.setItem("tropical_saved_recipes", JSON.stringify(saved));
      toast.success("Recipe saved to local chest! 💾🦜");
    } catch (e) {
      console.error(e);
      toast.error("Failed to save recipe.");
    }
  };

  const handleOrderJuice = () => {
    toast.success(`Juice Ordered! 🛒🍊`, {
      description: `Whipping up: "${title}" for delivery!`,
    });
  };

  return (
    <Card className="w-full bg-card border-muted overflow-hidden shadow-md max-w-sm rounded-xl">
      <div className="bg-gradient-to-r from-orange-400 to-pink-500 p-3 text-white flex justify-between items-center">
        <div>
          <h4 className="text-sm font-bold truncate max-w-[180px]">{title}</h4>
          <p className="text-[10px] opacity-90">{prepTime} • {servings}</p>
        </div>
        <span className="text-2xl">🥤</span>
      </div>

      <div className="p-2 border-b flex justify-around text-xs font-semibold bg-muted/20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            aria-pressed={activeTab === tab.id}
            className={`pb-1 px-1.5 border-b-2 transition-all ${
              activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <ScrollArea className="h-36 p-3 text-xs leading-relaxed">
        {activeTab === "ingredients" && (
          <ul className="space-y-1 list-disc pl-4 text-card-foreground">
            {ingredients.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        )}
        {activeTab === "instructions" && (
          <ol className="space-y-1.5 text-card-foreground list-decimal pl-4">
            {instructions.map((item, idx) => (
              <li key={idx} className="pl-1">
                {item}
              </li>
            ))}
          </ol>
        )}
        {activeTab === "tips" && (
          <div className="space-y-2">
            <div>
              <p className="font-semibold text-primary/80 mb-0.5">Health Benefits:</p>
              <ul className="list-disc pl-4 text-muted-foreground space-y-0.5">
                {benefits.map((b, idx) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>
            </div>
            {tips.length > 0 && (
              <div>
                <p className="font-semibold text-primary/80 mb-0.5">Tips:</p>
                <ul className="list-disc pl-4 text-muted-foreground space-y-0.5">
                  {tips.map((t, idx) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      <div className="p-2 border-t flex gap-1.5 justify-end bg-muted/10">
        <Button onClick={handleSaveRecipe} size="sm" variant="outline" className="h-7 text-[10px] px-2 flex gap-1">
          <Heart className="w-3 h-3 text-red-500 fill-red-500" /> Save
        </Button>
        <Button onClick={handleOrderJuice} size="sm" className="h-7 text-[10px] px-2 flex gap-1">
          <ShoppingCart className="w-3 h-3" /> Order
        </Button>
      </div>
    </Card>
  );
};
