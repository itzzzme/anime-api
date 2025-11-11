import axios from "axios";
import * as cheerio from "cheerio";
import { v1_base_url } from "../utils/base_v1.js";

async function extractEpisodesList(id) {
  try {
    const showId = id.split("-").pop();
    const response = await axios.get(
      `https://${v1_base_url}/ajax/v2/episode/list/${showId}`,
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          Referer: `https://${v1_base_url}/watch/${id}`,
        },
      }
    );
    if (!response.data.html) return [];
    const $ = cheerio.load(response.data.html);
    const res = {
      totalEpisodes: 0,
      episodes: [],
    };
    res.totalEpisodes = Number($(".detail-infor-content .ss-list a").length);
    $(".detail-infor-content .ss-list a").each((_, el) => {
      res.episodes.push({
        episode_no: Number($(el).attr("data-number")),
        id: $(el)?.attr("href")?.split("/")?.pop() || null,
        title: $(el)?.attr("title")?.trim() || null,
        japanese_title: $(el).find(".ep-name").attr("data-jname"),
        filler: $(el).hasClass("ssl-item-filler"),
      });
    });
    return res;
  } catch (error) {
    console.error(error);
    return [];
  }
}
export default extractEpisodesList;
