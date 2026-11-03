// Canonical recipe catalog + the pantry ingredient universe.
// Single source of truth for the Featured Recipes list and Pantry Mode matching.

export interface CatalogRecipe {
  name: string;
  fruits: string[]; // ingredients, used both as badges and as the match set
  style: string;
  time: string;
  rating: number;
  reviews: number;
  description: string;
  emoji: string;
}

export const FEATURED_RECIPES: CatalogRecipe[] = [
  {
    name: "Tropical Paradise Smoothie",
    fruits: ["Mango", "Pineapple", "Coconut"],
    style: "Smoothie",
    time: "5 mins",
    rating: 4.9,
    reviews: 128,
    description: "A creamy blend of tropical fruits that tastes like vacation in a glass",
    emoji: "🏝️",
  },
  {
    name: "Green Goddess Detox",
    fruits: ["Kiwi", "Spinach", "Apple"],
    style: "Detox",
    time: "3 mins",
    rating: 4.7,
    reviews: 95,
    description: "Cleansing green juice packed with vitamins and antioxidants",
    emoji: "🥬",
  },
  {
    name: "Dragon Fruit Energy Blast",
    fruits: ["Dragon Fruit", "Passion Fruit", "Ginger"],
    style: "Energy",
    time: "4 mins",
    rating: 4.8,
    reviews: 76,
    description: "Exotic energy booster with natural caffeine alternatives",
    emoji: "🐲",
  },
  {
    name: "Pineapple Coconut Refresher",
    fruits: ["Pineapple", "Coconut", "Lime"],
    style: "Refresher",
    time: "3 mins",
    rating: 4.9,
    reviews: 215,
    description: "Refreshing hydration with a cool mint finish",
    emoji: "🍍",
  },
  {
    name: "Mango Banana Bliss",
    fruits: ["Mango", "Banana", "Almond Milk"],
    style: "Smoothie",
    time: "4 mins",
    rating: 4.8,
    reviews: 189,
    description: "Creamy and indulgent tropical treat",
    emoji: "🥭",
  },
  {
    name: "Berry Tropical Fusion",
    fruits: ["Blueberry", "Strawberry", "Mango"],
    style: "Smoothie",
    time: "4 mins",
    rating: 4.7,
    reviews: 156,
    description: "Antioxidant-rich blend with berries and tropical fruits",
    emoji: "🫐",
  },
  {
    name: "Pear Ginger Zing",
    fruits: ["Pear", "Ginger", "Lemon"],
    style: "Juice",
    time: "3 mins",
    rating: 4.6,
    reviews: 89,
    description: "Warming and immune-boosting combination",
    emoji: "🍐",
  },
  {
    name: "Coconut Mango Delight",
    fruits: ["Coconut", "Mango", "Papaya"],
    style: "Smoothie",
    time: "5 mins",
    rating: 4.9,
    reviews: 234,
    description: "Ultra-creamy tropical paradise in a glass",
    emoji: "🥥",
  },
  {
    name: "Pineapple Mint Cooler",
    fruits: ["Pineapple", "Mint", "Cucumber"],
    style: "Refresher",
    time: "3 mins",
    rating: 4.8,
    reviews: 167,
    description: "Refreshing hydration with a cool mint finish",
    emoji: "🌿",
  },
  {
    name: "Banana Oat Breakfast",
    fruits: ["Banana", "Oat Milk", "Honey"],
    style: "Smoothie",
    time: "4 mins",
    rating: 4.7,
    reviews: 198,
    description: "Filling breakfast smoothie with sustained energy",
    emoji: "🍌",
  },
  {
    name: "Blueberry Acai Bowl",
    fruits: ["Blueberry", "Acai", "Banana"],
    style: "Bowl",
    time: "5 mins",
    rating: 4.9,
    reviews: 312,
    description: "Instagram-worthy acai bowl with fresh toppings",
    emoji: "🍇",
  },
  {
    name: "Tropical Citrus Burst",
    fruits: ["Orange", "Mango", "Pineapple", "Grapefruit"],
    style: "Juice",
    time: "4 mins",
    rating: 4.8,
    reviews: 145,
    description: "Vitamin C-packed citrus explosion",
    emoji: "🍊",
  },
  {
    name: "Coconut Water Recovery",
    fruits: ["Coconut Water", "Banana", "Spinach"],
    style: "Recovery",
    time: "3 mins",
    rating: 4.6,
    reviews: 78,
    description: "Post-workout recovery drink with electrolytes",
    emoji: "💧",
  },
  {
    name: "Mango Peach Summer",
    fruits: ["Mango", "Peach", "Vanilla"],
    style: "Smoothie",
    time: "4 mins",
    rating: 4.9,
    reviews: 267,
    description: "Sweet summer stone fruit tropical blend",
    emoji: "🍑",
  },
  {
    name: "Pear Apple Wellness",
    fruits: ["Pear", "Apple", "Celery"],
    style: "Juice",
    time: "3 mins",
    rating: 4.5,
    reviews: 92,
    description: "Classic fruit and veggie combination for wellness",
    emoji: "🍎",
  },
  {
    name: "Tropical Berry Antioxidant",
    fruits: ["Blueberry", "Raspberry", "Mango", "Pineapple"],
    style: "Smoothie",
    time: "4 mins",
    rating: 4.8,
    reviews: 176,
    description: "Power-packed antioxidant smoothie",
    emoji: "🛡️",
  },
];

