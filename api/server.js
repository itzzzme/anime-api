import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { createApiRoutes } from "../src/routes/apiRoutes.js";

dotenv.config();

const app = new Hono();
const PORT = process.env.PORT || 4444;
const __filename = fileURLToPath(import.meta.url);
const publicDir = path.join(dirname(dirname(__filename)), "public");
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",");

app.use(
  cors({
    allowMethods: ["GET"],
    origin: allowedOrigins,
  })
);

app.use("/", serveStatic({ root: "public" }));

const jsonResponse = (c, data, status = 200) =>
  c.json({ success: true, results: data }, { status });
const jsonError = (c, message = "Internal server error", status = 500) =>
  c.json({ success: false, message }, { status });

createApiRoutes(app, jsonResponse, jsonError);

app.get("*", async (c) => {
  try {
    const data = fs.readFileSync(path.join(publicDir, "404.html"), "utf-8");
    return c.html(data, 404);
  } catch (err) {
    return c.text("Error loading 404 page.", 500);
  }
});

serve({
  port: PORT,
  fetch: app.fetch,
}).addListener("listening", () =>
  console.info(`Listening at http://localhost:${PORT}`)
);
