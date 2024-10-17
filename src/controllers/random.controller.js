import extractRandom from "../extractors/random.extractor.js";

export const getRandom = async (c) => {
  try {
    const data = await extractRandom();
    return data;
  } catch (error) {
    console.error("Error getting random anime:", error.message);
    return e;
  }
};
