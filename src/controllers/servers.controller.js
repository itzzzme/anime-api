import { extractServers } from "../extractors/streamInfo.extractor.js";

export const getServers = async (c) => {
  try {
    const { ep } = c.req.query();
    const servers = await extractServers(ep);
    return servers;
  } catch (e) {
    console.error(e);
    return e;
  }
};
