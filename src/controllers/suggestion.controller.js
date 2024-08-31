import getSuggestion from "../extractors/suggestion.extractor.js";

export const getSuggestions = async (req, res) => {
  const keyword = req.query.keyword;
  try {
    const data = await getSuggestion(encodeURIComponent(keyword));
    res.json({ success: true, results: data });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
