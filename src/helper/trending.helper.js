import  extractTrending  from "../extractors/trending.extractor.js";

export const getTrending = async () => {
  try {
    const trending = await extractTrending();
    // console.log(trending);
    return trending;
    // res.json({ success: true, results: { trending } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
