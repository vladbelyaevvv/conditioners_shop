import { and, asc, desc, eq, gte, ilike, lte, or, sql, type SQL } from "drizzle-orm";
import { Router } from "express";
import { db } from "../db/index.js";
import { brands, categories, products } from "../db/schema.js";
import { asyncHandler, HttpError, parse } from "../http.js";
import { createSlug } from "../lib/slug.js";
import { idParamSchema, productPatchSchema, productQuerySchema, productSchema } from "../validation.js";
import {
  catalogSearchesTotal,
  productDetailViewsTotal,
  productsCreatedTotal,
  productsDeletedTotal,
  productsUpdatedTotal,
} from "../metrics.js";

export const productsRouter = Router();

const selection = {
  id: products.id,
  name: products.name,
  slug: products.slug,
  model: products.model,
  description: products.description,
  price: products.price,
  coolingCapacityKw: products.coolingCapacityKw,
  recommendedArea: products.recommendedArea,
  energyClass: products.energyClass,
  stockQuantity: products.stockQuantity,
  imageUrl: products.imageUrl,
  brandId: products.brandId,
  brandName: brands.name,
  categoryId: products.categoryId,
  categoryName: categories.name,
  createdAt: products.createdAt,
  updatedAt: products.updatedAt,
};

function serialize<T extends { price: string; coolingCapacityKw: string }>(row: T) {
  return { ...row, price: Number(row.price), coolingCapacityKw: Number(row.coolingCapacityKw) };
}

async function findProduct(id: number) {
  const [row] = await db
    .select(selection)
    .from(products)
    .innerJoin(brands, eq(products.brandId, brands.id))
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.id, id))
    .limit(1);
  return row ? serialize(row) : null;
}

productsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const query = parse(productQuerySchema, req.query);
    const conditions: SQL[] = [];

    if (query.search) {
      conditions.push(
        or(
          ilike(products.name, `%${query.search}%`),
          ilike(products.model, `%${query.search}%`),
        )!,
      );
    }

    if (query.brandId) conditions.push(eq(products.brandId, query.brandId));
    if (query.categoryId) conditions.push(eq(products.categoryId, query.categoryId));
    if (query.minPrice !== undefined) conditions.push(gte(products.price, String(query.minPrice)));
    if (query.maxPrice !== undefined) conditions.push(lte(products.price, String(query.maxPrice)));
    if (query.inStock === "true") conditions.push(sql`${products.stockQuantity} > 0`);
    if (query.inStock === "false") conditions.push(eq(products.stockQuantity, 0));

    const rows = await db
      .select(selection)
      .from(products)
      .innerJoin(brands, eq(products.brandId, brands.id))
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(products.createdAt), asc(products.name));

    if (query.search) catalogSearchesTotal.inc();

    res.json(rows.map(serialize));
  }),
);

productsRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = parse(idParamSchema, req.params);
    const row = await findProduct(id);
    if (!row) throw new HttpError(404, "Кондиционер не найден");
    productDetailViewsTotal.inc();
    res.json(row);
  }),
);

productsRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const input = parse(productSchema, req.body);
    const [created] = await db
      .insert(products)
      .values({
        ...input,
        slug: createSlug(`${input.name}-${input.model}`),
        price: String(input.price),
        coolingCapacityKw: String(input.coolingCapacityKw),
      })
      .returning({ id: products.id });
    const row = await findProduct(created!.id);
    productsCreatedTotal.inc();
    res.status(201).json(row);
  }),
);

productsRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = parse(idParamSchema, req.params);
    const input = parse(productPatchSchema, req.body);
    const current = await findProduct(id);
    if (!current) throw new HttpError(404, "Кондиционер не найден");
    const { price, coolingCapacityKw, ...rest } = input;
    await db
      .update(products)
      .set({
        ...rest,
        ...(price !== undefined ? { price: String(price) } : {}),
        ...(coolingCapacityKw !== undefined ? { coolingCapacityKw: String(coolingCapacityKw) } : {}),
        ...(input.name || input.model
          ? { slug: createSlug(`${input.name ?? current.name}-${input.model ?? current.model}`) }
          : {}),
        updatedAt: new Date(),
      })
      .where(eq(products.id, id));
    const updated = await findProduct(id);
    if (!updated) throw new HttpError(404, "Кондиционер не найден");

    productsUpdatedTotal.inc();
    res.json(updated);
  }),
);

productsRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = parse(idParamSchema, req.params);
    const [row] = await db.delete(products).where(eq(products.id, id)).returning({ id: products.id });
    if (!row) throw new HttpError(404, "Кондиционер не найден");
    productsDeletedTotal.inc();
    res.status(204).send();
  }),
);
