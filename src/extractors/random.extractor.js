import axios from "axios";
import baseUrl from "../utils/baseUrl.js";
import extractAnimeInfo from "./animeInfo.extractor.js";
import { DEFAULT_HEADERS } from "../configs/header.config.js";

const axiosInstance = axios.create({ headers: DEFAULT_HEADERS });

export default async function extractRandom() {
  try {
    const resp = await axiosInstance.get(`${baseUrl}/random`);
    const redirectedUrl = resp.request.res.responseUrl;
    const id = redirectedUrl.split("/").pop();
    const animeInfo = await extractAnimeInfo(id);
    return animeInfo;
  } catch (error) {
    console.error("Error extracting random anime info:", error);
  }
}
