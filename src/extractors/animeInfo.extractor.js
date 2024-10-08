import axios from "axios";
import * as cheerio from "cheerio";
import formatTitle from "../helper/formatTitle.helper.js";
import { v1_base_url } from "../utils/base_v1.js";
import extractRecommendedData from "./recommend.extractor.js";
import extractRelatedData from "./related.extractor.js";

const baseUrl = v1_base_url;

async function extractAnimeInfo(id) {
  try {
    const [resp, characterData] = await Promise.all([
      axios.get(`https://${baseUrl}/${id}`),
      axios.get(
        `https://${baseUrl}/ajax/character/list/${id.split("-").pop()}`
      ),
    ]);

    const $1 = cheerio.load(characterData.data.html);
    const $ = cheerio.load(resp.data);
    const data_id = id.split("-").pop();

    const titleElement = $("#ani_detail .film-name");
    const showType = $("#ani_detail .prebreadcrumb ol li")
      .eq(1)
      .find("a")
      .text()
      .trim();
    const posterElement = $("#ani_detail .film-poster img");
    const tvInfoElement = $("#ani_detail .film-stats");
    const tvInfo = {};

    // Extract values from tick-items and spans in a single loop
    tvInfoElement.find(".tick-item, span.item").each((_, element) => {
      const text = $(element).text().trim();
      if ($(element).hasClass("tick-quality")) {
        tvInfo["quality"] = text;
      } else if ($(element).hasClass("tick-sub")) {
        tvInfo["sub"] = text;
      } else if ($(element).hasClass("tick-dub")) {
        tvInfo["dub"] = text;
      } else if ($(element).hasClass("tick-pg")) {
        tvInfo["rating"] = text;
      } else if ($(element).is("span.item")) {
        // Handle showType and duration from spans
        if (!tvInfo["showType"]) {
          tvInfo["showType"] = text; // First span value for showType
        } else if (!tvInfo["duration"]) {
          tvInfo["duration"] = text; // Second span value for duration
        }
      }
    });

    const element = $("#ani_detail .anisc-info > .item");
    const overviewElement = $("#ani_detail .film-description .text");

    const title = titleElement.text().trim();
    const japanese_title = titleElement.attr("data-jname");
    const poster = posterElement.attr("src");

    const animeInfo = {};
    element.each((_, el) => {
      const key = $(el).find(".item-head").text().trim().replace(":", "");
      const value = $(el).find(".name").text().trim();
      if (key === "Genres" || key === "Producers") {
        animeInfo[key] = $(el)
          .find("a")
          .map((_, anchor) => $(anchor).text().trim())
          .get();
      } else {
        animeInfo[key] = value;
      }
    });

    const season_id = formatTitle(title, data_id);
    animeInfo["Overview"] = overviewElement.text().trim();
    animeInfo["tvInfo"] = tvInfo;

    const adultContent = $(".film-poster>.tick-rate", element)
      .text()
      .trim()
      .includes("18+");

    const [recommended_data, related_data] = await Promise.all([
      extractRecommendedData($),
      extractRelatedData($),
    ]);

    const charactersVoiceActors = $1(".bac-list-wrap .bac-item")
      .map((_, el) => {
        const character = {
          id:
            $1(el)
              .find(".per-info.ltr .pi-avatar")
              .attr("href")
              ?.split("/")[2] || "",
          poster:
            $1(el).find(".per-info.ltr .pi-avatar img").attr("data-src") || "",
          name: $1(el).find(".per-info.ltr .pi-detail a").text(),
          cast: $1(el).find(".per-info.ltr .pi-detail .pi-cast").text(),
        };

        const voiceActors = $1(el)
          .find(".per-info.per-info-xx .pix-list .pi-avatar")
          .map((_, actorEl) => ({
            id: $1(actorEl).attr("href")?.split("/")[2] || "",
            poster: $1(actorEl).find("img").attr("data-src") || "",
            name: $1(actorEl).attr("title") || "",
          }))
          .get();

        return { character, voiceActors };
      })
      .get();

    return {
      adultContent,
      data_id,
      id: season_id,
      title,
      japanese_title,
      poster,
      showType,
      animeInfo,
      charactersVoiceActors,
      recommended_data,
      related_data,
    };
  } catch (e) {
    console.error("Error extracting anime info:", e);
  }
}

export default extractAnimeInfo;
