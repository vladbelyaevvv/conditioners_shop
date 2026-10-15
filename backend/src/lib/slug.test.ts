import { describe, expect, it } from "vitest";
import { createSlug } from "./slug.js";

describe("createSlug", () => {
  it("normalizes product names", () => {
    expect(createSlug("  Haier Coral 09  ")).toBe("haier-coral-09");
  });

  it("keeps cyrillic letters", () => {
    expect(createSlug("Сплит-система Ёлка")).toBe("сплит-система-елка");
  });
});
