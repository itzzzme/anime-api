import extractTopSearch from "../extractors/topsearch.extractor.js";

const getTopSearch = async () => {
  try {
    const data = await extractTopSearch();
    return data;
  } catch (e) {
    console.error(e);
    return e;
  }
};

export default getTopSearch;
