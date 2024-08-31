import  extractEpisodesList  from "../extractors/episodeList.extractor.js";

export const getEpisodes = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const data = await extractEpisodesList(encodeURIComponent(id));
    console.log(data);
    res.json({ success: true, results: data });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
