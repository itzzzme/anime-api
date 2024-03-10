import  extractTopTen  from "../extractors/topten.extractor.js";

export const getTopTen = async (req, res) => {
  try {
    const topTen = await extractTopTen();
    res.json({ success: true, results: { topTen } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
