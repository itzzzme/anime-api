import { fetchData } from "./fetchData.parser.js";
import {v2_base_url} from '../utils/base_v2.js';
import CryptoJS from "crypto-js";
import axios from "axios";
function matchingKey(value, script) {
  const regex = new RegExp(`,${value}=((?:0x)?([0-9a-fA-F]+))`);
  const match = script.match(regex);
  if (match) {
    return match[1].replace(/^0x/, "");
  } else {
    throw new ErrorLoadingException("Failed to match the key");
  }
}
function getKeys(script) {
  const regex =
    /case\s*0x[0-9a-f]+:(?![^;]*=partKey)\s*\w+\s*=\s*(\w+)\s*,\s*\w+\s*=\s*(\w+);/g;
  const matches = script.matchAll(regex);
  const indexPairs = Array.from(matches, (match) => {
    const matchKey1 = matchingKey(match[1], script);
    const matchKey2 = matchingKey(match[2], script);
    try {
      return [parseInt(matchKey1, 16), parseInt(matchKey2, 16)];
    } catch (e) {
      return [];
    }
  }).filter((pair) => pair.length > 0);
  return indexPairs;
}
const script = await axios.get('https://rapid-cloud.co/js/player/prod/e6-player-v2.min.js'); // this one is working

export async function decryptSources_v2(id, name, type) {
  const [sourcesData, decryptKey_v2] = await Promise.all([
      fetchData(`https://${v2_base_url}/ajax/episode/sources?id=${id}`),
      getKeys(script.data),
      // fetchData('https://keys4.fun/'), not works for e1 keys
      // fetchData("https://raw.githubusercontent.com/theonlymo/keys/e6/key"), not work
      // fetchData("https://raw.githubusercontent.com/Claudemirovsky/keys/e6/key")  this was the main repo but now it's deleted
    ]);
  const ajaxResp = sourcesData.link;
  const [hostname] = /^(https?:\/\/(?:www\.)?[^\/\?]+)/.exec(ajaxResp) || [];
  const [_, sourceId] = /\/([^\/\?]+)\?/.exec(ajaxResp) || [];
  const source = await fetchData(
    `${hostname}/ajax/embed-6-v2/getSources?id=${sourceId}`
  );
  try {
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
    const decrypted = CryptoJS.AES.decrypt(
      sourcesArray.join(""),
      extractedKey
    ).toString(CryptoJS.enc.Utf8);
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