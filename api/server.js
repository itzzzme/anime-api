import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { createApiRoutes } from "../src/routes/apiRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4444;
const __filename = fileURLToPath(import.meta.url);
const publicDir = path.join(dirname(dirname(__filename)), "public");
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",");

app.use(
  cors({
    origin: allowedOrigins || "*",
    methods: ["GET"],
  })
);

app.use(express.static(publicDir));

const jsonResponse = (res, data, status = 200) => {
  if (!res.headersSent) {
    try {
      // Use a custom replacer function to handle circular references
      const getCircularReplacer = () => {
        const seen = new WeakSet();
        return (key, value) => {
          if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
              return "[Circular]";
            }
            seen.add(value);
          }
          return value;
        };
      };
      
      return res.status(status).json({
        success: true,
        results: JSON.parse(JSON.stringify(data, getCircularReplacer()))
      });
    } catch (err) {
      console.error("Error in jsonResponse:", err);
      return jsonError(res);
    }
  }
};

const jsonError = (res, message = "Internal server error", status = 500) => {
  if (!res.headersSent) {
    return res.status(status).json({ success: false, message });
  }
};

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
