import { extractor } from "../extractors/category.extractor.js";
import { getCachedData, setCachedData } from "../helper/cache.helper.js";

export const getCategory = async (req, res, routeType) => {
  const requestedPage = parseInt(req.query.page) || 1;
  const cacheKey = `${routeType.replace(/\//g, "_")}_page_${requestedPage}`;

  try {
    const cachedResponse = await getCachedData(cacheKey);
    if (cachedResponse) {
      return res.json(cachedResponse);
    }

    const { data, totalPages } = await extractor(routeType, requestedPage);

    const pageToRedirect = Math.min(requestedPage, totalPages);
    if (pageToRedirect !== requestedPage) {
      return res.redirect(
        `${req.originalUrl.split("?")[0]}?page=${pageToRedirect}`
      );
    }

    const responseData = { success: true, results: { totalPages, data } };

    setCachedData(cacheKey, responseData).catch((err) => {
      console.error("Failed to set cache:", err);
    });

    return res.json(responseData);
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
