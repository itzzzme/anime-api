import extractAnimeInfo from "../extractors/animeInfo.extractor.js";
import extractSeasons from "../extractors/seasons.extractor.js";
import { getCachedData, setCachedData } from "../helper/cache.helper.js";

export const getAnimeInfo = async (req, res) => {
  const id = req.query.id;
  const cacheKey = `animeInfo_${id}`;
  try {
    const cachedResponse = await getCachedData(cacheKey);
    if (cachedResponse) {
      return res.json(cachedResponse);
    }
    const [seasons, data] = await Promise.all([
      extractSeasons(id),
      extractAnimeInfo(id),
    ]);

    const responseData = {
      success: true,
      results: { data, seasons },
    };
    setCachedData(cacheKey, responseData).catch((err) => {
      console.error("Failed to set cache:", err);
    });
    return res.json(responseData);
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
