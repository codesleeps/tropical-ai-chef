// Dietary conflict detection for selected add-ins.
// Rules are grounded in the machine-readable tags Scout attached to each ingredient
// (contains-tree-nuts, contains-dairy, not-vegan, not-low-fodmap, food-safety-flag, ...),
// so a user who types "nut allergy" cannot be handed a cashew smoothie.

import { SMOOTHIE_ADD_INS, type SmoothieAddIn } from "@/data/smoothieAddins";

export type ConflictSeverity = "block" | "warn";

export interface DietConflict {
  addInId: string;
  addInName: string;
  severity: ConflictSeverity;
  reason: string;
}

interface AllergenRule {
  key: string;
  label: string;
  keywords: string[];
  /** Block when the ingredient carries ANY of these tags. */
  tags?: string[];
  /** Block when the ingredient LACKS all of these tags (e.g. not certified gluten-free). */
  requiresTags?: string[];
  severity: ConflictSeverity;
  reason: string;
}

const ALLERGEN_RULES: AllergenRule[] = [
  {
    key: "nuts",
    label: "nuts",
    keywords: ["nut allergy", "nut allergy", "nut-allergy", "nut free", "nut-free", "tree nut", "no nuts", "allergic to nuts"],
    tags: ["contains-tree-nuts", "contains-peanut"],
    severity: "block",
    reason: "contains nuts",
  },
  {
    key: "peanut",
    label: "peanuts",
    keywords: ["peanut allergy", "peanut-free", "peanut free", "no peanuts"],
    tags: ["contains-peanut"],
    severity: "block",
    reason: "contains peanuts",
  },
  {
    key: "sesame",
    label: "sesame",
    keywords: ["sesame allergy", "sesame-free", "sesame free", "no sesame"],
    tags: ["contains-sesame"],
    severity: "block",
    reason: "contains sesame",
  },
  {
    key: "dairy",
    label: "dairy",
    keywords: ["dairy free", "dairy-free", "no dairy", "lactose", "milk allergy", "milk-free"],
    tags: ["contains-dairy"],
    severity: "block",
    reason: "contains dairy",
  },
  {
    key: "soy",
    label: "soy",
    keywords: ["soy allergy", "soy-free", "soy free", "soya", "no soy"],
    tags: ["contains-soy"],
    severity: "block",
    reason: "contains soy",
  },
  {
    key: "gluten",
    label: "gluten",
    keywords: ["gluten free", "gluten-free", "no gluten", "coeliac", "celiac", "wheat allergy"],
    requiresTags: ["gluten-free"],
    severity: "block",
    reason: "not certified gluten-free",
  },
  {
    key: "vegan",
    label: "vegan",
    keywords: ["vegan", "plant based", "plant-based", "no animal products"],
    tags: ["not-vegan"],
    severity: "block",
    reason: "not vegan",
  },
  {
    key: "lowfodmap",
    label: "low-FODMAP",
    keywords: ["fodmap", "low fodmap", "ibs", "irritable bowel"],
    tags: ["not-low-fodmap"],
    severity: "block",
    reason: "high FODMAP",
  },
  {
    key: "caffeine",
    label: "caffeine",
    keywords: ["caffeine", "decaf", "no caffeine", "caffeine free"],
    tags: ["caffeine"],
    severity: "warn",
    reason: "contains caffeine",
  },
];

// Cited safety flags from the research brief: always surfaced, regardless of typed restrictions.
const RESEARCH_FLAG_RULES: AllergenRule[] = [
  {
    key: "food-safety",
    label: "food safety",
    keywords: [],
    tags: ["food-safety-flag"],
    severity: "block",
    reason: "carries a food-safety flag in our research (not recommended)",
  },
  {
    key: "weak-evidence",
    label: "weak evidence",
    keywords: [],
    tags: ["evidence-weak"],
    severity: "warn",
    reason: "claims are not well supported by evidence",
  },
];

/** Honey is unsafe for infants under 12 months (infant botulism) - handled by id, not tag. */
const INFANT_UNSAFE_IDS = new Set(["honey"]);
const INFANT_KEYWORDS = [
  "baby",
  "infant",
  "under 1",
  "toddler",
  "child",
  "kid",
  "pregnancy",
  "pregnant",
];

const normalise = (value: string): string => ` ${value.toLowerCase().replace(/\s+/g, " ")} `;

const matches = (text: string, keywords: string[]): boolean =>
  keywords.some((keyword) => text.includes(keyword));

const hasAnyTag = (addIn: SmoothieAddIn, tags: string[]): boolean =>
  tags.some((tag) => addIn.tags.includes(tag));

/** Which restrictions we actually understood - surfaced in the UI so nothing is silently ignored. */
export const detectRestrictions = (restrictions: string): string[] => {
  const text = normalise(restrictions);
  const found = ALLERGEN_RULES.filter((rule) => matches(text, rule.keywords)).map(
    (rule) => rule.label
  );
  if (matches(text, INFANT_KEYWORDS)) found.push("infants / pregnancy");
  return found;
};

/**
 * Conflicts between the user's stated dietary restrictions and the add-ins they picked.
 * "block" entries should stop generation; "warn" entries are advisory.
 */
export const checkAddInConflicts = (
  restrictions: string,
  addIns: SmoothieAddIn[]
): DietConflict[] => {
  const text = normalise(restrictions);
  const conflicts: DietConflict[] = [];
  const flagged = new Set<string>();

  const push = (addIn: SmoothieAddIn, severity: ConflictSeverity, reason: string) => {
    const dedupeKey = `${addIn.id}:${reason}`;
    if (flagged.has(dedupeKey)) return;
    flagged.add(dedupeKey);
    conflicts.push({ addInId: addIn.id, addInName: addIn.name, severity, reason });
  };

  for (const addIn of addIns) {
    for (const rule of ALLERGEN_RULES) {
      if (!matches(text, rule.keywords)) continue;
      const triggered = rule.tags
        ? hasAnyTag(addIn, rule.tags)
        : rule.requiresTags
          ? !hasAnyTag(addIn, rule.requiresTags)
          : false;
      if (triggered) push(addIn, rule.severity, rule.reason);
    }

    for (const rule of RESEARCH_FLAG_RULES) {
      if (rule.tags && hasAnyTag(addIn, rule.tags)) push(addIn, rule.severity, rule.reason);
    }

    if (matches(text, INFANT_KEYWORDS) && INFANT_UNSAFE_IDS.has(addIn.id)) {
      push(addIn, "block", "honey is not safe for infants under 12 months");
    }
  }

  const order: Record<ConflictSeverity, number> = { block: 0, warn: 1 };
  return conflicts.sort((a, b) => order[a.severity] - order[b.severity]);
};

export const addInsByIds = (ids: string[]): SmoothieAddIn[] =>
  SMOOTHIE_ADD_INS.filter((addIn) => ids.includes(addIn.id));
