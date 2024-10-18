import extractVoiceActor from "../extractors/voiceactor.extractor.js";

export const getVoiceActors = async (c) => {
  const requestedPage = parseInt(c.req.query("page")) || 1;
  const id = c.req.param("id");
  try {
    const { totalPages, charactersVoiceActors: data } = await extractVoiceActor(
      id,
      requestedPage
    );
    return { currentPage: requestedPage, totalPages, data };
  } catch (e) {
    console.error(e);
    return e;
  }
};
