import  extractAnimeInfo  from "../extractors/animeInfo.extractor.js";
import extractSeasons from "../extractors/seasons.extractor.js";

export const getAnimeInfo = async (req, res) => {
  const id = req.query.id;
  try {
    const [seasons, data] = await Promise.all([
      extractSeasons(id),
      extractAnimeInfo(id),
    ]);
    res.json({ success: true, results: { seasons, data } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
