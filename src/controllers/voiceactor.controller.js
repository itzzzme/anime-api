import extractVoiceActor from "../extractors/voiceactor.extractor.js";

export const getVoiceActors = async (c) => {
  const requestedPage = parseInt(c.req.query("page")) || 1;
  const id = c.req.param("id");
  try {
    const { lastPageNo, charactersVoiceActors: data } = await extractVoiceActor(
      id,
      requestedPage
    );
    return { currentPage: requestedPage, lastPageNo, data };
  } catch (e) {
    console.error(e);
    return e;
  }
};
