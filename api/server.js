import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import NodeCache from "node-cache";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { handleHomePage } from "../src/controllers/home.controller.js";
import { handle404 } from "../src/controllers/404.controller.js";
import { routeTypes } from "../src/routes/category.route.js";
import * as homeInfoController from "../src/controllers/homeInfo.controller.js";
import * as categoryController from "../src/controllers/category.controller.js";
import * as topTenController from "../src/controllers/topten.controller.js";
import * as animeInfoController from "../src/controllers/animeInfo.controller.js";
import * as streamController from "../src/controllers/streamInfo.controller.js";
import * as searchController from "../src/controllers/search.controller.js";
import * as episodeListController from "../src/controllers/episodeList.controller.js";
import * as suggestionsController from "../src/controllers/suggestion.controller.js";
import * as scheduleController from "../src/controllers/schedule.controller.js";
import * as serversController from "../src/controllers/servers.controller.js";
import { handleMaintenance } from "../src/controllers/maintenance.controller.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4444;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const cache = new NodeCache({ stdTTL: 86400, checkperiod: 1800 });

app.use(cors());
app.use(express.static(join(dirname(__dirname), "public")));
app.use(morgan("combined"));

const cacheMiddleware = (req, res, next) => {
  const key = req.originalUrl;
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    return res.json(cachedResponse);
  }

  res.sendResponse = res.json;
  res.json = (body) => {
    cache.set(key, body);
    res.sendResponse(body);
  };

  next();
};

app.get("/", handleHomePage);

app.get("/api/", cacheMiddleware, async (req, res) => {
  await homeInfoController.getHomeInfo(req, res);
});

routeTypes.forEach((routeType) => {
  app.get(`/api/${routeType}`, cacheMiddleware, async (req, res) => {
    await categoryController.getCategory(req, res, routeType);
  });
});

app.get("/api/top-ten", cacheMiddleware, async (req, res) => {
  await topTenController.getTopTen(req, res);
});

app.get("/api/info", cacheMiddleware, async (req, res) => {
  await animeInfoController.getAnimeInfo(req, res);
});

app.get("/api/episodes/:id", cacheMiddleware, async (req, res) => {
  await episodeListController.getEpisodes(req, res);
});

app.get("/api/servers/:id", async (req, res) => {
  await serversController.getServers(req, res);
});
app.get("/api/stream", async (req, res) => {
  await streamController.getStreamInfo(req, res);
});

app.get("/api/search", cacheMiddleware, async (req, res) => {
  await searchController.search(req, res);
});
app.get("/api/schedule", cacheMiddleware, async (req, res) => {
  await scheduleController.getSchedule(req, res);
});

app.get("/api/search/suggest", cacheMiddleware, async (req, res) => {
  await suggestionsController.getSuggestions(req, res);
});

app.get("*", handle404);
// app.get("*", handleMaintenance);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
