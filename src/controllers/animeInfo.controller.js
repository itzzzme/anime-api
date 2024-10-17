import extractAnimeInfo from "../extractors/animeInfo.extractor.js";
import extractSeasons from "../extractors/seasons.extractor.js";
import { getCachedData, setCachedData } from "../helper/cache.helper.js";

export const getAnimeInfo = async (c) => {
  const { id } = c.req.query();
  const cacheKey = `animeInfo_${id}`;
  try {
    const [seasons, data] = await Promise.all([
      extractSeasons(id),
      extractAnimeInfo(id),
    ]);
    const responseData = { data, seasons };
    return responseData;
  } catch (e) {
    console.error(e);
    return e;
  }
};
