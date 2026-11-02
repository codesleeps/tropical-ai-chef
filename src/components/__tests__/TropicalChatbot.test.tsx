import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, userEvent, waitFor } from "@/test/test-utils";
import { TropicalChatbot } from "../TropicalChatbot";
import { chefAiChat, isChefAiConfigured } from "@/utils/chefAi";

// Keep the chat offline by default; individual tests opt into the server-side proxy
vi.mock("@/utils/chefAi", () => ({
  CHEF_AI_URL: "http://test.local/functions/v1/chef-ai",
  isChefAiConfigured: vi.fn(() => false),
  chefAiChat: vi.fn(),
  chefAiRecipe: vi.fn(),
}));

// Force the local chef engine so the chat never touches the network
describe("TropicalChatbot (Coco)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(isChefAiConfigured).mockReturnValue(false);
    localStorage.clear();
    global.fetch = vi.fn();
  });

  it("starts collapsed and opens with the greeting", async () => {
    const user = userEvent.setup();
    render(<TropicalChatbot />);

    expect(screen.queryByText(/I am Coco/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /open coco/i }));

    expect(screen.getByText(/I am Coco/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message coco/i)).toBeInTheDocument();
  });

  it("answers a question with a message when no AI key is configured", async () => {
    const user = userEvent.setup();
    render(<TropicalChatbot />);
    await user.click(screen.getByRole("button", { name: /open coco/i }));

    await user.type(screen.getByLabelText(/message coco/i), "what are the benefits of mango?");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/Mangoes are rich in Vitamin C/i)).toBeInTheDocument();
    });
    // Shipped config has no AI keys, so Coco must answer from the local engine
    // without hitting any remote chat-completion endpoint.
    const urls = (global.fetch as unknown as { mock: { calls: unknown[][] } }).mock.calls.map(
      (call) => String(call[0])
    );
    expect(urls.filter((u) => u.includes("chat/completions"))).toHaveLength(0);
  });

  it("renders a recipe reply as an interactive recipe card", async () => {
    const user = userEvent.setup();
    render(<TropicalChatbot />);
    await user.click(screen.getByRole("button", { name: /open coco/i }));

    await user.click(screen.getByRole("button", { name: /surprise me/i }));

    // The local engine returns a markdown recipe, which must become a tabbed card
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Ingredients" })).toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: "Steps" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Order" })).toBeInTheDocument();

    // Steps tab shows numbered steps without doubling the numbers
    await user.click(screen.getByRole("button", { name: "Steps" }));
    const steps = screen.getAllByRole("listitem");
    expect(steps.length).toBeGreaterThan(0);
    expect(steps[0].textContent || "").not.toMatch(/^\s*1\.\s*1\./);
  });

  it("persists the conversation across remounts", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<TropicalChatbot />);
    await user.click(screen.getByRole("button", { name: /open coco/i }));
    await user.type(screen.getByLabelText(/message coco/i), "hello there");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(localStorage.getItem("tropical_coco_chat")).toContain("hello there");
    });

    unmount();
    render(<TropicalChatbot />);
    await user.click(screen.getByRole("button", { name: /open coco/i }));

    expect(screen.getByText(/hello there/i)).toBeInTheDocument();
  });

  it("uses the server-side proxy when it is configured", async () => {
    const user = userEvent.setup();
    vi.mocked(isChefAiConfigured).mockReturnValue(true);
    vi.mocked(chefAiChat).mockResolvedValue("Fresh from the server! 🥥");

    render(<TropicalChatbot />);
    await user.click(screen.getByRole("button", { name: /open coco/i }));
    expect(screen.getByText(/DeepSeek AI/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/message coco/i), "hello");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/Fresh from the server/i)).toBeInTheDocument();
    });
    expect(chefAiChat).toHaveBeenCalledTimes(1);
  });
});
