import  extractSpotlights  from "../extractors/spotlight.extractor.js";

export const getSpotlights = async () => {
  try {
    const spotlights = await extractSpotlights();
    // console.log(spotlights)
    return spotlights
    // res.json({ success: true, results: { spotlights } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
