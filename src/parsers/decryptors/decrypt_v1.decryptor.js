import axios from "axios";
import CryptoJS from "crypto-js";
import { v1_base_url } from "../../utils/base_v1.js";
import { fallback_1, fallback_2 } from "../../utils/fallback.js";

export async function decryptSources_v1(epID, id, name, type) {
  try {
    const [{ data: sourcesData }, { data: key }] = await Promise.all([
      axios.get(`https://${v1_base_url}/ajax/v2/episode/sources?id=${id}`),
      axios.get(
        "https://raw.githubusercontent.com/itzzzme/megacloud-keys/refs/heads/main/key.txt",
      ),
    ]);

    const ajaxLink = sourcesData?.link;
    if (!ajaxLink) throw new Error("Missing link in sourcesData");

    const match = /\/([^\/\?]+)\?/.exec(ajaxLink);
    const sourceId = match?.[1];
    if (!sourceId) throw new Error("Unable to extract sourceId from link");

    const { data: rawSourceData } = await axios.get(
      `https://megacloud.blog/embed-2/v3/e-1/getSources?id=${sourceId}`,
    );

    let decryptedSources;

    try {
      const encrypted = rawSourceData?.sources;
      if (!encrypted) throw new Error("Encrypted source missing");

      const decrypted = CryptoJS.AES.decrypt(encrypted, key.trim()).toString(
        CryptoJS.enc.Utf8,
      );
      if (!decrypted) throw new Error("Failed to decrypt source");

      decryptedSources = JSON.parse(decrypted);
    } catch (e) {
      try {
        const fallback = name.toLowerCase()==='hd-1'?fallback_1:fallback_2;
        const { data: html } = await axios.get(
          `https://${fallback}/stream/s-2/${epID}/${type}`,
          {
            headers: {
              Referer: `https://${fallback_1}/`,
            },
          },
        );
        const dataIdMatch = html.match(/data-id=["'](\d+)["']/);
        const realId = dataIdMatch?.[1];
        if (!realId) throw new Error("Could not extract data-id for fallback");

        const { data: fallback_data } = await axios.get(
          `https://${fallback}/stream/getSources?id=${realId}`,
          {
            headers: {
              "X-Requested-With": "XMLHttpRequest",
            },
          },
        );

        decryptedSources = [{ file: fallback_data.sources.file }];
      } catch (fallbackError) {
        throw new Error("Fallback failed: " + fallbackError.message);
      }
    }

    return {
      id,
      type,
      link: {
        file: decryptedSources?.[0]?.file ?? "",
        type: "hls",
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
