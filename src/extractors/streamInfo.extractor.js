import axios from "axios";
import * as cheerio from "cheerio";
import baseUrl from "../utils/baseUrl.js";
import decryptMegacloud from "../parsers/decryptors/megacloud.decryptor.js";

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

async function extractStreamingInfo(id, name, type) {
  try {
    const servers = await extractServers(id.split("?ep=").pop());

    // const sortedData = [...data_v1].sort((a, b) =>
    //   a.type.localeCompare(b.type)
    // );

    const requestedServer = servers.filter(
      (server) =>
        server.serverName.toLowerCase() === name.toLowerCase() &&
        server.type.toLowerCase() === type.toLowerCase()
    );
    const streamingLink = await decryptMegacloud(
      requestedServer[0].data_id,
      name,
      type
    );
    return { streamingLink, servers };
  } catch (error) {
    console.error("An error occurred:", error);
    return { streamingLink: [], servers: [] };
  }
}
export { extractStreamingInfo };
