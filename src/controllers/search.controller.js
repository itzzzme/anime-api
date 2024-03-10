import  extractSearchResults  from "../extractors/search.extractor.js";

export const search = async (req, res) => {
  const keyword = req.query.keyword;
  try {
    const data = await extractSearchResults(encodeURIComponent(keyword));
    res.json({ success: true, results: data });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
