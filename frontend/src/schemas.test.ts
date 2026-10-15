import { describe, expect, it } from "vitest";
import { productFormSchema } from "./schemas";

describe("productFormSchema", () => {
  it("coerces numeric form fields", () => {
    const result = productFormSchema.parse({ name: "Daikin", model: "FTX", description: "Подробное описание", price: "45000", coolingCapacityKw: "2.5", recommendedArea: "25", energyClass: "A++", stockQuantity: "3", imageUrl: "", brandId: "1", categoryId: "2" });
    expect(result.price).toBe(45000);
    expect(result.brandId).toBe(1);
  });

  it("rejects a negative price", () => {
    const result = productFormSchema.safeParse({ name: "Daikin", model: "FTX", description: "Подробное описание", price: -1, coolingCapacityKw: 2.5, recommendedArea: 25, energyClass: "A", stockQuantity: 1, imageUrl: "", brandId: 1, categoryId: 1 });
    expect(result.success).toBe(false);
  });

  it("rejects cooling capacity above the backend limit", () => {
    const result = productFormSchema.safeParse({ name: "Ballu", model: "Test", description: "Подробное описание", price: 45000, coolingCapacityKw: 500, recommendedArea: 25, energyClass: "A", stockQuantity: 1, imageUrl: "", brandId: 1, categoryId: 1 });
    expect(result.success).toBe(false);
  });

  it("accepts a local product image path", () => {
    const result = productFormSchema.safeParse({ name: "Daikin", model: "FTX", description: "Подробное описание", price: 45000, coolingCapacityKw: 2.5, recommendedArea: 25, energyClass: "A++", stockQuantity: 3, imageUrl: "/images/products/daikin-sensira.jpg", brandId: 1, categoryId: 2 });
    expect(result.success).toBe(true);
  });
});
