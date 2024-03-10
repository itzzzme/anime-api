import axios from "axios";
import * as cheerio from "cheerio";
import baseUrl from "../utils/baseUrl.js";
import { fetchServerData_v2 } from "../parsers/idFetch_v2.parser.js";
import { fetchServerData_v1 } from "../parsers/idFetch_v1.parser.js";
import { decryptAllServers } from "../parsers/decryptors/decryptAllServers.decryptor.js";

async function extractOtherEpisodes(id) {
  try {
    const finalId = id.split("?").shift().split("-").pop();
    const resp = await axios.get(`${baseUrl}/ajax/v2/episode/list/${finalId}`);
    const $ = cheerio.load(resp.data.html);
    const elements = $(".seasons-block > #detail-ss-list > .detail-infor-content > .ss-list > a");
    
    const episodes = elements.map((index, element) => {
      const title = $(element).attr("title");
      const episode_no = $(element).attr("data-number");
      const data_id = $(element).attr("data-id");
      const japanese_title = $(element).find(".ssli-detail > .ep-name").attr("data-jname");
      
      return { data_id, episode_no, title, japanese_title };
    }).get();
    
    return episodes;
  } catch (error) {
    console.error("An error occurred:", error);
    return [];
  }
}

async function extractStreamingInfo(id) {
  try {
    const [data_v1, data_v2] = await Promise.all([
      fetchServerData_v1(id),
      fetchServerData_v2(id),
    ]);

    const sortedData = [...data_v1, ...data_v2].sort((a, b) => a.type.localeCompare(b.type));
    const decryptedResults = await decryptAllServers(sortedData);

    return decryptedResults;
  } catch (error) {
    console.error("An error occurred:", error);
    return [];
  }
}

export { extractOtherEpisodes, extractStreamingInfo };
