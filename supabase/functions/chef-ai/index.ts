// Supabase Edge Function: chef-ai
// Server-side proxy to DeepSeek so the API key never reaches the browser bundle.
// Deploy with verify_jwt = true and set the DEEPSEEK_API_KEY project secret.

const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";
const MODEL = Deno.env.get("DEEPSEEK_MODEL") ?? "deepseek-chat";
const DAILY_LIMIT = Number(Deno.env.get("AI_DAILY_LIMIT") ?? "100");

// Daily spend guard: one shared counter per UTC day, incremented atomically in Postgres.
// The service-role key is injected by Supabase and never reaches the client.
const consumeQuota = async (): Promise<number | null> => {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) return null;

  const res = await fetch(`${url}/rest/v1/rpc/consume_ai_quota`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
    },
    body: JSON.stringify({ p_limit: DAILY_LIMIT }),
  });

  if (!res.ok) return null;
  const used = Number(await res.json());
  return Number.isFinite(used) ? used : null;
};

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const RECIPE_SYSTEM = `You are a professional tropical juice recipe creator. Create detailed, healthy, and delicious recipes.
Answer with a recipe in exactly this format and nothing else:

# [Recipe Name] \u{1F964}

## Ingredients:
- [ingredient with measurement]

## Instructions:
1. [step]

## Nutritional Benefits:
- [benefit]

## Tips:
- [tip]

## Prep Time: [X minutes]
## Servings: [X servings]`;

const COCO_SYSTEM = `You are Coco, the friendly Tropical AI Chef. You help users design delicious tropical juices, smoothies, refreshers, and healthy boosters.
Use tropical emojis (\u{1F965}, \u{1F34D}, \u{1F96D}, \u{1F379}, \u{1F334}, \u{1F34B}) frequently, keep your tone sunny, warm, and helpful.
Answer general healthy fruit nutrition questions, suggest combinations, and walk them through recipes.
CRITICAL: If the user explicitly asks for a recipe, you MUST generate a complete recipe and format it exactly inside your message as a markdown block starting with "# [Recipe Name] \u{1F964}" followed by "## Ingredients:", "## Instructions:", "## Nutritional Benefits:", "## Tips:", "## Prep Time:", and "## Servings:" so our application can automatically render it as a premium recipe card!`;

interface ChatTurn {
  role: string;
  content: string;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });

const clean = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

const buildRecipePrompt = (payload: Record<string, unknown>) => {
  const fruits = Array.isArray(payload.fruits) && payload.fruits.length > 0
    ? (payload.fruits as unknown[]).map((f) => clean(f, 40)).join(", ")
    : clean(payload.fruit, 60);

  return `Create a detailed tropical juice recipe with the following requirements:

Main Fruits: ${fruits}
Style: ${clean(payload.style, 60)}
Additional Vegetables: ${clean(payload.vegetables, 200) || "none"}
Dietary Restrictions: ${clean(payload.dietaryRestrictions, 300) || "none"}

Make it creative, delicious, and include tropical flavors. The recipe should be healthy and appealing.`;
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }
  if (req.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  const apiKey = Deno.env.get("DEEPSEEK_API_KEY");
  if (!apiKey) {
    return json({ error: "server_not_configured" }, 500);
  }

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const action = payload.action === "recipe" ? "recipe" : "chat";

  // Spend guard: fail open if the counter is unreachable (Local AI still answers),
  // but refuse once the shared daily budget is used up.
  const used = await consumeQuota();
  if (used !== null && used > DAILY_LIMIT) {
    return new Response(
      JSON.stringify({
        error: "daily_limit_reached",
        limit: DAILY_LIMIT,
        message: `Chef AI has hit its ${DAILY_LIMIT} requests/day limit. Try again after midnight UTC.`,
      }),
      {
        status: 429,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json", "Retry-After": "3600" },
      },
    );
  }

  let messages: ChatTurn[];
  let maxTokens: number;
  let temperature: number;

  if (action === "recipe") {
    messages = [
      { role: "system", content: RECIPE_SYSTEM },
      { role: "user", content: buildRecipePrompt(payload) },
    ];
    maxTokens = 900;
    temperature = 0.8;
  } else {
    const raw = Array.isArray(payload.messages) ? payload.messages : [];
    const history: ChatTurn[] = raw
      .slice(-12)
      .map((turn) => ({
        role: (turn as ChatTurn)?.role === "assistant" ? "assistant" : "user",
        content: clean((turn as ChatTurn)?.content, 4000),
      }))
      .filter((turn) => turn.content.length > 0);

    if (history.length === 0) {
      return json({ error: "empty_messages" }, 400);
    }

    messages = [{ role: "system", content: COCO_SYSTEM }, ...history];
    maxTokens = 800;
    temperature = 0.7;
  }

  const upstream = await fetch(DEEPSEEK_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      max_tokens: maxTokens,
      temperature,
    }),
  });

  if (!upstream.ok) {
    const detail = await upstream.text();
    return json(
      { error: "upstream_failed", status: upstream.status, detail: detail.slice(0, 400) },
      502,
    );
  }

  const data = await upstream.json();
  const text = data?.choices?.[0]?.message?.content ?? "";
  if (!text) {
    return json({ error: "empty_completion" }, 502);
  }

  return json({ text, model: MODEL });
});
