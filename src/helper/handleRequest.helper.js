import { extractor } from "../extractors/category.extractor.js";
import { getCachedData, setCachedData } from "../helper/cache.helper.js";

export const handleRequest = async (req, res, extractorType) => {
  const requestedPage = parseInt(req.query.page) || 1;
  const cacheKey = `${extractorType.replace(/\//g, '_')}_page_${requestedPage}`;
  try {
    const cachedResponse = await getCachedData(cacheKey);
    if (cachedResponse) {
      return res.json(cachedResponse);
    }
    const { data, totalPages } = await extractor(extractorType, requestedPage);

    const pageToRedirect = Math.min(requestedPage, totalPages);
    if (pageToRedirect !== requestedPage) {
      return res.redirect(
        `${req.originalUrl.split("?")[0]}?page=${pageToRedirect}`
      );
    }

    const responseData = { success: true, results: { totalPages, data } };

    await setCachedData(cacheKey, responseData);

    res.json(responseData);
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
