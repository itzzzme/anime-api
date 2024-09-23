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
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Transfer-Encoding', 'chunked'); 

  res.write('{"success": true, "results": {');

  let hasSentFirstChunk = false;

  const sendChunk = (key, data) => {
    if (hasSentFirstChunk) {
      res.write(',');
    }
    res.write(`"${key}": ${JSON.stringify(data)}`);
    hasSentFirstChunk = true;
  };

  try {
    const results = await Promise.allSettled([
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
    const keys = [
      'spotlights', 'trending', 'topTen', 'today', 
      'topAiring', 'mostPopular', 'mostFavorite', 
      'latestCompleted', 'latestEpisode'
    ];

    keys.forEach((key, index) => {
      const result = results[index];
      if (result.status === 'fulfilled') {
        if (key === 'today') {
          sendChunk(key, { schedule: result.value });
        } else {
          sendChunk(key, result.value);
        }
      } else {
        sendChunk(key, null); 
      }
    });
    sendChunk('genres', genres);
    res.write('}}'); 
    res.end(); 
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
