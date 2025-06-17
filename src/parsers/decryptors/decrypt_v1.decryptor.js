import axios from "axios";
import CryptoJS from "crypto-js";
import { v1_base_url } from "../../utils/base_v1.js";

export async function decryptSources_v1(id, name, type) {
  try {
    const [{ data: sourcesData }, { data: key }] = await Promise.all([
      axios.get(`https://${v1_base_url}/ajax/v2/episode/sources?id=${id}`),
      axios.get(
        "https://raw.githubusercontent.com/itzzzme/megacloud-keys/refs/heads/main/key.txt"
      ),
    ]);

    const ajaxLink = sourcesData?.link;
    if (!ajaxLink) throw new Error("Missing link in sourcesData");

    const match = /\/([^\/\?]+)\?/.exec(ajaxLink);
    const sourceId = match?.[1];
    if (!sourceId) throw new Error("Unable to extract sourceId from link");

    const { data: rawSourceData } = await axios.get(
      `https://megacloud.blog/embed-2/v2/e-1/getSources?id=${sourceId}`
    );
    const encrypted = rawSourceData?.sources;
    if (!encrypted) throw new Error("Encrypted source missing in response");
    const decrypted = CryptoJS.AES.decrypt(encrypted, key.trim()).toString(
      CryptoJS.enc.Utf8
    );
    if (!decrypted) throw new Error("Failed to decrypt source");

    let decryptedSources;
    try {
      decryptedSources = JSON.parse(decrypted);
    } catch (e) {
      throw new Error("Decrypted data is not valid JSON");
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
