import { extractStreamingInfo } from "../extractors/streamInfo.extractor.js";

export const getStreamInfo = async (req) => {
  try {
    const input = req.query.id;
    const match = input.match(/ep=(\d+)/);
    if (!match) throw new Error("Invalid URL format");
    const finalId = match[1];
    const streamingInfo = await extractStreamingInfo(finalId);
    return streamingInfo;
  } catch (e) {
    console.error(e);
    return e;
  }
};
