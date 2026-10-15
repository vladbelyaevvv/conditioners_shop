import { z } from "zod";

const id = z.coerce.number().int().positive();
const localProductImage = z.string().regex(/^\/images\/products\/[a-z0-9._-]+$/i);
const nullableUrl = z
  .union([z.url(), localProductImage, z.literal("")])
  .optional()
  .transform((value) => value || null);

export const idParamSchema = z.object({ id });

export const entitySchema = z.object({
  name: z.string().trim().min(2).max(120),
  country: z.string().trim().max(100).nullable().optional(),
  description: z.string().trim().max(1000).nullable().optional(),
});

export const productSchema = z.object({
  name: z.string().trim().min(2).max(200),
  model: z.string().trim().min(1).max(100),
  description: z.string().trim().min(10).max(5000),
  price: z.coerce.number().positive().max(100_000_000),
  coolingCapacityKw: z.coerce.number().positive().max(100),
  recommendedArea: z.coerce.number().int().positive().max(10_000),
  energyClass: z.string().trim().min(1).max(10),
  stockQuantity: z.coerce.number().int().nonnegative().max(1_000_000),
  imageUrl: nullableUrl,
  brandId: id,
  categoryId: id,
});

export const productPatchSchema = productSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "At least one field is required",
);

export const productQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  brandId: id.optional(),
  categoryId: id.optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  inStock: z.enum(["true", "false"]).optional(),
});
