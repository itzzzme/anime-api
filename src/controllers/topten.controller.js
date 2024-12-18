import extractTopTen from "../extractors/topten.extractor.js";
import { getCachedData, setCachedData } from "../helper/cache.helper.js";

export const getTopTen = async (req,res) => {
  const cacheKey = "topTen";
  try {
    const cachedResponse = await getCachedData(cacheKey);
    if (cachedResponse && Object.keys(cachedResponse).length > 0) {
      return cachedResponse;
    }
    const topTen = await extractTopTen();
    await setCachedData(cacheKey, topTen).catch((err) => {
      console.error("Failed to set cache:", err);
    });
    return topTen;
  } catch (e) {
    console.error(e);
    return c
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};
