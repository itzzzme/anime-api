import axios from "axios";
import * as cheerio from "cheerio";
import formatTitle from "../helper/formatTitle.helper.js";
import baseUrl from "../utils/baseUrl.js";

async function extractSeasons(id) {
  try {
    const resp = await axios.get(`${baseUrl}/watch/${id}`);
    const $ = cheerio.load(resp.data);
    const seasons = $(".anis-watch>.other-season>.inner>.os-list>a")
      .map((index, element) => {
        const data_number = index;
        const data_id = parseInt($(element).attr("href").split("-").pop());
        const season = $(element).find(".title").text().trim();
        const seasonPoster=$(element).find(".season-poster").attr("style").match(/url\((.*?)\)/)[1];
        const title = $(element).attr("title").trim();
        const id = formatTitle(title, data_id);
        const season_poster = $(element)
          .find(".season-poster")
          .attr("style")
          .match(/url\((.*?)\)/)[1];
        return { id, data_number, data_id, season, title, season_poster };
      })
      .get();
    return seasons;
  } catch (e) {
    console.log(e);
  }
}

export default extractSeasons;
