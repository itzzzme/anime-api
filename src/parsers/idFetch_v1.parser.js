import axios from "axios";
import * as cheerio from "cheerio";
import { v1_base_url } from "../utils/base_v1.js";

export async function fetchServerData_v1(id) {
  try {
    const { data } = await axios.get(
      `https://${v1_base_url}/ajax/v2/episode/servers?episodeId=${id}`
    );
    const $ = cheerio.load(data.html);

    const serverData = $("div.ps_-block > div.ps__-list > div.server-item")
      .filter((_, ele) => {
        const name = $(ele).find("a.btn").text();
        return name === "HD-1" || name === "HD-2";
      })
      .map((_, ele) => ({
        name: $(ele).find("a.btn").text(),
        id: $(ele).attr("data-id"),
        type: $(ele).attr("data-type"),
      }))
      .get();

    return serverData;
  } catch (error) {
    console.error("Error fetching server data:", error);
    return [];
  }
}