export type PantryGroup = "fruit" | "veg" | "staple";

export interface PantryIngredient {
  id: string;
  name: string;
  emoji: string;
  group: PantryGroup;
}

export const PANTRY_GROUP_LABELS: Record<PantryGroup, string> = {
  fruit: "Fruit",
  veg: "Veg & Herbs",
  staple: "Pantry Staples",
};

// The universe of ingredients a user can claim to have at home. Names match the
// catalog's `fruits` values (case-insensitively) so the match engine is exact.
export const PANTRY_INGREDIENTS: PantryIngredient[] = [
  // Fruit
  { id: "mango", name: "Mango", emoji: "🥭", group: "fruit" },
  { id: "pineapple", name: "Pineapple", emoji: "🍍", group: "fruit" },
  { id: "passion-fruit", name: "Passion Fruit", emoji: "🟣", group: "fruit" },
  { id: "dragon-fruit", name: "Dragon Fruit", emoji: "🐲", group: "fruit" },
  { id: "papaya", name: "Papaya", emoji: "🧡", group: "fruit" },
  { id: "guava", name: "Guava", emoji: "🟢", group: "fruit" },
  { id: "kiwi", name: "Kiwi", emoji: "🥝", group: "fruit" },
  { id: "banana", name: "Banana", emoji: "🍌", group: "fruit" },
  { id: "blueberry", name: "Blueberry", emoji: "🫐", group: "fruit" },
  { id: "strawberry", name: "Strawberry", emoji: "🍓", group: "fruit" },
  { id: "raspberry", name: "Raspberry", emoji: "🍓", group: "fruit" },
  { id: "pear", name: "Pear", emoji: "🍐", group: "fruit" },
  { id: "apple", name: "Apple", emoji: "🍎", group: "fruit" },
  { id: "orange", name: "Orange", emoji: "🍊", group: "fruit" },
  { id: "grapefruit", name: "Grapefruit", emoji: "🍊", group: "fruit" },
  { id: "lemon", name: "Lemon", emoji: "🍋", group: "fruit" },
  { id: "lime", name: "Lime", emoji: "🟩", group: "fruit" },
  { id: "peach", name: "Peach", emoji: "🍑", group: "fruit" },
  { id: "coconut", name: "Coconut", emoji: "🥥", group: "fruit" },
  // Veg & herbs
  { id: "spinach", name: "Spinach", emoji: "🥬", group: "veg" },
  { id: "kale", name: "Kale", emoji: "🥬", group: "veg" },
  { id: "cucumber", name: "Cucumber", emoji: "🥒", group: "veg" },
  { id: "celery", name: "Celery", emoji: "🥬", group: "veg" },
  { id: "carrot", name: "Carrot", emoji: "🥕", group: "veg" },
  { id: "beetroot", name: "Beetroot", emoji: "🟣", group: "veg" },
  { id: "ginger", name: "Ginger", emoji: "🫚", group: "veg" },
  { id: "turmeric", name: "Turmeric", emoji: "🟡", group: "veg" },
  { id: "mint", name: "Mint", emoji: "🌿", group: "veg" },
  { id: "parsley", name: "Parsley", emoji: "🌿", group: "veg" },
  // Staples
  { id: "coconut-water", name: "Coconut Water", emoji: "💧", group: "staple" },
  { id: "almond-milk", name: "Almond Milk", emoji: "🥛", group: "staple" },
  { id: "oat-milk", name: "Oat Milk", emoji: "🥛", group: "staple" },
  { id: "honey", name: "Honey", emoji: "🍯", group: "staple" },
  { id: "vanilla", name: "Vanilla", emoji: "🟤", group: "staple" },
  { id: "acai", name: "Acai", emoji: "🍇", group: "staple" },
  { id: "yogurt", name: "Yogurt", emoji: "🥛", group: "staple" },
  { id: "water", name: "Water", emoji: "💧", group: "staple" },
  { id: "ice", name: "Ice", emoji: "🧊", group: "staple" },
];