import axios from "axios";
import * as cheerio from "cheerio";
import { v1_base_url } from "../utils/base_v1.js";

export default async function extractVoiceActor(id, page) {
  try {
    const resp = await axios.get(
      `https://${v1_base_url}/ajax/character/list/${id
        .split("-")
        .pop()}?page=${page}`
    );
    const $ = cheerio.load(resp.data.html);
    let totalPages = 1;
    const paginationList = $(".pre-pagination nav ul");
    if (paginationList.length) {
      const lastPageLink = paginationList.find("li").last().find("a");
      const pageNumber =
        lastPageLink.attr("data-url")?.match(/page=(\d+)/)?.[1] ||
        lastPageLink.text().trim();
      totalPages = parseInt(pageNumber) || totalPages;
    }
    const charactersVoiceActors = $(".bac-list-wrap .bac-item")
      .map((index, el) => {
        const character = {
          id:
            $(el)
              .find(".per-info.ltr .pi-avatar")
              .attr("href")
              ?.split("/")[2] || "",
          poster:
            $(el).find(".per-info.ltr .pi-avatar img").attr("data-src") || "",
          name: $(el).find(".per-info.ltr .pi-detail a").text(),
          cast: $(el).find(".per-info.ltr .pi-detail .pi-cast").text(),
        };

        let voiceActors = [];
        const rtlVoiceActors = $(el).find(".per-info.rtl");
        const xxVoiceActors = $(el).find(
          ".per-info.per-info-xx .pix-list .pi-avatar"
        );
        if (rtlVoiceActors.length > 0) {
          voiceActors = rtlVoiceActors
            .map((_, actorEl) => ({
              id: $(actorEl).find("a").attr("href")?.split("/").pop() || "",
              poster: $(actorEl).find("img").attr("data-src") || "",
              name:
                $(actorEl).find(".pi-detail .pi-name a").text().trim() || "",
            }))
            .get();
        } else if (xxVoiceActors.length > 0) {
          voiceActors = xxVoiceActors
            .map((_, actorEl) => ({
              id: $(actorEl).attr("href")?.split("/").pop() || "",
              poster: $(actorEl).find("img").attr("data-src") || "",
              name: $(actorEl).attr("title") || "",
            }))
            .get();
        }
        if (voiceActors.length === 0) {
          voiceActors = $(el)
            .find(".per-info.per-info-xx .pix-list .pi-avatar")
            .map((_, actorEl) => ({
              id: $(actorEl).attr("href")?.split("/")[2] || "",
              poster: $(actorEl).find("img").attr("data-src") || "",
              name: $(actorEl).attr("title") || "",
            }))
            .get();
        }

        return { character, voiceActors };
      })
      .get();
    return { totalPages, charactersVoiceActors };
  } catch (error) {
    console.error("Error in extractVoiceActor:", error);
    throw new Error("Could not extract voice actors");
  }
}
