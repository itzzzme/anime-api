import axios from "axios";
import * as cheerio from "cheerio";
import baseUrl from "../utils/baseUrl.js";
// import formatTitle from "../helper/formatTitle.helper.js";
// import { fetchServerData_v2 } from "../parsers/idFetch_v2.parser.js";
import { fetchServerData_v1 } from "../parsers/idFetch_v1.parser.js";
import { decryptAllServers } from "../parsers/decryptors/decryptAllServers.decryptor.js";

export async function extractServers(id) {
  try {
    const resp = await axios.get(
      `${baseUrl}/ajax/v2/episode/servers?episodeId=${id}`
    );
    const $ = cheerio.load(resp.data.html);

    const serverData = [];

    $(".server-item").each((index, element) => {
      const data_id = $(element).attr("data-id");
      const server_id = $(element).attr("data-server-id");
      const type = $(element).attr("data-type");
      const serverName = $(element).find("a").text().trim();
      serverData.push({
        type,
        data_id,
        server_id,
        serverName,
      });
    });

    return serverData;
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function extractStreamingInfo(id) {
  try {
    const [data_v1, servers] = await Promise.all([
      fetchServerData_v1(id),
      // fetchServerData_v2(id),
      extractServers(id.split("?ep=").pop()) 
    ]);
    const sortedData = [...data_v1].sort((a, b) =>
      a.type.localeCompare(b.type)
    );
    const decryptedResults = await decryptAllServers(sortedData);
    return { decryptedResults, servers };
  } catch (error) {
    console.error("An error occurred:", error);
    return { decryptedResults: [], servers: [] };
  }
}

// export { extractOtherEpisodes, extractStreamingInfo };
export { extractStreamingInfo };
