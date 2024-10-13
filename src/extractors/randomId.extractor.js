import axios from "axios";
import baseUrl from "../utils/baseUrl.js";
import { DEFAULT_HEADERS } from "../configs/header.config.js";

const axiosInstance = axios.create({ headers: DEFAULT_HEADERS });

export default async function extractRandomId() {
  try {
    const resp = await axiosInstance.get(`${baseUrl}/random`);
    const redirectedUrl = resp.request.res.responseUrl;
    const id = redirectedUrl.split("/").pop();
    return id;
  } catch (error) {
    console.error("Error extracting random anime info:", error);
  }
}
