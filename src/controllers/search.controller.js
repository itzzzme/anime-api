import extractSearchResults from "../extractors/search.extractor.js";
import countPages from "../helper/countPages.helper.js";
import { v1_base_url } from "../utils/base_v1.js";

export const search = async (req, res) => {
  const keyword = req.query.keyword;
  let page = parseInt(req.query.page, 10) || 1;
  try {
    const totalPages = await countPages(`https://${v1_base_url}/search?keyword=${keyword}`);
    if (page > totalPages) {
      page = totalPages;
      return res.redirect(
        `${req.originalUrl.split("?")[0]}?keyword=${keyword}&page=${page}`
      );
    }
    const data = await extractSearchResults(encodeURIComponent(keyword), page);
    res.json({ success: true, results: data });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
