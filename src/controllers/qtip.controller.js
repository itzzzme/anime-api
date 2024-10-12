import extractQtip from "../extractors/qtip.extractor.js";

export const getQtip = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await extractQtip(id);
    res.json({ success: true, results: { data } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
