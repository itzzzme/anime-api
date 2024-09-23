import { extractor } from "../extractors/category.extractor.js";

export const handleRequest = async (req, res, extractorType) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Transfer-Encoding', 'chunked'); // Allow streaming

  try {
    let requestedPage = parseInt(req.query.page) || 1;

    // Start the extraction process immediately
    const extractionPromise = extractor(extractorType, requestedPage).catch(() => null);

    // Wait for the data to be extracted
    extractionPromise.then(({ data, totalPages }) => {
      // Validate and adjust the requested page
      requestedPage = Math.min(requestedPage, totalPages);
      
      if (requestedPage !== parseInt(req.query.page)) {
        return res.redirect(
          `${req.originalUrl.split("?")[0]}?page=${requestedPage}`
        );
      }

      // Send the results as soon as they are ready
      res.write('{"success": true, "results": {');
      res.write(`"totalPages": ${totalPages}, "data": ${JSON.stringify(data)}`);
      res.write('}}'); // Close the JSON object
      res.end(); // End the response
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
