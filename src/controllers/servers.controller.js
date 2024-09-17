import NodeCache from "node-cache";
import { extractServers } from "../extractors/streamInfo.extractor.js";

const cache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

export const getServers = async (req, res) => {
  try {
    const input = req.query.ep;
    const streamingInfo = await extractServers(input);
    const results = { streamingInfo };
    res.json({ success: true, results });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
