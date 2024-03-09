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
      .map((ind, ele) => {
        const name = $(ele).find("a.btn").text();
        const id = $(ele).attr("data-id");
        const type = $(ele).attr("data-type");
        if (name === "HD-1" || name === "HD-2") {
          return { name, id, type };
        } else {
          return null;
        }
      })
      .get()
      .filter(Boolean);
    return serverData;
  } catch (e) {
    console.log(e);
  }
}
