import extractNextEpisodeSchedule from "../extractors/getNextEpisodeSchedule.extractor.js";

export const getNextEpisodeSchedule = async (req) => {
  const { id } = req.params;
  try {
    const nextEpisodeSchedule = await extractNextEpisodeSchedule(id);
    return { nextEpisodeSchedule: nextEpisodeSchedule };
  } catch (e) {
    console.error(e);
    return e;
  }
};
