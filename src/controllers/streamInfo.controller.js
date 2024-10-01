import NodeCache from "node-cache";
// import { extractOtherEpisodes, extractStreamingInfo } from "../extractors/streamInfo.extractor.js";
import { extractStreamingInfo } from "../extractors/streamInfo.extractor.js";

const cache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

export const getStreamInfo = async (req, res) => {
  try {
    const input = req.query.id;
    const cacheKey = `streamInfo-${input}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.json({ success: true, results: cachedData });
    }
    const match = input.match(/ep=(\d+)/);
    if (!match) {
      throw new Error("Invalid URL format");
    }
    const finalId = match[1];
    // const [episodes, streamingInfo] = await Promise.all([
    //   extractOtherEpisodes(input),
    // extractStreamingInfo(finalId),
    // ]);
    const streamingInfo = await extractStreamingInfo(finalId);
    const results = { streamingInfo };
    cache.set(cacheKey, results);
    res.json({ success: true, results });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
