import axios from "axios";
import * as cheerio from "cheerio";
import formatTitle from "../helper/formatTitle.helper.js";
import { v1_base_url } from "../utils/base_v1.js";

const baseUrl = v1_base_url;

async function extractAnimeInfo(id) {
  try {
    const resp = await axios.get(`https://${baseUrl}/${id}`);
    const $ = cheerio.load(resp.data);
    const title = $(
      "#ani_detail > .ani_detail-stage > .container > .anis-content > .anisc-detail > .film-name"
    ).text();
    const japanese_title = $(
      "#ani_detail > .ani_detail-stage > .container > .anis-content > .anisc-detail > .film-name"
    ).attr("data-jname");
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
    const season_id = formatTitle(title, data_id);
    const overview = $(
      "#ani_detail > .ani_detail-stage > .container > .anis-content > .anisc-detail > .film-description > .text"
    )
      .text()
      .trim();
    animeInfo["Overview"] = overview;

    const recommended_data = await Promise.all(
      $(
        "#main-content .block_area_category .tab-content .block_area-content .film_list-wrap .flw-item"
      ).map(async (index, element) => {
        const id = $(element)
          .find(".film-detail .film-name a")
          .attr("href")
          .split("/")
          .pop();
        const data_id = $(element).find(".film-poster a").attr("data-id");
        const title = $(element)
          .find(".film-detail .film-name a")
          .text()
          .trim();
        const japanese_title = $(element)
          .find(".film-detail .film-name a")
          .attr("data-jname")
          .trim();
        const poster = $(element).find(".film-poster img").attr("data-src");
        const $fdiItems = $(".film-detail .fd-infor .fdi-item", element);
        const showType = $fdiItems
          .filter((_, item) => {
            const text = $(item).text().trim().toLowerCase();
            return ["tv", "ona", "movie", "ova", "special"].some((type) =>
              text.includes(type)
            );
          })
          .first();
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
          id,
          title,
          japanese_title,
          poster,
          tvInfo,
        };
      })
    );
    const related_data = await Promise.all(
      $(
        "#main-sidebar .block_area_sidebar .block_area-content .cbox-list .cbox-content .anif-block-ul .ulclear li"
      ).map(async (index, element) => {
        const id = $(element)
          .find(".film-detail .film-name a")
          .attr("href")
          .split("/")
          .pop();
        const data_id = $(element).find(".film-poster").attr("data-id");
        const title = $(element)
          .find(".film-detail .film-name a")
          .text()
          .trim();
        const japanese_title = $(element)
          .find(".film-detail .film-name a")
          .attr("data-jname")
          .trim();
        const poster = $(element).find(".film-poster img").attr("data-src");
        const $fdiItems = $(".film-detail>.fd-infor>.tick", element);
        const showType = $fdiItems
          .filter((_, item) => {
            const text = $(item).text().trim().toLowerCase();
            return ["tv", "ona", "movie", "ova", "special"].some((type) =>
              text.includes(type)
            );
          })
          .first()
          .text()
          .trim()
          .split(/\s+/)
          .find((word) =>
            ["tv", "ona", "movie", "ova", "special"].includes(
              word.toLowerCase()
            )
          );
        const tvInfo = {
          showType: showType ? showType : "Unknown",
        };
        ["sub", "dub", "eps"].forEach((property) => {
          const value = $(`.tick .tick-${property}`, element).text().trim();
          if (value) {
            tvInfo[property] = value;
          }
        });
        return {
          data_id,
          id,
          title,
          japanese_title,
          poster,
          tvInfo,
        };
      })
    );
    return {
      data_id,
      id: season_id,
      title,
      japanese_title,
      poster,
      animeInfo,
      recommended_data,
      related_data,
    };
  } catch (e) {
    console.log(e);
  }
}

export default extractAnimeInfo;
