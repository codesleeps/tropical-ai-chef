// Server-side AI proxy client (Supabase Edge Function: chef-ai).
// The DeepSeek key lives in the Supabase project secret, never in this bundle.

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface RecipeRequestPayload {
  fruit: string;
  fruits?: string[];
  style: string;
  vegetables?: string;
  dietaryRestrictions?: string;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as
  | string
  | undefined;

export const CHEF_AI_URL =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? `${SUPABASE_URL}/functions/v1/chef-ai`
    : "";

export const isChefAiConfigured = (): boolean => Boolean(CHEF_AI_URL);

const callChefAi = async (
  payload: Record<string, unknown>,
  timeoutMs = 30000
): Promise<string> => {
  if (!CHEF_AI_URL) {
    throw new Error("Chef AI service is not configured");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(CHEF_AI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        apikey: SUPABASE_ANON_KEY as string,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(
        `Chef AI request failed (${response.status}): ${detail.slice(0, 200)}`
      );
    }

    const data = await response.json();
    const text: string = data?.text ?? "";
    if (!text) throw new Error("Chef AI returned an empty response");
    return text;
  } finally {
    clearTimeout(timer);
  }
};

export const chefAiChat = (messages: ChatTurn[]): Promise<string> =>
  callChefAi({ action: "chat", messages });

export const chefAiRecipe = (request: RecipeRequestPayload): Promise<string> =>
  callChefAi({ action: "recipe", ...request }, 45000);
