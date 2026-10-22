import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { config } from "../config.js";
import * as schema from "./schema.js";

export const pool = new pg.Pool({
  connectionString: config.DATABASE_URL,
  connectionTimeoutMillis: 3000,
});

pool.on("error", (error) => {
  console.error(JSON.stringify({
    timestamp: new Date().toISOString(),
    level: "error",
    message: "postgres_pool_error",
    service: { name: "climate-store-backend" },
    error: { message: error.message },
  }));
});

export const db = drizzle(pool, { schema });

