import extractRandom from "../extractors/random.extractor.js";

export const getRandom = async (req, res) => {
  try {
    const data = await extractRandom();
    res.json({
      success: true,
      results: { data },
    });
  } catch (error) {
    console.error("Error getting random anime:", error.message);
    res.status(500).json({
      success: false,
      error: "An error occurred while getting random anime",
    });
  }
};
