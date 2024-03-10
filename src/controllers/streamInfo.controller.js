import { extractOtherEpisodes, extractStreamingInfo } from "../extractors/streamInfo.extractor.js";

export const getStreamInfo = async (req, res) => {
  try {
    const input = req.query.id;
    const match = input.match(/ep=(\d+)/);
    if (!match) {
      throw new Error("Invalid URL format");
    }
    const finalId = match[1];
    const [episodes, streamingInfo] = await Promise.all([
      extractOtherEpisodes(input),
      extractStreamingInfo(finalId),
    ]);
    res.json({ success: true, results: { streamingInfo, episodes } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
