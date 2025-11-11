import getSuggestion from "../extractors/suggestion.extractor.js";

export const getSuggestions = async (req) => {
  const { keyword } = req.query;
  try {
    const data = await getSuggestion(encodeURIComponent(keyword));
    return data;
  } catch (e) {
    console.error(e);
    return e;
  }
};
