import extractSchedule from "../extractors/schedule.extractor.js";

export const getSchedule = async (c) => {
  const date = c.req.query("date");
  try {
    const data = await extractSchedule(encodeURIComponent(date));
    return data;
  } catch (e) {
    console.error(e);
    return e;
  }
};
