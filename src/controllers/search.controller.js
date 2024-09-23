import extractSearchResults from "../extractors/search.extractor.js";
import countPages from "../helper/countPages.helper.js";
import { v1_base_url } from "../utils/base_v1.js";

export const search = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    let page = parseInt(req.query.page) || 1;
    const totalPages = await countPages(
      `https://${v1_base_url}/search?keyword=${keyword}`
    );
    page = Math.min(page, totalPages);
    if (page !== parseInt(req.query.page)) {
      return res.redirect(
        `${req.originalUrl.split("?")[0]}?keyword=${keyword}&page=${page}`
      );
    }
    const data = await extractSearchResults(encodeURIComponent(keyword), page);
    res.json({ success: true, results: { totalPages, data } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
