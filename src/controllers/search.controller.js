import extractSearchResults from "../extractors/search.extractor.js";

export const search = async (c) => {
  try {
    let { keyword } = c.req.query();
    let page = parseInt(c.req.query("page")) || 1;

    const [totalPage, data] = await extractSearchResults(
      encodeURIComponent(keyword),
      page
    );
    if (page > totalPage) {
      const error = new Error("Requested page exceeds total available pages.");
      error.status = 404;
      throw error;
    }
    return { data, totalPage };
  } catch (e) {
    console.error(e);
    if (e.status === 404) {
      throw e;
    }
    throw new Error("An error occurred while processing your request.");
  }
};
