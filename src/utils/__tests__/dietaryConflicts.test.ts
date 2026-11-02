import { describe, it, expect } from "vitest";
import {
  addInsByIds,
  checkAddInConflicts,
  detectRestrictions,
} from "@/utils/dietaryConflicts";

const pick = (...ids: string[]) => addInsByIds(ids);

describe("detectRestrictions", () => {
  it("recognises the phrasings people actually type", () => {
    expect(detectRestrictions("nut allergy, gluten free")).toEqual([
      "nuts",
      "gluten",
    ]);
  });

  it("is empty when nothing is recognised", () => {
    expect(detectRestrictions("")).toEqual([]);
  });
});

describe("checkAddInConflicts", () => {
  it("blocks a nut ingredient for a nut allergy", () => {
    const conflicts = checkAddInConflicts("nut allergy", pick("cashew-butter"));
    expect(conflicts[0].severity).toBe("block");
    expect(conflicts[0].addInName).toMatch(/cashew/i);
  });

  it("does not block seeds when only nuts are excluded", () => {
    expect(checkAddInConflicts("nut allergy", pick("chia-seeds"))).toEqual([]);
  });

  it("blocks oats for coeliac because they are not certified gluten-free", () => {
    const conflicts = checkAddInConflicts("coeliac", pick("rolled-oats"));
    expect(conflicts.some((c) => c.severity === "block")).toBe(true);
  });

  it("allows quinoa flakes for coeliac", () => {
    const conflicts = checkAddInConflicts("coeliac", pick("quinoa-flakes"));
    expect(conflicts.filter((c) => c.severity === "block")).toEqual([]);
  });

  it("blocks dairy and honey for a vegan", () => {
    const conflicts = checkAddInConflicts("vegan", pick("greek-yogurt", "honey"));
    expect(conflicts.filter((c) => c.severity === "block")).toHaveLength(2);
  });

  it("blocks high-FODMAP choices for IBS", () => {
    const conflicts = checkAddInConflicts("ibs", pick("cashew-butter", "dates"));
    expect(conflicts.filter((c) => c.severity === "block")).toHaveLength(2);
  });

  it("warns about caffeine instead of blocking it", () => {
    const conflicts = checkAddInConflicts("no caffeine", pick("matcha"));
    expect(conflicts[0].severity).toBe("warn");
  });

  it("blocks honey when the drink is for an infant", () => {
    const conflicts = checkAddInConflicts("for my toddler", pick("honey"));
    expect(conflicts[0].severity).toBe("block");
  });

  it("always flags ashwagandha and warns on weak-evidence items", () => {
    const conflicts = checkAddInConflicts("", pick("ashwagandha", "maca"));
    expect(conflicts.find((c) => c.addInId === "ashwagandha")?.severity).toBe(
      "block"
    );
    expect(conflicts.find((c) => c.addInId === "maca")?.severity).toBe("warn");
  });

  it("returns nothing for unrestricted, unflagged picks", () => {
    expect(checkAddInConflicts("", pick("chia-seeds", "fresh-ginger"))).toEqual(
      []
    );
  });
});
