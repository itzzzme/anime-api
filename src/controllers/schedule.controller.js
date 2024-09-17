import extractSchedule from "../extractors/schedule.extractor.js";

export const getSchedule = async (req, res) => {
  const date= req.query.date;
  try {
    const data = await extractSchedule(encodeURIComponent(date));
    res.json({ success: true, results: data });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
