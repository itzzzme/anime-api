import extractVoiceActor from "../extractors/voiceactor.extractor.js";
import { countPages } from "../extractors/voiceactor.extractor.js";

export const getVoiceActors = async (req, res) => {
  const requestedPage = parseInt(req.query.page) || 1;
  const id = req.params.id;

  try {
    const totalPages = await countPages(id);
    const pageToRedirect = Math.min(requestedPage, totalPages);
    if (pageToRedirect !== requestedPage) {
      return res.redirect(
        `${req.originalUrl.split("?")[0]}?page=${pageToRedirect}`
      );
    }

    const data = await extractVoiceActor(id, requestedPage);
    const responseData = { success: true, results: {currentPage:pageToRedirect, totalPages, data } };
    return res.json(responseData);
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
