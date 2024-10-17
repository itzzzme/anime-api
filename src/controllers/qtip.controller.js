import extractQtip from "../extractors/qtip.extractor.js";

export const getQtip = async (c) => {
  try {
    const { id } = c.req.param();
    const data = await extractQtip(id);
    return data;
  } catch (e) {
    console.error(e);
    return e;
  }
};
