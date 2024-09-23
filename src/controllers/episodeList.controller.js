import extractEpisodesList from "../extractors/episodeList.extractor.js";

export const getEpisodes = async (req, res) => {
  const id = req.params.id;

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Transfer-Encoding', 'chunked'); // Allow streaming

  try {
    // Start fetching episodes immediately
    const dataPromise = extractEpisodesList(encodeURIComponent(id)).catch(() => null);

    // Process the data as it becomes available
    dataPromise.then(data => {
      // Send the results as soon as they are ready
      res.write('{"success": true, "results": ');
      res.write(JSON.stringify(data));
      res.write('}'); // Close the JSON object
      res.end(); // End the response
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
