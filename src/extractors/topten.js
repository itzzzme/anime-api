import axios from "axios";
import * as cheerio from "cheerio";
import baseUrl from "../utils/baseUrl.js";

// Set Axios defaults
axios.defaults.baseURL = baseUrl;

async function extractTopTen() {
  try {
    const resp = await axios.get("/home");
    const $ = cheerio.load(resp.data);

    const data = $(
      "#main-sidebar .block_area-realtime .block_area-content ul:eq(0)>li"
    )
      .map((index, element) => {
        const number = $(".film-number>span", element).text().trim();
        const name = $(".film-detail>.film-name>a", element).text().trim();
        const poster = $(".film-poster>img", element).attr("data-src");
        const data_id = $(".film-poster", element).attr("data-id");

        const tvInfo = ["sub", "dub", "eps"].reduce((info, property) => {
          const value = $(`.tick .tick-${property}`, element).text().trim();
          if (value) {
            info[property] = value;
          }
          return info;
        }, {});

        return { data_id, number, name, poster, tvInfo };
      })
      .get();

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export default extractTopTen;
