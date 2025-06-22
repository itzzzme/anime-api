import extractSearchResults from "../extractors/search.extractor.js";

export const search = async (req) => {
  try {
    let { keyword, type, status, rated, score, season, language, genres, sort, sy, sm, sd, ey, em, ed } = req.query;
    let page = parseInt(req.query.page) || 1;

    const [totalPage, data] = await extractSearchResults({
      keyword: keyword, 
      type: type,
      status: status,
      rated: rated,
      score: score,
      season: season,
      language: language,
      genres: genres,
      sort: sort,
      page: page,
      sy: sy,
      sm: sm,
      sd: sd,
      ey: ey,
      em: em,
      ed: ed,
    });
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
