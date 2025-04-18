import axios from "axios";
import * as cheerio from "cheerio";
import { v1_base_url } from "../utils/base_v1.js";
const animeDetailCache = new Map();

async function extractAnimeBasicDetails(id) {
  if (animeDetailCache.has(id)) {
    return animeDetailCache.get(id);
  }

  try {
    const { data } = await axios.get(`https://${v1_base_url}/${id}`);
    const $ = cheerio.load(data);
    const poster = $("#ani_detail .film-poster img").attr("src");
    const tvInfoElement = $("#ani_detail .film-stats");
    let adultContent = false;
    tvInfoElement.find(".tick-item, span.item").each((_, element) => {
      const el = $(element);
      const text = el.text().trim();
      if (el.hasClass("tick-rate") && text.includes("R")) adultContent = true;
    });

    const result = {
      poster,
      adultContent,
    };
    animeDetailCache.set(id, result);

    return result;
  } catch (err) {
    console.error(`Failed to extract anime info for ID: ${id} -`, err.message);
    return null;
  }
}

export default async function extractFullScheduleInfo(date) {
  try {
    const resp = await axios.get(
      `https://${v1_base_url}/ajax/schedule/list?tzOffset=-330&date=${date}`
    );

    const $ = cheerio.load(resp.data.html);
    const results = [];

    const scheduleItems = $("li").map((_, element) => {
      const $el = $(element);
      const href = $el.find("a").attr("href") || "";
      const id = href.split("?")[0].replace("/", "");
      const data_id = id.split("-").pop();
      const title = $el.find(".film-name").text().trim();
      const japanese_title = $el.find(".film-name").attr("data-jname")?.trim() || "";
      const time = $el.find(".time").text().trim();
      const episode_no = parseInt($el.find(".btn-play").text().trim().split(" ").pop(), 10);

      return {
        id,
        data_id,
        title,
        japanese_title,
        releaseDate: date,
        time,
        episode_no,
      };
    }).get();

    const detailedData = await Promise.all(
      scheduleItems.map((anime) => extractAnimeBasicDetails(anime.id))
    );

    scheduleItems.forEach((item, index) => {
      const detail = detailedData[index];
      if (detail) {
        results.push({
          ...item,
          poster: detail.poster,
          adultContent: detail.adultContent,
        });
      }
    });

    return results;
  } catch (error) {
    console.error("Schedule Error:", error.message);
    return [];
  }
}
