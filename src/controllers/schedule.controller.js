import extractSchedule from "../extractors/schedule.extractor.js";

export const getSchedule = async (req) => {
  const date = req.query.date;
  const tzOffset = req.query.tzOffset || -330;
  try {
    const data = await extractSchedule(date, tzOffset);
    return data;
  } catch (e) {
    console.error(e);
    return e;
  }
};
