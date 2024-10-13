import extractRandomId from "../extractors/randomid.extractor.js";

export const getRandomId = async (req, res) => {
  try {
    const data = await extractRandomId();
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error getting random anime:", error.message);
    res.status(500).json({
      success: false,
      error: "An error occurred while getting random anime",
    });
  }
};
