import extractEpisodesList from "../extractors/episodeList.extractor.js";
import { getCachedData, setCachedData } from "../helper/cache.helper.js";

export const getEpisodes = async (req, res) => {
  const id = req.params.id;
  const cacheKey = `episodes_${id}`; 

  try {
    const cachedResponse = await getCachedData(cacheKey);
    if (cachedResponse) {
      return res.json({ success: true, results: cachedResponse });
    }

    const data = await extractEpisodesList(encodeURIComponent(id));
    await setCachedData(cacheKey, data);

    return res.json({ success: true, results: data });
  } catch (e) {
    console.error("Error fetching episodes:", e);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
