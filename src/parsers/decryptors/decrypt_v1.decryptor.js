// this is kept as backup in case megacloud's architecture rollback to it's previous architecture


// import axios from "axios";
// import CryptoJS from "crypto-js";
// import { v1_base_url } from "../../utils/base_v1.js";
// import fetchScript from "../../helper/fetchScript.helper.js";
// import getKeys from "../../helper/getKey.helper.js";
// import { PLAYER_SCRIPT_URL } from "../../configs/player_v1.config.js";
// import { extractURL } from "./megacloud.decryptor.js";

// export async function decryptSources_v1(id, name, type) {
//   try {
//     const [{ data: sourcesData }, decryptKey_v1] = await Promise.all([
//       axios.get(`https://${v1_base_url}/ajax/v2/episode/sources?id=${id}`),
//       getKeys(await fetchScript(PLAYER_SCRIPT_URL)),
//     ]);
//     const ajaxResp = sourcesData.link;
//     const [_, sourceId] = /\/([^\/\?]+)\?/.exec(ajaxResp) || [];
//     const source = await extractURL(sourceId);
//     const sourcesArray = source.sources.split("");
//     let extractedKey = "";
//     let currentIndex = 0;

//     for (const index of decryptKey_v1) {
//       const start = index[0] + currentIndex;
//       const end = start + index[1];

//       for (let i = start; i < end; i++) {
//         extractedKey += sourcesArray[i];
//         sourcesArray[i] = "";
//       }
//       currentIndex += index[1];
//     }
//     const decrypted = CryptoJS.AES.decrypt(
//       sourcesArray.join(""),
//       extractedKey
//     ).toString(CryptoJS.enc.Utf8);
//     const decryptedSources = JSON.parse(decrypted);
//     source.sources = null;
//     source.sources = {
//       file: decryptedSources[0].file,
//       type: "hls",
//     };
//     if (source.hasOwnProperty("server")) {
//       delete source.server;
//     }
//     return {
//       id: id,
//       type: type,
//       link: source.sources,
//       tracks: source.tracks,
//       intro: source.intro,
//       outro: source.outro,
//       server: name,
//     };
//   } catch (error) {
//     console.error("Error during decryption:", error);
//   }
// }
