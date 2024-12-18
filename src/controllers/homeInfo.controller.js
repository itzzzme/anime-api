import getSpotlights from "../extractors/spotlight.extractor.js";
import getTrending from "../extractors/trending.extractor.js";
import extractPage from "../helper/extractPages.helper.js";
import extractTopTen from "../extractors/topten.extractor.js";
import { routeTypes } from "../routes/category.route.js";
import extractSchedule from "../extractors/schedule.extractor.js";
import { getCachedData, setCachedData } from "../helper/cache.helper.js";

const genres = routeTypes
  .slice(0, 41)
  .map((genre) => genre.replace("genre/", ""));

export const getHomeInfo = async (req,res) => {
  const cacheKey = "homeInfo";
  try {
    const cachedResponse = await getCachedData(cacheKey);
    if (cachedResponse && Object.keys(cachedResponse).length > 0) {
      return cachedResponse;
    }
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
      topUpcoming,
      recentlyAdded,
    ] = await Promise.all([
      getSpotlights(),
      getTrending(),
      extractTopTen(),
      extractSchedule(new Date().toISOString().split("T")[0]),
      extractPage(1, "top-airing"),
      extractPage(1, "most-popular"),
      extractPage(1, "most-favorite"),
      extractPage(1, "completed"),
      extractPage(1, "recently-updated"),
      extractPage(1, "top-upcoming"),
      extractPage(1, "recently-added"),
    ]);
    const responseData = {
      spotlights,
      trending,
      topTen,
      today: { schedule },
      topAiring: topAiring[0],
      mostPopular: mostPopular[0],
      mostFavorite: mostFavorite[0],
      latestCompleted: latestCompleted[0],
      latestEpisode: latestEpisode[0],
      topUpcoming: topUpcoming[0],
      recentlyAdded: recentlyAdded[0],
      genres,
    };

    setCachedData(cacheKey, responseData).catch((err) => {
      console.error("Failed to set cache:", err);
    });
    return responseData;
  } catch (fetchError) {
    console.error("Error fetching fresh data:", fetchError);
    return fetchError;
  }
};
