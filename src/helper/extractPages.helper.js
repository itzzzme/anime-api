import axios from "axios";
import * as cheerio from "cheerio";
import baseUrl from "../utils/baseUrl.js";
import { DEFAULT_HEADERS } from "../configs/header.config.js";

const axiosInstance = axios.create({ headers: DEFAULT_HEADERS });

async function extractPage(page, params) {
    try {
      const resp = await axiosInstance.get(`${baseUrl}/${params}?page=${page}`);
      const $ = cheerio.load(resp.data);
  
      const data = await Promise.all(
        $("#main-content .film_list-wrap .flw-item").map(async (index, element) => {
          const $fdiItems = $(".film-detail .fd-infor .fdi-item",element);
          const showType = $fdiItems
            .filter((_, item) => {
              const text = $(item).text().trim().toLowerCase();
              return ["tv", "ona", "movie", "ova", "special"].some((type) => text.includes(type));
            })
            .first();
  $
          const poster = $(".film-poster>img",element).attr("data-src");
          const title = $(".film-detail .film-name",element).text();
          const description = $(".film-detail .description",element).text().trim();
          const data_id = $(".film-poster>a",element).attr("data-id");
          const tvInfo = {
            showType: showType ? showType.text().trim() : "Unknown",
            duration: $(".film-detail .fd-infor .fdi-duration", element).text().trim(),
          };
  
          ["sub", "dub", "eps"].forEach((property) => {
            const value = $(`.tick .tick-${property}`, element).text().trim();
            if (value) {
              tvInfo[property] = value;
            }
          });
  
          return {
            data_id,
            poster,
            title,
            description,
            tvInfo,
          };
        })
      );
  
      return data;
    } catch (error) {
      console.error(`Error extracting data from page ${page}:`, error.message);
      throw error;
    }
  }

export default extractPage;