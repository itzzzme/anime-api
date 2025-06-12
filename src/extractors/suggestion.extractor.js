import axios from "axios";
import * as cheerio from "cheerio";
import { v1_base_url } from "../utils/base_v1.js";

async function getSuggestions(keyword) {
  try {
    const resp = await axios.get(
      `https://${v1_base_url}/ajax/search/suggest?keyword=${keyword}`
    );
    const $ = cheerio.load(resp.data.html);
    const results = [];
    $(".nav-item")
      .not(".nav-bottom")
      .each((i, element) => {
        const id = $(element).attr("href").split("?")[0].replace("/", "");
        const data_id = id.split("-").pop();
        const poster = $(element).find(".film-poster-img").attr("data-src");
        const title = $(element).find(".film-name").text().trim();
        const japanese_title = $(element).find(".film-name").attr("data-jname").trim();
        const releaseDate = $(element)
          .find(".film-infor span")
          .first()
          .text()
          .trim();
        const filmInforHtml = $(element).find(".film-infor").html();
        const showTypeMatch = /<i class="dot"><\/i>([^<]+)<i class="dot"><\/i>/;
        const showType = showTypeMatch.exec(filmInforHtml)?.[1]?.trim() || "";
        const duration = $(element)
          .find(".film-infor span")
          .last()
          .text()
          .trim();
        results.push({
          id,
          data_id,
          poster,
          title,
          japanese_title,
          releaseDate,
          showType,
          duration,
        });
      });
      return results;
  } catch (error) {
    console.log(error.message);
  }
}

export default getSuggestions;