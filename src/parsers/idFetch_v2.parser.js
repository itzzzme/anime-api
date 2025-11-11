import axios from "axios";
import * as cheerio from "cheerio";
import { v2_base_url } from "../utils/base_v2.js";

export async function fetchServerData_v2(id) {
  try {
    const { data } = await axios.get(
      `https://${v2_base_url}/ajax/episode/servers?episodeId=${id}`
    );
    const $ = cheerio.load(data.html);

    const serverData = $("div.ps_-block > div.ps__-list > div.server-item")
      .filter((_, ele) => {
        const name = $(ele).find("a.btn").text().trim();
        return name === "Vidcloud";
      })
      .map((_, ele) => ({
        name: $(ele).find("a.btn").text().trim(),
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
