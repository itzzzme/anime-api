import axios from "axios";
import * as cheerio from "cheerio";
import baseUrl from "../utils/baseUrl.js";

async function extractSearchResults(search) {
  try {
    const resp = await axios.get(`${baseUrl}/search?keyword=${search}`);
    const $ = cheerio.load(resp.data);
    const data = await Promise.all(
      $("#main-content .film_list-wrap .flw-item").map(
        async (index, element) => {
          const $fdiItems = $(".film-detail .fd-infor .fdi-item", element);
          const showType = $fdiItems
            .filter((_, item) => {
              const text = $(item).text().trim().toLowerCase();
              return ["tv", "ona", "movie", "ova", "special"].some((type) =>
                text.includes(type)
              );
            })
            .first();
          $;
          const poster = $(".film-poster>img", element).attr("data-src");
          const title = $(".film-detail .film-name", element).text();
          const data_id = $(".film-poster>a", element).attr("data-id");
          const tvInfo = {
            showType: showType ? showType.text().trim() : "Unknown",
            duration: $(".film-detail .fd-infor .fdi-duration", element)
              .text()
              .trim(),
          };

          ["sub", "dub", "eps"].forEach((property) => {
            const value = $(`.tick .tick-${property}`, element).text().trim();
            if (value) {
              tvInfo[property] = value;
            }
          });

          return {
            data_id,
            poster,
            title,
            tvInfo,
          };
        }
      )
    );
    return data;
  } catch (e) {
    console.log(e);
  }
}

export default extractSearchResults;
