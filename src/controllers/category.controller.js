import { extractor } from "../extractors/category.extractor.js";
import { getCachedData, setCachedData } from "../helper/cache.helper.js";

export const getCategory = async (c, routeType) => {
  if (routeType === "genre/martial-arts") {
    routeType = "genre/marial-arts";
  }
  const requestedPage = parseInt(c.req.query("page")) || 1;
  const cacheKey = `${routeType.replace(/\//g, "_")}_page_${requestedPage}`;
  try {
    const cachedResponse = await getCachedData(cacheKey);
    if (cachedResponse) {
      return cachedResponse;
    }
    const { data, totalPages } = await extractor(routeType, requestedPage);
    if (requestedPage > totalPages) {
      const error = new Error("Requested page exceeds total available pages.");
      error.status = 404;
      throw error;
    }
    const responseData = { totalPages: totalPages, data: data };
    setCachedData(cacheKey, responseData).catch((err) => {
      console.error("Failed to set cache:", err);
    });
    return { data, totalPages };
  } catch (e) {
    console.error(e);
    if (e.status === 404) {
      throw e;
    }
    throw new Error("An error occurred while processing your request.");
  }
};
