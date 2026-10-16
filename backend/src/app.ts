import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config.js";
import { errorHandler } from "./http.js";
import { brandsRouter, categoriesRouter } from "./routes/entities.js";
import { productsRouter } from "./routes/products.js";
import { register } from "./metrics.js";

export const app = express();

app.use(helmet());
app.use(cors({ origin: config.CLIENT_ORIGIN.split(",").map((origin) => origin.trim()) }));
app.use(express.json({ limit: "100kb" }));
app.use(
  morgan((tokens, req, res) => {
    const status = Number((tokens.status ?? (() => ""))(req, res));

    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level: status >= 500 ? "error" : status >= 400 ? "warn" : "info",
      message: "http_request",
      service: {
        name: "climate-store-backend",
      },
      http: {
        method: (tokens.method ?? (() => ""))(req, res),
        path: (tokens.url ?? (() => ""))(req, res),
        status_code: status,
        response_time_ms: Number(
          (tokens["response-time"] ?? (() => ""))(req, res),
        ),
      },
      client: {
        ip: (tokens["remote-addr"] ?? (() => ""))(req, res),
      },
    });
  }),
);

app.get("/metrics", async (_req, res) => {
  res.setHeader("Content-Type", register.contentType);
  res.end(await register.metrics());
});
app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/products", productsRouter);
app.use("/api/brands", brandsRouter);
app.use("/api/categories", categoriesRouter);
app.use((_req, res) => res.status(404).json({ message: "Маршрут не найден" }));
app.use(errorHandler);
