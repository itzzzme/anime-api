import extractEpisodesList from "../extractors/episodeList.extractor.js";

export const getEpisodes = async (c) => {
  const { id } = c.req.param();
  try {
    const data = await extractEpisodesList(encodeURIComponent(id));
    return data;
  } catch (e) {
    console.error("Error fetching episodes:", e);
    return e;
  }
};
