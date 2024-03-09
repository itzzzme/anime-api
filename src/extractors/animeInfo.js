import axios from "axios";
import * as cheerio from "cheerio";
import { v1_base_url } from "../utils/base_v1.js";

const baseUrl = v1_base_url;

async function extractAnimeInfo(id) {
  try {
    const resp = await axios.get(`https://${baseUrl}/${id}`);
    const $ = cheerio.load(resp.data);
    const title = $(
      "#ani_detail > .ani_detail-stage > .container > .anis-content > .anisc-detail > .film-name"
    ).text();
    const poster = $(
      "#ani_detail > .ani_detail-stage > .container > .anis-content > .anisc-poster > .film-poster > img"
    ).attr("src");
    const element = $(
      "#ani_detail > .ani_detail-stage > .container > .anis-content > .anisc-info-wrap > .anisc-info > .item"
    );
    const data_id = id.split("-").pop();
    const animeInfo = {};
    element.each((index, element) => {
      const key = $(element).find(".item-head").text().trim().replace(":", "");
      const value = $(element).find(".name").text().trim();
      if (key === "Genres" || key === "Producers") {
        animeInfo[key] = $(element)
          .find("a")
          .map((index, element) => $(element).text().trim())
          .get();
      } else {
        animeInfo[key] = value;
      }
    });

    const overview = $(
      "#ani_detail > .ani_detail-stage > .container > .anis-content > .anisc-detail > .film-description > .text"
    )
      .text()
      .trim();
    animeInfo["Overview"] = overview;
    return { data_id, title, poster, animeInfo };
  } catch (e) {
    console.log(e);
  }
}

export default extractAnimeInfo;
