import { app } from "./app.js";
import { config } from "./config.js";
import { pool } from "./db/index.js";

const server = app.listen(config.PORT, () => {
  console.log(`API is listening on port ${config.PORT}`);
});

async function shutdown(signal: string) {
  console.log(`${signal} received, shutting down`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));
