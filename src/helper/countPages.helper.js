import axios from "axios";
import * as cheerio from "cheerio";
import { DEFAULT_HEADERS } from "../configs/header.config.js";

const axiosInstance = axios.create({ headers: DEFAULT_HEADERS });

async function countPages(url) {
  try {
    const { data } = await axiosInstance.get(url);
    const $ = cheerio.load(data);
    const lastPageHref = $(
      ".tab-content .pagination .page-item:last-child a"
    ).attr("href");
    const lastPageNumber = lastPageHref
      ? parseInt(lastPageHref.split("=").pop())
      : 1;
    return lastPageNumber;
  } catch (error) {
    console.error("Error counting pages:", error.message);
    throw error;
  }
}

export default countPages;
