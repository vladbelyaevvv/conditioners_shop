import { asc, eq } from "drizzle-orm";
import { Router } from "express";
import { db } from "../db/index.js";
import { brands, categories } from "../db/schema.js";
import { asyncHandler, HttpError, parse } from "../http.js";
import { createSlug } from "../lib/slug.js";
import { entitySchema, idParamSchema } from "../validation.js";

interface EntityInput {
  name?: string;
  country?: string | null;
  description?: string | null;
}

interface EntityService {
  list(): Promise<unknown[]>;
  get(id: number): Promise<unknown | undefined>;
  create(input: EntityInput & { name: string }): Promise<unknown>;
  update(id: number, input: EntityInput): Promise<unknown | undefined>;
  remove(id: number): Promise<number | undefined>;
}

const brandService: EntityService = {
  list: () => db.select().from(brands).orderBy(asc(brands.name)),
  async get(id) {
    const [row] = await db.select().from(brands).where(eq(brands.id, id)).limit(1);
    return row;
  },
  async create(input) {
    const [row] = await db.insert(brands).values({ name: input.name, slug: createSlug(input.name), country: input.country }).returning();
    return row;
  },
  async update(id, input) {
    const values = { name: input.name, country: input.country, ...(input.name ? { slug: createSlug(input.name) } : {}) };
    const [row] = await db.update(brands).set(values).where(eq(brands.id, id)).returning();
    return row;
  },
  async remove(id) {
    const [row] = await db.delete(brands).where(eq(brands.id, id)).returning({ id: brands.id });
    return row?.id;
  },
};

const categoryService: EntityService = {
  list: () => db.select().from(categories).orderBy(asc(categories.name)),
  async get(id) {
    const [row] = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    return row;
  },
  async create(input) {
    const [row] = await db.insert(categories).values({ name: input.name, slug: createSlug(input.name), description: input.description }).returning();
    return row;
  },
  async update(id, input) {
    const values = { name: input.name, description: input.description, ...(input.name ? { slug: createSlug(input.name) } : {}) };
    const [row] = await db.update(categories).set(values).where(eq(categories.id, id)).returning();
    return row;
  },
  async remove(id) {
    const [row] = await db.delete(categories).where(eq(categories.id, id)).returning({ id: categories.id });
    return row?.id;
  },
};

function createEntityRouter(service: EntityService) {
  const router = Router();

  router.get("/", asyncHandler(async (_req, res) => res.json(await service.list())));
  router.get("/:id", asyncHandler(async (req, res) => {
    const { id } = parse(idParamSchema, req.params);
    const row = await service.get(id);
    if (!row) throw new HttpError(404, "Запись не найдена");
    res.json(row);
  }));
  router.post("/", asyncHandler(async (req, res) => {
    const input = parse(entitySchema, req.body);
    res.status(201).json(await service.create(input));
  }));
  router.patch("/:id", asyncHandler(async (req, res) => {
    const { id } = parse(idParamSchema, req.params);
    const input = parse(entitySchema.partial(), req.body);
    if (Object.keys(input).length === 0) throw new HttpError(400, "Нет данных для обновления");
    const row = await service.update(id, input);
    if (!row) throw new HttpError(404, "Запись не найдена");
    res.json(row);
  }));
  router.delete("/:id", asyncHandler(async (req, res) => {
    const { id } = parse(idParamSchema, req.params);
    if (!(await service.remove(id))) throw new HttpError(404, "Запись не найдена");
    res.status(204).send();
  }));

  return router;
}

export const brandsRouter = createEntityRouter(brandService);
export const categoriesRouter = createEntityRouter(categoryService);
