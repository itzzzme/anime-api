import * as spotlightController from "../helper/spotlight.helper.js";
import * as trendingController from "../helper/trending.helper.js";
import extractPage from "../helper/extractPages.helper.js";
import extractTopTen from "../extractors/topten.extractor.js";
import { routeTypes } from "../routes/category.route.js";
import extractSchedule from "../extractors/schedule.extractor.js";

const genres = routeTypes
  .slice(0, 41)
  .map((genre) => genre.replace("genre/", ""));

export const getHomeInfo = async (req, res) => {
  try {
    const [
      spotlights,
      trending,
      topTen,
      schedule,
      topAiring,
      mostPopular,
      mostFavorite,
      latestCompleted,
      latestEpisode,
    ] = await Promise.all([
      spotlightController.getSpotlights(),
      trendingController.getTrending(),
      extractTopTen(),
      extractSchedule(new Date().toISOString().split("T")[0]),
      extractPage(1, "top-airing"),
      extractPage(1, "most-popular"),
      extractPage(1, "most-favorite"),
      extractPage(1, "completed"),
      extractPage(1, "recently-updated"),
    ]);

    res.json({
      success: true,
      results: {
        spotlights,
        trending,
        topTen,
        today: { schedule },
        topAiring,
        mostPopular,
        mostFavorite,
        latestCompleted,
        latestEpisode,
        genres,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
