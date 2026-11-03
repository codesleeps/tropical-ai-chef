// Healthy add-in ingredients for the recipe generator.
// Source: Scout research brief, 2026-11-02 (NIH ODS, Harvard Nutrition Source, EFSA,
// Monash FODMAP, Clean Label Project, Consumer Reports + named 2025 meta-analyses).
// Full report: /root/.hermes/profiles/scout/workspace/outputs/smoothie-addins-2026-11-02.md
// Sea moss (id: sea-moss-gel): Scout research brief, 2026-11-03 — full report:
// /root/.hermes/profiles/scout/workspace/outputs/seamoss-drinks-2026-11-03.md

export interface SmoothieAddIn {
  id: string;
  name: string;
  emoji: string;
  category: AddInCategory;
  rationale: string;
  dose: string;
  tags: string[];
  cautions?: string;
}

export type AddInCategory =
  | "oats-grains"
  | "nuts"
  | "seeds"
  | "protein-powders"
  | "greens-superfoods"
  | "dairy-plant-bases"
  | "sweeteners"
  | "spices-boosters";

export interface AddInCategoryMeta {
  id: AddInCategory;
  label: string;
  emoji: string;
  color: string;
}

export const ADD_IN_CATEGORIES: AddInCategoryMeta[] = [
  { id: "oats-grains", label: "Oats & Grains", emoji: "🌾", color: "bg-amber-100" },
  { id: "nuts", label: "Nuts", emoji: "🥜", color: "bg-orange-100" },
  { id: "seeds", label: "Seeds", emoji: "🌱", color: "bg-lime-100" },
  { id: "protein-powders", label: "Protein", emoji: "💪", color: "bg-rose-100" },
  { id: "greens-superfoods", label: "Greens", emoji: "🥬", color: "bg-green-100" },
  { id: "dairy-plant-bases", label: "Bases", emoji: "🥛", color: "bg-sky-100" },
  { id: "sweeteners", label: "Sweeteners", emoji: "🍯", color: "bg-yellow-100" },
  { id: "spices-boosters", label: "Boosters", emoji: "🌿", color: "bg-emerald-100" },
];

