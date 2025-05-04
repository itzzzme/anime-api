import { extractStreamingInfo } from "../extractors/streamInfo.extractor.js";

export const getStreamInfo = async (req) => {
  try {
    const input = req.query.id;
    const server = req.query.server;
    const type = req.query.type;
    const anilistId = req.query.anilistId || null;
    const epnum = req.query.epnum || null;
    const match = input.match(/ep=(\d+)/);
    if (!match) throw new Error("Invalid URL format");
    const finalId = match[1];
    const streamingInfo = await extractStreamingInfo(
      finalId,
      server,
      type,
      anilistId,
      epnum
    );
    return streamingInfo;
  } catch (e) {
    console.error(e);
    return e;
  }
};
