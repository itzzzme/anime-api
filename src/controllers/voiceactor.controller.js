import extractVoiceActor from "../extractors/voiceactor.extractor.js";

export const getVoiceActors = async (req, res) => {
  const requestedPage = parseInt(req.query.page) || 1;
  const id = req.params.id;
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
