import extractSearchResults from "../extractors/search.extractor.js";
import countPages from "../helper/countPages.helper.js";
import { v1_base_url } from "../utils/base_v1.js";

export const search = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Transfer-Encoding', 'chunked'); // Allow streaming

  try {
    const keyword = req.query.keyword;
    let page = parseInt(req.query.page) || 1;

    // Start counting total pages immediately
    const totalPagesPromise = countPages(
      `https://${v1_base_url}/search?keyword=${keyword}`
    ).catch(() => null);

    // Wait for the total pages count to complete
    totalPagesPromise.then(totalPages => {
      page = Math.min(page, totalPages);
      
      if (page !== parseInt(req.query.page)) {
        return res.redirect(
          `${req.originalUrl.split("?")[0]}?keyword=${keyword}&page=${page}`
        );
      }

      // Start fetching search results
      const dataPromise = extractSearchResults(encodeURIComponent(keyword), page).catch(() => null);

      dataPromise.then(data => {
        // Send the results as soon as they are ready
        res.write('{"success": true, "results": {');
        res.write(`"totalPages": ${totalPages}, "data": ${JSON.stringify(data)}`);
        res.write('}}'); // Close the JSON object
        res.end(); // End the response
      });
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