export const SMOOTHIE_ADD_INS: SmoothieAddIn[] = [
  {
    id: "rolled-oats",
    name: "Rolled Oats",
    emoji: "🌾",
    category: "oats-grains",
    rationale: "Beta-glucan soluble fibre (~4g fibre + 5g protein per 40g), shown to lower LDL cholesterol",
    dose: "40g (½ cup) per 2 servings",
    tags: ["vegan", "low-fodmap"],
    cautions: "Only 'certified gluten-free' oats are safe for coeliac (cross-contact). Blend first or they turn gluey; raw oats carry phytic acid that reduces iron/zinc uptake.",
  },
  {
    id: "quinoa-flakes",
    name: "Quinoa Flakes",
    emoji: "🌾",
    category: "oats-grains",
    rationale: "Complete plant protein (~4g per 40g) plus magnesium, iron and manganese",
    dose: "30g (¼ cup) per 2 servings",
    tags: ["vegan", "gluten-free", "low-fodmap"],
    cautions: "Mildly earthy — toast or pair with stronger fruit; fine flakes thicken fast, so add gradually.",
  },
  {
    id: "almond-butter",
    name: "Almond Butter",
    emoji: "🥜",
    category: "nuts",
    rationale: "Vitamin E, magnesium and monounsaturated fat; ~3.4g protein and 2g fibre per 15g",
    dose: "1 tbsp (16g) per 2 servings",
    tags: ["vegan", "gluten-free", "low-fodmap", "contains-tree-nuts"],
    cautions: "TREE NUT allergen. Keep FODMAP-as-law to ~1½ tbsp. Natural versions separate — thin with liquid before adding.",
  },
  {
    id: "peanut-butter",
    name: "Peanut Butter",
    emoji: "🥜",
    category: "nuts",
    rationale: "Cheapest protein/fibre nut hit — ~4g protein and 2g fibre per tbsp",
    dose: "1 tbsp per 2 servings",
    tags: ["vegan", "gluten-free", "low-fodmap", "contains-peanut"],
    cautions: "PEANUT (legume) allergen — not covered by 'tree nut' labelling. Pick no-added-sugar to avoid hidden sweetener.",
  },
  {
    id: "walnut",
    name: "Walnuts",
    emoji: "🌰",
    category: "nuts",
    rationale: "Richest common nut in plant omega-3 ALA (~2.5g per oz) plus polyphenols",
    dose: "2 tbsp chopped per 2 servings",
    tags: ["vegan", "gluten-free", "low-fodmap", "contains-tree-nuts"],
    cautions: "TREE NUT allergen. Bitter skin — balance with banana/mango; calorie-dense (~200 kcal per 2 tbsp).",
  },
  {
    id: "cashew-butter",
    name: "Cashew Butter",
    emoji: "🌰",
    category: "nuts",
    rationale: "Creamy source of magnesium, zinc and copper; smoother texture than other nut butters",
    dose: "1 tbsp per 2 servings",
    tags: ["vegan", "gluten-free", "contains-tree-nuts", "not-low-fodmap"],
    cautions: "HIGH FODMAP above ~10 nuts — avoid for IBS/low-FODMAP. TREE NUT allergen; bland-sweet and can dominate.",
  },
  {
    id: "chia-seeds",
    name: "Chia Seeds",
    emoji: "🌱",
    category: "seeds",
    rationale: "Omega-3 ALA (~2.5g/tbsp) + ~4g fibre; forms a gel that thickens and adds satiety",
    dose: "1 tbsp per 2 servings",
    tags: ["vegan", "gluten-free", "low-fodmap"],
    cautions: "Needs 10–20 min to fully gel or it stays gritty; absorbs up to 10× its weight in liquid — add enough fluid or it becomes a pudding, not a drink.",
  },
  {
    id: "ground-flaxseed",
    name: "Ground Flaxseed",
    emoji: "🌱",
    category: "seeds",
    rationale: "ALA omega-3 (~1.8g/tbsp), lignans and both soluble & insoluble fibre",
    dose: "1 tbsp ground per 2 servings",
    tags: ["vegan", "gluten-free", "low-fodmap"],
    cautions: "MUST be ground — whole seeds pass through undigested. Goes rancid fast (keep refrigerated). Introduce slowly or it is laxative.",
  },
  {
    id: "hemp-hearts",
    name: "Hemp Hearts",
    emoji: "🌱",
    category: "seeds",
    rationale: "Complete plant protein (~10g per 3 tbsp) with a balanced omega-6:3 ratio plus magnesium",
    dose: "2 tbsp (20g) per 2 servings",
    tags: ["vegan", "gluten-free", "low-fodmap", "nut-free"],
    cautions: "Very mild/nutty with no major allergen — a safe default. Soft, blends easily; ~110 kcal per tbsp.",
  },
  {
    id: "pumpkin-seeds",
    name: "Pumpkin Seeds (Pepitas)",
    emoji: "🎃",
    category: "seeds",
    rationale: "Magnesium, zinc and iron; ~5g protein per 2 tbsp — pepitas are low FODMAP",
    dose: "2 tbsp per 2 servings",
    tags: ["vegan", "gluten-free", "low-fodmap"],
    cautions: "Stays gritty unless ground; green colour tints the juice; high in fat, so keep to 2 tbsp.",
  },
  {
    id: "sesame-tahini",
    name: "Sesame / Tahini",
    emoji: "🌱",
    category: "seeds",
    rationale: "Calcium, iron and healthy fats; tahini emulsifies and gives body",
    dose: "1 tbsp tahini per 2 servings",
    tags: ["vegan", "gluten-free", "low-fodmap", "contains-sesame"],
    cautions: "SESAME is a top-9 allergen. Tahini separates — stir well; bitter in sweet juices, use sparingly.",
  },
  {
    id: "whey-protein-isolate",
    name: "Whey Protein Isolate",
    emoji: "🥛",
    category: "protein-powders",
    rationale: "Highest-quality fast protein (~25g/scoop, DIAAS >100, leucine-rich ~11%)",
    dose: "1 scoop (~25–30g) per 2 servings",
    tags: ["gluten-free", "low-fodmap", "contains-dairy", "not-vegan"],
    cautions: "NOT vegan (dairy allergen). Gritty/foamy in juice without a blender — shake hard. 2024 Clean Label Project found ~28% of whey powders over the CA Prop 65 lead level — choose a third-party-tested brand.",
  },
  {
    id: "pea-protein-isolate",
    name: "Pea Protein Isolate",
    emoji: "🌱",
    category: "protein-powders",
    rationale: "Vegan protein ~24g/scoop, DIAAS ~0.82–1.0 (limited by methionine/cysteine)",
    dose: "1 scoop (~25g) per 2 servings",
    tags: ["vegan", "gluten-free", "low-fodmap"],
    cautions: "Earthy and chalky — clashes with bright citrus and is grittier than whey. Plant powders tested ~3× higher in lead than whey (Clean Label Project 2024) — buy tested brands.",
  },
  {
    id: "soy-protein-isolate",
    name: "Soy Protein Isolate",
    emoji: "🫘",
    category: "protein-powders",
    rationale: "Only common plant protein with a complete amino profile (DIAAS ~0.84) and ~25g/scoop",
    dose: "1 scoop (~25g) per 2 servings",
    tags: ["vegan", "gluten-free", "low-fodmap", "contains-soy"],
    cautions: "SOY allergen. Phytoestrogen/thyroid worries are not supported at normal intakes but keep moderate; slight beany taste.",
  },
  {
    id: "collagen-peptides",
    name: "Collagen Peptides",
    emoji: "🦴",
    category: "protein-powders",
    rationale: "Poor-quality protein (no tryptophan) but dissolves clear; 2025 meta-analysis shows small skin hydration/elasticity gains at 12 weeks",
    dose: "1 scoop (~10–15g) per 2 servings",
    tags: ["gluten-free", "low-fodmap", "not-vegan", "evidence-weak"],
    cautions: "NOT vegan (animal-derived). EVIDENCE CONTESTED — wrinkle / dermal-density benefits did not survive sensitivity analysis; do not market as anti-ageing.",
  },
  {
    id: "baby-spinach",
    name: "Baby Spinach",
    emoji: "🥬",
    category: "greens-superfoods",
    rationale: "Lutein, vitamin K, folate and dietary nitrates; ~2g protein per large handful",
    dose: "1 large handful (30g) per 2 servings",
    tags: ["vegan", "gluten-free", "low-fodmap"],
    cautions: "Oxalates can raise kidney-stone risk at high intakes; turns juice swamp-green and adds a vegetal note — hide with pineapple.",
  },
  {
    id: "spirulina",
    name: "Spirulina",
    emoji: "🌿",
    category: "greens-superfoods",
    rationale: "~55–70% protein by weight, phycocyanin antioxidants and B-vitamins (B12 not reliably bioavailable)",
    dose: "1 tsp (3g) per 2 servings",
    tags: ["vegan", "gluten-free", "low-fodmap"],
    cautions: "Strong seaweed/umami taste can wreck fruit juice. Can bioaccumulate heavy metals and cyanotoxins — buy third-party-tested; keep under ~3g.",
  },
  {
    id: "matcha",
    name: "Matcha Powder",
    emoji: "🍵",
    category: "greens-superfoods",
    rationale: "Whole-leaf catechins incl. EGCG (~100mg per 2g) plus L-theanine; modest metabolic effects",
    dose: "1 tsp (2g) per 2 servings",
    tags: ["vegan", "gluten-free", "low-fodmap", "caffeine"],
    cautions: "Delivers caffeine (~60mg per 2g) and is EASILY OVER-CONSUMED — keep under ~4g/day. Clumps; sift before adding.",
  },
  {
    id: "sea-moss-gel",
    name: "Sea Moss Gel",
    emoji: "🌊",
    category: "greens-superfoods",
    rationale: "Gel-forming red seaweed (carrageenan/agar) that thickens smoothies with almost no taste; supplies iodine and a little soluble fibre",
    dose: "Not recommended by default; if offered, 1 tbsp (10g) gel per 2 servings",
    tags: ["vegan", "gluten-free", "low-fodmap", "food-safety-flag", "evidence-weak"],
    cautions: "FOOD-SAFETY FLAG — iodine content is unpredictable (measured dried Irish moss differs ~50-fold between studies) and has caused thyroid harm; keep total daily iodine under the EFSA adult UL of 600µg. AVOID if you have thyroid disease, heart or kidney disease, are pregnant/breastfeeding, or take thyroid or lithium medication. Raw seaweed bioaccumulates arsenic, lead, cadmium and mercury — buy batch-tested (COA) product. The viral '92 minerals' claim is fabricated and no human trial supports the immunity/skin/thyroid marketing. Recommend excluding from the default picker.",
  },
  {
    id: "greek-yogurt",
    name: "Greek Yogurt (plain)",
    emoji: "🥣",
    category: "dairy-plant-bases",
    rationale: "~15–18g protein, calcium and B12 plus live probiotic cultures per 170g",
    dose: "150g (¾ cup) per 2 servings",
    tags: ["gluten-free", "low-fodmap", "contains-dairy", "not-vegan"],
    cautions: "NOT vegan (dairy allergen/lactose); plain is only low-FODMAP at this size. Tangy — pairs with mango/banana rather than citrus.",
  },
  {
    id: "kefir",
    name: "Kefir",
    emoji: "🍶",
    category: "dairy-plant-bases",
    rationale: "Fermented milk with ~11g protein per cup and a diversity of live cultures",
    dose: "150ml per 2 servings",
    tags: ["gluten-free", "low-fodmap", "contains-dairy", "not-vegan"],
    cautions: "NOT vegan (dairy, though lactose-reduced). Thin and tangy; probiotic strain benefits are strain-specific and largely unproven.",
  },
  {
    id: "coconut-milk",
    name: "Coconut Milk (light)",
    emoji: "🥥",
    category: "dairy-plant-bases",
    rationale: "MCT-rich fat gives creaminess; vegan alternative to dairy",
    dose: "2 tbsp (30ml) light per 2 servings",
    tags: ["vegan", "gluten-free", "low-fodmap"],
    cautions: "Full-fat version is very high in saturated fat — use light and dilute. Almost no protein, so don't count it toward protein.",
  },
  {
    id: "almond-milk",
    name: "Almond Milk (unsweetened)",
    emoji: "🥛",
    category: "dairy-plant-bases",
    rationale: "Low-calorie base; fortified versions supply calcium and vitamin D",
    dose: "100ml per 2 servings",
    tags: ["vegan", "gluten-free", "low-fodmap", "contains-tree-nuts"],
    cautions: "TREE NUT allergen; ~1g protein only — not a protein source. Check it is fortified and unsweetened.",
  },
  {
    id: "dates",
    name: "Dates (Medjool)",
    emoji: "🌴",
    category: "sweeteners",
    rationale: "Natural sweetener with fibre, potassium and magnesium; GI lower than table sugar but still sugar",
    dose: "2 pitted dates per 2 servings",
    tags: ["vegan", "gluten-free", "not-low-fodmap"],
    cautions: "HIGH FODMAP (dried fruit); 2–3 dates = 32–48g sugar and count as added sugar. Blend fully or they stay chunky.",
  },
  {
    id: "honey",
    name: "Raw Honey",
    emoji: "🍯",
    category: "sweeteners",
    rationale: "Trace antioxidants; metabolically behaves like sugar (~17g carb per tbsp)",
    dose: "1 tsp (7g) per 2 servings",
    tags: ["gluten-free", "not-low-fodmap", "not-vegan"],
    cautions: "NOT vegan; HIGH FODMAP (excess fructose). Counts as added sugar; never for infants under 1.",
  },
  {
    id: "fresh-ginger",
    name: "Fresh Ginger",
    emoji: "🫚",
    category: "spices-boosters",
    rationale: "Gingerols give a genuine anti-nausea effect and add zing without sugar",
    dose: "1–2cm knob (5–8g) per 2 servings",
    tags: ["vegan", "gluten-free", "low-fodmap"],
    cautions: "Pungent — a little goes far; too much becomes burning heat. Grate fine to avoid fibrous strands.",
  },
  {
    id: "turmeric-black-pepper",
    name: "Turmeric + Black Pepper",
    emoji: "🟡",
    category: "spices-boosters",
    rationale: "Curcumin is anti-inflammatory in the lab but poorly absorbed; black pepper's piperine is claimed to boost absorption 2,000%",
    dose: "½ tsp turmeric + a pinch of pepper per 2 servings",
    tags: ["vegan", "gluten-free", "low-fodmap", "evidence-weak"],
    cautions: "EVIDENCE CONTESTED — the famous 2,000% figure is one small manufacturer-affiliated study; independent trials show no benefit. Stains everything yellow; piperine can alter drug metabolism (CYP3A4) — caution with medication.",
  },
  {
    id: "cinnamon",
    name: "Cinnamon (Ceylon)",
    emoji: "🌿",
    category: "spices-boosters",
    rationale: "Small meta-analyses suggest modest fasting-glucose and HbA1c reductions in type 2 diabetes (heterogeneous evidence)",
    dose: "½ tsp per 2 servings",
    tags: ["vegan", "gluten-free", "low-fodmap"],
    cautions: "Use Ceylon (true) cinnamon — Cassia contains coumarin, which can stress the liver at high chronic doses. Blood-sugar effect is small; not a treatment.",
  },
  {
    id: "cacao-nibs",
    name: "Cacao Nibs / Raw Cacao",
    emoji: "🍫",
    category: "spices-boosters",
    rationale: "Cocoa flavanols have the strongest evidence of any 'superfood' here — an EFSA-approved claim for blood-flow/endothelial function at 200mg flavanols/day",
    dose: "1 tbsp nibs (or 2 tsp high-flavanol cocoa) per 2 servings",
    tags: ["vegan", "gluten-free", "low-fodmap"],
    cautions: "Cocoa can carry lead/cadmium (Consumer Reports 2022–23 flagged many dark-chocolate products) — rotate brands. Bitter and crunchy, so grind or pair with sweet fruit.",
  },
  {
    id: "maca",
    name: "Maca Root Powder",
    emoji: "🥔",
    category: "spices-boosters",
    rationale: "Malt-toasty flavour; claimed libido/energy/hormone benefits are NOT confirmed in rigorous human trials",
    dose: "1 tsp (5g) per 2 servings",
    tags: ["vegan", "gluten-free", "low-fodmap", "evidence-weak"],
    cautions: "EVIDENCE WEAK — a 2024 review found 57 preclinical vs only 22 human studies, mostly small or industry-linked. Thyroid caution. Market for taste, not health claims.",
  },
  {
    id: "ashwagandha",
    name: "Ashwagandha",
    emoji: "🌱",
    category: "spices-boosters",
    rationale: "Adaptogen with some small trials for stress/cortisol, but evidence is mixed and safety is unsettled",
    dose: "Not recommended by default; if offered, ≤½ tsp (2g) per 2 servings",
    tags: ["vegan", "gluten-free", "low-fodmap", "food-safety-flag", "evidence-weak"],
    cautions: "FOOD-SAFETY FLAG — case reports of liver injury and thyroid effects; German BfR advises against use in pregnancy, breastfeeding and liver disease, and no safe intake level is established. Recommend excluding from the default picker.",
  },
];

