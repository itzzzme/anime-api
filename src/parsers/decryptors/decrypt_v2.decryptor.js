import CryptoJS from "crypto-js";
import { fetchData } from "../../helper/fetchData.helper.js";
import { v2_base_url } from '../../utils/base_v2.js';
import { PLAYER_SCRIPT_URL } from "../../configs/player_v2.config.js";
import fetchScript from "../../helper/fetchScript.helper.js";
import getKeys from "../../helper/getKey.helper.js";

async function decryptSources_v2(id, name, type) {
  try {
    const [sourcesData, decryptKey_v2] = await Promise.all([
      fetchData(`https://${v2_base_url}/ajax/episode/sources?id=${id}`),
      getKeys(await fetchScript(PLAYER_SCRIPT_URL)),
    ]);

    const ajaxResp = sourcesData.link;
    const [hostname] = /^(https?:\/\/(?:www\.)?[^\/\?]+)/.exec(ajaxResp) || [];
    const [_, sourceId] = /\/([^\/\?]+)\?/.exec(ajaxResp) || [];
    const source = await fetchData(`${hostname}/ajax/embed-6-v2/getSources?id=${sourceId}`);

    const sourcesArray = source.sources.split("");
    let extractedKey = "";
    let currentIndex = 0;

    for (const index of decryptKey_v2) {
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

export { decryptSources_v2 };
