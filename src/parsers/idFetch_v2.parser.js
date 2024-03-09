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
      .map((ind, ele) => {
        const name = $(ele).find("a.btn").text().trim();
        const id = $(ele).attr("data-id");
        const type = $(ele).attr("data-type");
        // Filter out undesired servers
        if (name === "Vidcloud") {
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
// console.log(await fetchServerData(114685))
