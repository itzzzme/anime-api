import getSuggestion from "../extractors/suggestion.extractor.js";
import convertForeignLanguage from "../helper/foreignInput.helper.js";

export const getSuggestions = async (req) => {
  let { keyword } = req.query;

  // Check if the search keyword is in a foreign language and if it can be converted
  keyword = await convertForeignLanguage(keyword);

  try {
    const data = await getSuggestion(encodeURIComponent(keyword));
    return data;
  } catch (e) {
    console.error(e);
    return e;
  }
};
