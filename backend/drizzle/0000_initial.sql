CREATE TABLE IF NOT EXISTS "brands" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" varchar(120) NOT NULL,
  "slug" varchar(140) NOT NULL,
  "country" varchar(100),
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "brands_slug_idx" ON "brands" ("slug");

CREATE TABLE IF NOT EXISTS "categories" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" varchar(120) NOT NULL,
  "slug" varchar(140) NOT NULL,
  "description" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "categories_slug_idx" ON "categories" ("slug");

CREATE TABLE IF NOT EXISTS "products" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" varchar(200) NOT NULL,
  "slug" varchar(220) NOT NULL,
  "model" varchar(100) NOT NULL,
  "description" text NOT NULL,
  "price" numeric(12,2) NOT NULL,
  "cooling_capacity_kw" numeric(5,2) NOT NULL,
  "recommended_area" integer NOT NULL,
  "energy_class" varchar(10) NOT NULL,
  "stock_quantity" integer DEFAULT 0 NOT NULL,
  "image_url" text,
  "brand_id" integer NOT NULL,
  "category_id" integer NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "products_price_positive" CHECK ("products"."price" > 0),
  CONSTRAINT "products_area_positive" CHECK ("products"."recommended_area" > 0),
  CONSTRAINT "products_stock_non_negative" CHECK ("products"."stock_quantity" >= 0)
);
CREATE UNIQUE INDEX IF NOT EXISTS "products_slug_idx" ON "products" ("slug");
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE restrict;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE restrict;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
