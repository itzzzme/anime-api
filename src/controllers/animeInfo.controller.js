import extractAnimeInfo from "../extractors/animeInfo.extractor.js";
import extractSeasons from "../extractors/seasons.extractor.js";

export const getAnimeInfo = async (req, res) => {
  const id = req.query.id;

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Transfer-Encoding', 'chunked'); 
  res.write('{"success": true, "results": {');
  let hasSentFirstChunk = false;
  const sendChunk = (key, data) => {
    if (hasSentFirstChunk) {
      res.write(',');
    }
    res.write(`"${key}": ${JSON.stringify(data)}`);
    hasSentFirstChunk = true;
  };

  try {
    const seasonsPromise = extractSeasons(id).catch(() => null);
    const dataPromise = extractAnimeInfo(id).catch(() => null);
    Promise.allSettled([seasonsPromise, dataPromise]).then(results => {
      const [seasonsResult, dataResult] = results;
      sendChunk('seasons', seasonsResult.status === 'fulfilled' ? seasonsResult.value : null);
      sendChunk('data', dataResult.status === 'fulfilled' ? dataResult.value : null);
      res.write('}}'); // Close the JSON object
      res.end(); // End the response
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
