import { extractStreamingInfo } from "../extractors/streamInfo.extractor.js";

export const getStreamInfo = async (c) => {
  try {
    const input = c.req.query("id");
    const match = input.match(/ep=(\d+)/);
    if (!match) throw new Error("Invalid URL format");
    const finalId = match[1];
    const streamingInfo = await extractStreamingInfo(finalId);
    const data = { streamingInfo };
    return data;
  } catch (e) {
    console.error(e);
    return e;
  }
};
