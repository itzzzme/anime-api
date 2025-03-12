import axios from "axios";
import * as cheerio from "cheerio";
import baseUrl from "../utils/baseUrl.js";

async function extractTopSearch() {
  try {
    const { data } = await axios.get(baseUrl);
    const $ = cheerio.load(data);
    const results = [];
    $(".xhashtag a.item").each((_, element) => {
      const title = $(element).text().trim();
      const link = $(element).attr("href");
      results.push({ title, link });
    });
    return results;
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
}

export default extractTopSearch;
