import axios from "axios";
import * as cheerio from "cheerio";
import  baseUrl  from "../utils/baseUrl.js";

async function fetchAnimeDetails(element) {
  const data_id = element.attr("data-id");
  const number = element.find(".number > span").text();
  const poster = element.find("img").attr("data-src");
  const title = element.find(".film-title").text().trim();
  return { data_id, number, poster, title };
}

async function extractTrending() {
  try {
    const resp = await axios.get(`${baseUrl}/home`);
    const $ = cheerio.load(resp.data);

    const trendingElements = $("#anime-trending #trending-home .swiper-slide");
    const elementPromises = trendingElements
      .map((index, element) => {
        return fetchAnimeDetails($(element));
      })
      .get();

    const trendingData = await Promise.all(elementPromises);
    return JSON.parse(JSON.stringify(trendingData));
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
}

export default extractTrending;
