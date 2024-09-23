import { extractor } from "../extractors/category.extractor.js";

export const handleRequest = async (req, res, extractorType) => {
  try {
    let requestedPage = parseInt(req.query.page) || 1;
    const { data, totalPages } = await extractor(extractorType, requestedPage);

    requestedPage = Math.min(requestedPage, totalPages);

    if (requestedPage !== parseInt(req.query.page)) {
      return res.redirect(
        `${req.originalUrl.split("?")[0]}?page=${requestedPage}`
      );
    }
    res.json({ success: true, results: { totalPages, data } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
