import axios from "axios";
import { v1_base_url } from "../../utils/base_v1.js";

export async function decryptSources_v1(id, name, type) {
  try {
    const { data: sourcesData } = await axios.get(`https://${v1_base_url}/ajax/v2/episode/sources?id=${id}`);

    const ajaxLink = sourcesData?.link;
    if (!ajaxLink) throw new Error("Missing link in sourcesData");

    const match = /\/([^\/\?]+)\?/.exec(ajaxLink);
    const sourceId = match?.[1];
    if (!sourceId) throw new Error("Unable to extract sourceId from link");

    const megacloudUrl = `https://megacloud.blog/embed-2/v2/e-1/getSources?id=${sourceId}`;
    
    console.log(`https://${v1_base_url}/ajax/v2/episode/sources?id=${id}`);
    console.log(`Megacloud URL: ${megacloudUrl}`);

    const { data: rawSourceData } = await axios.get(megacloudUrl);

    const bypassUrl = `https://bypass.lunaranime.ru/extract?url=${encodeURIComponent(megacloudUrl)}`;
    console.log(`Bypass URL: ${bypassUrl}`);

    const { data: bypassData } = await axios.get(bypassUrl);
    
    if (!bypassData?.sources || !Array.isArray(bypassData.sources) || bypassData.sources.length === 0) {
      throw new Error("No sources found in bypass response");
    }

    return {
      id,
      type,
      link: {
        file: bypassData.sources[0].file,
        type: bypassData.sources[0].type || "hls",
      },
      tracks: rawSourceData.tracks ?? [],
      intro: rawSourceData.intro ?? null,
      outro: rawSourceData.outro ?? null,
      server: name,
    };
  } catch (error) {
    console.error(`Error during decryptSources_v1(${id}):`, error.message);
    return null;
  }
}
