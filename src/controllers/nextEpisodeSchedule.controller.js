import extractNextEpisodeSchedule from "../extractors/getNextEpisodeSchedule.extractor.js";

export const getNextEpisodeSchedule = async (c) => {
  const { id } = c.req.param();
  try {
    const nextEpisodeSchedule = await extractNextEpisodeSchedule(id);
    return { nextEpisodeSchedule: nextEpisodeSchedule };
  } catch (e) {
    console.error(e);
    return e;
  }
};
