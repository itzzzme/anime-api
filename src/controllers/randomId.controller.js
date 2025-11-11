import extractRandomId from "../extractors/randomId.extractor.js";

export const getRandomId = async (req,res) => {
  try {
    const data = await extractRandomId();
    return data;
  } catch (error) {
    console.error("Error getting random anime ID:", error.message);
    return e;
  }
};
