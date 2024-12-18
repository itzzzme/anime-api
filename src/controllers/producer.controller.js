import { getCachedData, setCachedData } from "../helper/cache.helper.js";
import extractPage from "../helper/extractPages.helper.js";

export const getProducer = async (req) => {
  const { id } = req.params;
  const routeType = `producer/${id}`;
  const requestedPage = parseInt(req.query.page) || 1;
  const cacheKey = `${routeType.replace(/\//g, "_")}_page_${requestedPage}`;
  try {
    const cachedResponse = await getCachedData(cacheKey);
    if (cachedResponse && Object.keys(cachedResponse).length > 0) {
      return cachedResponse;
    }
    const [data, totalPages] = await extractPage(requestedPage, routeType);
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
