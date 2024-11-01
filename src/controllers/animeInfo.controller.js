import extractAnimeInfo from "../extractors/animeInfo.extractor.js";
import extractSeasons from "../extractors/seasons.extractor.js";
import { getCachedData, setCachedData } from "../helper/cache.helper.js";

export const getAnimeInfo = async (c) => {
  const { id } = c.req.query();
  const cacheKey = `animeInfo_${id}`;
  try {
    const cachedResponse = await getCachedData(cacheKey);
    if (cachedResponse) return cachedResponse;
    const [seasons, data] = await Promise.all([
      extractSeasons(id),
      extractAnimeInfo(id),
    ]);
    const responseData = { data: data, seasons: seasons };
    if ((seasons && seasons.length > 0) || (data && data.length > 0))
      setCachedData(cacheKey, responseData).catch((err) => {
        console.error("Failed to set cache:", err);
      });
    return responseData;
  } catch (e) {
    console.error(e);
    return e;
  }
};
