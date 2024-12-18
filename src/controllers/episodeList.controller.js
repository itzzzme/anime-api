import extractEpisodesList from "../extractors/episodeList.extractor.js";
import { getCachedData, setCachedData } from "../helper/cache.helper.js";

export const getEpisodes = async (req,res) => {
  const { id } = req.params;
  const cacheKey = `episodes_${id}`;
  try {
    const cachedResponse = await getCachedData(cacheKey);
    if (cachedResponse && Object.keys(cachedResponse).length > 0) {
      return cachedResponse;
    }
    const data = await extractEpisodesList(encodeURIComponent(id));
    setCachedData(cacheKey, data).catch((err) => {
      console.error("Failed to set cache:", err);
    });
    return data;
  } catch (e) {
    console.error("Error fetching episodes:", e);
    return e;
  }
};
