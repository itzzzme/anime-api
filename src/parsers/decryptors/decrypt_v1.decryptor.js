import CryptoJS from "crypto-js";
import { v1_base_url } from "../../utils/base_v1.js";
import { fetchData } from "../../helper/fetchData.helper.js";
import fetchScript from "../../helper/fetchScript.helper.js";
import getKeys from "../../helper/getKey.helper.js";
import { PLAYER_SCRIPT_URL } from "../../configs/player_v1.config.js";


export async function decryptSources_v1(id, name, type) {
  try {
    const [sourcesData, decryptKey_v1] = await Promise.all([
      fetchData(`https://${v1_base_url}/ajax/v2/episode/sources?id=${id}`),
      getKeys(await fetchScript(PLAYER_SCRIPT_URL)),
    ]);

    const ajaxResp = sourcesData.link;
    const [hostname] = /^(https?:\/\/(?:www\.)?[^\/\?]+)/.exec(ajaxResp) || [];
    const [_, sourceId] = /\/([^\/\?]+)\?/.exec(ajaxResp) || [];
    const source = await fetchData(`${hostname}/embed-2/ajax/e-1/getSources?id=${sourceId}`);

    const sourcesArray = source.sources.split("");
    let extractedKey = "";
    let currentIndex = 0;

    for (const index of decryptKey_v1) {
      const start = index[0] + currentIndex;
      const end = start + index[1];

      for (let i = start; i < end; i++) {
        extractedKey += sourcesArray[i];
        sourcesArray[i] = "";
      }
      currentIndex += index[1];
    }

    const decrypted = CryptoJS.AES.decrypt(sourcesArray.join(""), extractedKey).toString(CryptoJS.enc.Utf8);
    const decryptedSources = JSON.parse(decrypted);

    return {
      link: decryptedSources[0].file,
      server: name,
      type: type,
    };
  } catch (error) {
    console.error("Error during decryption:", error);
  }
}
