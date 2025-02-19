import * as homeInfoController from "../controllers/homeInfo.controller.js";
import * as categoryController from "../controllers/category.controller.js";
import * as topTenController from "../controllers/topten.controller.js";
import * as animeInfoController from "../controllers/animeInfo.controller.js";
import * as streamController from "../controllers/streamInfo.controller.js";
import * as searchController from "../controllers/search.controller.js";
import * as episodeListController from "../controllers/episodeList.controller.js";
import * as suggestionsController from "../controllers/suggestion.controller.js";
import * as scheduleController from "../controllers/schedule.controller.js";
import * as serversController from "../controllers/servers.controller.js";
import * as randomController from "../controllers/random.controller.js";
import * as qtipController from "../controllers/qtip.controller.js";
import * as randomIdController from "../controllers/randomId.controller.js";
import * as producerController from "../controllers/producer.controller.js";
import * as characterListController from "../controllers/voiceactor.controller.js";
import * as nextEpisodeScheduleController from "../controllers/nextEpisodeSchedule.controller.js";
import { routeTypes } from "./category.route.js";
import { getWatchlist } from "../controllers/watchlist.controller.js";
import getVoiceActors from "../controllers/actors.controller.js";
import getCharacter from "../controllers/characters.controller.js";

export const createApiRoutes = (app, jsonResponse, jsonError) => {
  const createRoute = (path, controllerMethod) => {
    app.get(path, async (req, res) => {
      try {
        const data = await controllerMethod(req, res);
        if (!res.headersSent) {
          return jsonResponse(res, data);
        }
      } catch (err) {
        console.error(`Error in route ${path}:`, err);
        if (!res.headersSent) {
          return jsonError(res, err.message || "Internal server error");
        }
      }
    });
  };

  ["/api", "/api/"].forEach((route) => {
    app.get(route, async (req, res) => {
      try {
        const data = await homeInfoController.getHomeInfo(req, res);
        if (!res.headersSent) {
          return jsonResponse(res, data);
        }
      } catch (err) {
        console.error("Error in home route:", err);
        if (!res.headersSent) {
          return jsonError(res, err.message || "Internal server error");
        }
      }
    });
  });

  routeTypes.forEach((routeType) =>
    createRoute(`/api/${routeType}`, (req, res) =>
      categoryController.getCategory(req, res, routeType)
    )
  );

  createRoute("/api/top-ten", topTenController.getTopTen);
  createRoute("/api/info", animeInfoController.getAnimeInfo);
  createRoute("/api/episodes/:id", episodeListController.getEpisodes);
  createRoute("/api/servers/:id", serversController.getServers);
  createRoute("/api/stream", streamController.getStreamInfo);
  createRoute("/api/search", searchController.search);
  createRoute("/api/search/suggest", suggestionsController.getSuggestions);
  createRoute("/api/schedule", scheduleController.getSchedule);
  createRoute(
    "/api/schedule/:id",
    nextEpisodeScheduleController.getNextEpisodeSchedule
  );
  createRoute("/api/random", randomController.getRandom);
  createRoute("/api/random/id", randomIdController.getRandomId);
  createRoute("/api/qtip/:id", qtipController.getQtip);
  createRoute("/api/producer/:id", producerController.getProducer);
  createRoute(
    "/api/character/list/:id",
    characterListController.getVoiceActors
  );
  createRoute("/api/watchlist/:userId/:page?", getWatchlist);
  createRoute("/api/actors/:id", getVoiceActors);
  createRoute("/api/character/:id", getCharacter);
};
