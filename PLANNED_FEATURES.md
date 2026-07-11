# Planned New Features - Tropical AI Chef

This document outlines the detailed specifications and guidelines for implementing the new AI, chatbot, and 3D UI features.

---

## 1. 🤖 Gemini AI Integration
Implement AI-driven recipe generation and multi-turn chef chats.

### Configuration
- Bind and load the `VITE_GEMINI_API_KEY` from environment variables.
- Place a placeholder key inside `.env.example`.

### Utility Methods (`src/utils/aiRecipeGenerator.ts`)
- **`generateRecipeWithGemini`**:
  - Model: `gemini-1.5-flash`
  - Fetch target: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`
  - Prompt instructions: Request a complete recipe with ingredients, instructions, benefits, prep time, and servings. Force JSON format or clean markdown headings (`# [Recipe Name] 🥤`, `## Ingredients:`, `## Instructions:`, etc.).
- **`chatWithCoco`**:
  - Support multi-turn chat history.
  - System prompt behavior: Warm, sunny tropical chef (frequent use of 🥥, 🍍, 🥭, 🍹, 🌴, 🍋).
  - Enforce formatting of recipe results inside markdown blocks so they can be parsed out by the UI.

---

## 2. 💬 Floating Chatbot ("Coco the Tropical Chef")
A friendly persistent chat assistant.

### UI & Styling (`src/components/TropicalChatbot.tsx`)
- Floating circular button at the bottom-right of the screen with micro-animations.
- Clicking expands into a glassmorphic sidebar chat (using Tailwind CSS classes or raw styling).
- Custom styling: gradient border, blur backdrop, tropical highlights.

### Interaction Features
- Message history list (ScrollArea) showing user and chef messages.
- Suggestion chips at the bottom (e.g. "Surprise me!", "Anti-inflammatory blends").
- Standard keyboard text input and Send action.
- **Voice Mic Integration**: Native Web Speech API mic button for speech-to-text.
- **Interactive Sub-Cards**: Search message text for `# [Title]` and `## Ingredients:`. If detected, extract the recipe and render it inside the chat as a tabbed component with tabs for:
  - **Ingredients** (List with checkbox state)
  - **Steps** (List of instructions)
  - **Benefits** (Nutritional value)
  - Interactive buttons to "Save Recipe" and "Order Smoothie" (simulate ordering).

---

## 3. 🌪️ 3D Projected Canvas Blender
An interactive simulation of a physical blender in the Recipe Generator view.

### Layout Change (`src/components/RecipeGenerator.tsx`)
- Shift the generator form layout to a 2-column grid. Left side has the selections and inputs, right side mounts the **3D Blender** viewport.
- Next to the dietary options, place a microphone icon utilizing the Web Speech API so users can dictate options (e.g. "low sugar, high protein").

### Custom 3D Engine (`src/components/ThreeBlender.tsx`)
Because of sandbox and bundle constraints, write a custom projection engine on a 2D HTML5 Canvas (`<canvas>`):
- **3D Math Projections**: Use standard perspective projection `scale = fov / (z + cameraZ)` and translate coordinates relative to the canvas center.
- **Visuals**:
  - Draw a 3D blender base (base pedestal, metallic collar ring).
  - Draw back glass and front glass highlights.
  - Draw spinning metallic blades centered at the pitcher floor.
  - Draw a black plastic lid.
- **Physics Simulation**:
  - Drop colorful fruit spheres into the pitcher when toggled in the form list.
  - Implement basic bouncy physics (gravity, ground collision at pitcher floor, cylinder wall boundaries).
- **Blending Animation**:
  - When the user starts blending, trigger a 2-second spinning animation.
  - Swirl the fruit spheres around the central orbit and scale them down to 0 (destruction).
  - Spawn swirling colored vortex particles.
  - Rise a semi-transparent colored fluid from the bottom of the pitcher to simulate the mixed ingredients.

---

## 4. 📊 Visual Nutrition Dashboard
Improve the generated recipe display card with dynamic dials instead of bulleted text.

### Implementation (`src/components/RecipeDisplay.tsx`)
- Calculate four core health scores dynamically based on chosen ingredients:
  - **Hydration** (high for cucumber, coconut, watermelon, etc.)
  - **Immunity** (high for ginger, orange, lemon, etc.)
  - **Energy** (high for banana, mango, spinach, etc.)
  - **Detox** (high for celery, beetroot, mint, etc.)
- Render four circular dials (SVG stroke-dasharray progress circles) showing the percentage value, color-coded with tropical gradients.

---

## 5. 📸 Recipe Card PNG Export
Allow users to download a styled image card of their recipe.

### Implementation (`src/components/RecipeDisplay.tsx`)
- Add an "Export Card" button.
- Create a hidden offscreen `<canvas>` (e.g. 600x800).
- Draw a tropical background gradient, round-corner borders, fruit accent graphics, recipe title, ingredients list, and nutrition score dials onto the canvas.
- Call `canvas.toDataURL("image/png")` and trigger a local file download.
