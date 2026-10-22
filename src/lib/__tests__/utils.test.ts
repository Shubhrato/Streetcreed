import { describe, expect, it } from "vitest";
import { formatPrice, slugify } from "../utils";

describe("formatPrice", () => {
  it("formats whole rupees without paise", () => {
    expect(formatPrice(250)).toBe("₹250");
  });
  it("formats cents when needed", () => {
    expect(formatPrice(129.5)).toBe("₹129.50");
  });
});

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Camel Wool Overcoat")).toBe("camel-wool-overcoat");
  });
  it("strips punctuation and trims hyphens", () => {
    expect(slugify("  Silk — Dress! ")).toBe("silk-dress");
  });
});
