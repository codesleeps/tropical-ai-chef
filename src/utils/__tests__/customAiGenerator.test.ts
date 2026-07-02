import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateRecipeWithCustomProvider } from "../aiRecipeGenerator";

describe("generateRecipeWithCustomProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  const mockRequest = {
    fruit: "mango",
    fruits: ["mango", "pineapple"],
    style: "smoothie",
    vegetables: "none",
    dietaryRestrictions: "vegan",
  };

  const mockConfig = {
    baseUrl: "https://api.example.com/v1",
    apiKey: "test-api-key",
    model: "test-model",
  };

  const mockRecipeText = `# Tropical Paradise Blend 🥤

## Ingredients:
- 1 cup fresh mango, chopped
- 1 cup coconut water

## Instructions:
1. Wash and prepare fruits.
2. Blend ingredients.

## Nutritional Benefits:
- Rich in Vitamin C

## Tips:
- Best served chilled

## Prep Time: 5 minutes
## Servings: 2 servings`;

  it("sends correct headers and body to custom OpenAI-compatible API", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: mockRecipeText,
            },
          },
        ],
      }),
    });

    const result = await generateRecipeWithCustomProvider(mockRequest, mockConfig);

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.example.com/v1/chat/completions",
      expect.objectContaining({
        method: "POST",
        headers: {
          Authorization: "Bearer test-api-key",
          "Content-Type": "application/json",
        },
        body: expect.any(String),
      })
    );

    const body = JSON.parse((global.fetch as any).mock.calls[0][1].body);
    expect(body.model).toBe("test-model");
    expect(body.messages[1].content).toContain("Main Fruits: mango, pineapple");
    expect(body.messages[1].content).toContain("Style: smoothie");

    expect(result.title).toBe("Tropical Paradise Blend");
    expect(result.model).toBe("test-model");
  });

  it("handles baseUrl with trailing slash and formats endpoint correctly", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: mockRecipeText,
            },
          },
        ],
      }),
    });

    await generateRecipeWithCustomProvider(mockRequest, {
      ...mockConfig,
      baseUrl: "https://api.example.com/v1/",
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.example.com/v1/chat/completions",
      expect.any(Object)
    );
  });

  it("handles baseUrl that already ends with /chat/completions", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: mockRecipeText,
            },
          },
        ],
      }),
    });

    await generateRecipeWithCustomProvider(mockRequest, {
      ...mockConfig,
      baseUrl: "https://api.example.com/v1/chat/completions",
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.example.com/v1/chat/completions",
      expect.any(Object)
    );
  });

  it("throws error when API response is not ok", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    await expect(
      generateRecipeWithCustomProvider(mockRequest, mockConfig)
    ).rejects.toThrow("Custom AI API request failed with status: 401");
  });

  it("throws error when choice structure is missing in response", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    await expect(
      generateRecipeWithCustomProvider(mockRequest, mockConfig)
    ).rejects.toThrow("Invalid response format from Custom AI provider");
  });
});
