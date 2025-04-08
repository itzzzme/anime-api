import axios from "axios";
import * as cheerio from "cheerio";
import formatTitle from "../helper/formatTitle.helper.js";
import { v1_base_url } from "../utils/base_v1.js";
import extractRecommendedData from "./recommend.extractor.js";
import extractRelatedData from "./related.extractor.js";

async function extractAnimeInfo(id) {
  try {
    const [resp, characterData] = await Promise.all([
      axios.get(`https://${v1_base_url}/${id}`),
      axios.get(
        `https://${v1_base_url}/ajax/character/list/${id.split("-").pop()}`
      ),
    ]);
    const characterHtml = characterData.data?.html || "";
    const $1 = cheerio.load(characterHtml);
    const $ = cheerio.load(resp.data);
    const data_id = id.split("-").pop();
    const titleElement = $("#ani_detail .film-name");
    const showType = $("#ani_detail .prebreadcrumb ol li")
      .eq(1)
      .find("a")
      .text()
      .trim();
    const posterElement = $("#ani_detail .film-poster");
    const tvInfoElement = $("#ani_detail .film-stats");
    const tvInfo = {};
    tvInfoElement.find(".tick-item, span.item").each((_, element) => {
      const el = $(element);
      const text = el.text().trim();
      if (el.hasClass("tick-quality")) tvInfo.quality = text;
      else if (el.hasClass("tick-sub")) tvInfo.sub = text;
      else if (el.hasClass("tick-dub")) tvInfo.dub = text;
      else if (el.hasClass("tick-pg")) tvInfo.rating = text;
      else if (el.is("span.item")) {
        if (!tvInfo.showType) tvInfo.showType = text;
        else if (!tvInfo.duration) tvInfo.duration = text;
      }
    });

    const element = $(
      "#ani_detail > .ani_detail-stage > .container > .anis-content > .anisc-info-wrap > .anisc-info > .item"
    );
    const overviewElement = $("#ani_detail .film-description .text");

    const title = titleElement.text().trim();
    const japanese_title = titleElement.attr("data-jname");
    const synonyms = $('.item.item-title:has(.item-head:contains("Synonyms")) .name').text().trim();
    const poster = posterElement.find("img").attr("src");
    const syncDataScript = $("#syncData").html();
    let anilistId = null;
    let malId = null;

    if (syncDataScript) {
      try {
        const syncData = JSON.parse(syncDataScript);
        anilistId = syncData.anilist_id || null;
        malId = syncData.mal_id || null;
      } catch (error) {
        console.error("Error parsing syncData:", error);
      }
    }

    const animeInfo = {};
    element.each((_, el) => {
      const key = $(el).find(".item-head").text().trim().replace(":", "");
      const value =
        key === "Genres" || key === "Producers"
          ? $(el)
              .find("a")
              .map((_, a) => $(a).text().split(" ").join("-").trim())
              .get()
          : $(el).find(".name").text().split(" ").join("-").trim();
      animeInfo[key] = value;
    });

    const season_id = formatTitle(title, data_id);
    animeInfo["Overview"] = overviewElement.text().trim();
    animeInfo["tvInfo"] = tvInfo;

    let adultContent = false;
    const tickRateText = $(".tick-rate", posterElement).text().trim();
    if (tickRateText.includes("18+")) {
      adultContent = true;
    }

    const [recommended_data, related_data] = await Promise.all([
      extractRecommendedData($),
      extractRelatedData($),
    ]);
    let charactersVoiceActors = [];
    if (characterHtml) {
      charactersVoiceActors = $1(".bac-list-wrap .bac-item")
        .map((index, el) => {
          const character = {
            id:
              $1(el)
                .find(".per-info.ltr .pi-avatar")
                .attr("href")
                ?.split("/")[2] || "",
            poster:
              $1(el).find(".per-info.ltr .pi-avatar img").attr("data-src") ||
              "",
            name: $1(el).find(".per-info.ltr .pi-detail a").text(),
            cast: $1(el).find(".per-info.ltr .pi-detail .pi-cast").text(),
          };

          let voiceActors = [];
          const rtlVoiceActors = $1(el).find(".per-info.rtl");
          const xxVoiceActors = $1(el).find(
            ".per-info.per-info-xx .pix-list .pi-avatar"
          );
          if (rtlVoiceActors.length > 0) {
            voiceActors = rtlVoiceActors
              .map((_, actorEl) => ({
                id: $1(actorEl).find("a").attr("href")?.split("/").pop() || "",
                poster: $1(actorEl).find("img").attr("data-src") || "",
                name:
                  $1(actorEl).find(".pi-detail .pi-name a").text().trim() || "",
              }))
              .get();
          } else if (xxVoiceActors.length > 0) {
            voiceActors = xxVoiceActors
              .map((_, actorEl) => ({
                id: $1(actorEl).attr("href")?.split("/").pop() || "",
                poster: $1(actorEl).find("img").attr("data-src") || "",
                name: $1(actorEl).attr("title") || "",
              }))
              .get();
          }
          if (voiceActors.length === 0) {
            voiceActors = $1(el)
              .find(".per-info.per-info-xx .pix-list .pi-avatar")
              .map((_, actorEl) => ({
                id: $1(actorEl).attr("href")?.split("/")[2] || "",
                poster: $1(actorEl).find("img").attr("data-src") || "",
                name: $1(actorEl).attr("title") || "",
              }))
              .get();
          }

          return { character, voiceActors };
        })
        .get();
    }

    return {
      adultContent,
      data_id,
      id: season_id,
      anilistId,
      malId,
      title,
      japanese_title,
      synonyms,
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
