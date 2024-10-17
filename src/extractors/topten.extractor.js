import axios from "axios";
import * as cheerio from "cheerio";
import baseUrl from "../utils/baseUrl.js";

// Set Axios defaults
axios.defaults.baseURL = baseUrl;

async function extractTopTen() {
  try {
    const resp = await axios.get("/home");
    const $ = cheerio.load(resp.data);

    const labels = ["today", "week", "month"];
    const result = {};

    // Loop through eq(0), eq(1), eq(2) for today, week, and month respectively
    labels.forEach((label, idx) => {
      const data = $(
        `#main-sidebar .block_area-realtime .block_area-content ul:eq(${idx})>li`
      )
        .map((index, element) => {
          const number = $(".film-number>span", element).text().trim();
          const title = $(".film-detail>.film-name>a", element).text().trim();
          const poster = $(".film-poster>img", element).attr("data-src");
          const japanese_title = $(".film-detail>.film-name>a", element)
            .attr("data-jname")
            .trim();
          const data_id = $(".film-poster", element).attr("data-id");
          const id = $(".film-detail>.film-name>a", element)
            .attr("href")
            .split("/")
            .pop();
          const tvInfo = ["sub", "dub", "eps"].reduce((info, property) => {
            const value = $(`.tick .tick-${property}`, element).text().trim();
            if (value) {
              info[property] = value;
            }
            return info;
          }, {});

          return { id, data_id, number, title, japanese_title, poster, tvInfo };
        })
        .get();

      result[label] = data;
    });

    return result;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export default extractTopTen;
