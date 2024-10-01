import extractTopTen from "../extractors/topten.extractor.js";
import { getCachedData, setCachedData } from "../helper/cache.helper.js";
export const getTopTen = async (req, res) => {
  const cacheKey = "topTen";
  try {
    const cachedResponse = await getCachedData(cacheKey);
    if (cachedResponse) {
      return res.json(cachedResponse);
    }
    const topTen = await extractTopTen();

    const responseData = {
      success: true,
      results: { topTen },
    };
    await setCachedData(cacheKey, responseData);
    return res.json(responseData);
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
