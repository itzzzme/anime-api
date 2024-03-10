import express from "express";
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

const app = express();
const port = process.env.PORT || 4444;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(join(dirname(__dirname), "public")));

app.get("/", handleHomePage);

app.get("/api/", async (req, res) => {
  await homeInfoController.getHomeInfo(req, res);
});

routeTypes.forEach((routeType) => {
  app.get(`/api/${routeType}`, async (req, res) => {
    await categoryController.getCategory(req, res, routeType);
  });
});

app.get("/api/top-ten", async (req, res) => {
  await topTenController.getTopTen(req, res);
});

app.get("/api/info", async (req, res) => {
  await animeInfoController.getAnimeInfo(req, res);
});

app.get("/api/stream", async (req, res) => {
  await streamController.getStreamInfo(req, res);
});

app.get("/api/search", async (req, res) => {
  await searchController.search(req, res);
});

app.get("*", handle404);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
