import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";
import type { AxeMatchers } from "jest-axe";

declare module "vitest" {
  // Note: the default `any` mirrors vitest's own declaration
  // (`interface Assertion<T = any>`); declaration merging requires the type
  // parameter lists to match exactly, so it cannot be narrowed here.
  interface Assertion<T = any>
    extends TestingLibraryMatchers<T, void>,
      AxeMatchers {}
  interface AsymmetricMatchersContaining
    extends TestingLibraryMatchers<unknown, void> {}
}
