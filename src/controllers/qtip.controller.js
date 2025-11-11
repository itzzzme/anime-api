import extractQtip from "../extractors/qtip.extractor.js";

export const getQtip = async (req) => {
  try {
    const { id } = req.params;
    const data = await extractQtip(id);
    return data;
  } catch (e) {
    console.error(e);
    return e;
  }
};
