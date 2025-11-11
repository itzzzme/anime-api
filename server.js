import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { createApiRoutes } from "./src/routes/apiRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4444;
const __filename = fileURLToPath(import.meta.url);
const publicDir = path.join(dirname(__filename), "public");
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",");

// Express CORS setup
app.use(
  cors({
    origin: allowedOrigins?.includes("*") ? "*" : allowedOrigins || [],
    methods: ["GET"],
  })
);

// Custom CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (
    !allowedOrigins ||
    allowedOrigins.includes("*") ||
    (origin && allowedOrigins.includes(origin))
  ) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return next();
  }
  res
    .status(403)
    .json({ success: false, message: "Forbidden: Origin not allowed" });
});

app.use(express.static(publicDir, { redirect: false }));

const jsonResponse = (res, data, status = 200) =>
  res.status(status).json({ success: true, results: data });

const jsonError = (res, message = "Internal server error", status = 500) =>
  res.status(status).json({ success: false, message });

createApiRoutes(app, jsonResponse, jsonError);

app.get("*", (req, res) => {
  const filePath = path.join(publicDir, "404.html");
  if (fs.existsSync(filePath)) {
    res.status(404).sendFile(filePath);
  } else {
    res.status(500).send("Error loading 404 page.");
  }
});

app.listen(PORT, () => {
  console.info(`Listening at ${PORT}`);
});
