import axios from "axios";
import * as cheerio from "cheerio";
import baseUrl from "../utils/baseUrl.js";

async function fetchAnimeDetails(element) {
  const data_id = element.attr("data-id");
  const number = element.find(".number > span").text();
  const poster = element.find("img").attr("data-src");
  const title = element.find(".film-title").text().trim();
  const japanese_title = element.find(".film-title").attr("data-jname").trim();
  const id = element.find("a").attr("href").split("/").pop();
  return { id, data_id, number, poster, title, japanese_title };
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
    return error;
  }
}

export default extractTrending;
