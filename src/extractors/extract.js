import axios from "axios";
import * as cheerio from "cheerio";
import baseUrl from "../utils/baseUrl.js";

const DEFAULT_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
};

const axiosInstance = axios.create({ headers: DEFAULT_HEADERS });

async function countPages(url) {
  try {
    const { data } = await axiosInstance.get(url);
    const $ = cheerio.load(data);
    const lastPageHref = $("#main-content .pagination .page-item:last-child a").attr("href");
    const lastPageNumber = lastPageHref ? parseInt(lastPageHref.split("=").pop()) : 1;
    return lastPageNumber;
  } catch (error) {
    console.error("Error counting pages:", error.message);
    throw error;
  }
}

async function extractingPage(page, params) {
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

async function extractor(path, page) {
  try {
    const [data, totalPages] = await Promise.all([
      extractingPage(page, path),
      countPages(`${baseUrl}/${path}`),
    ]);

    return { data, totalPages };
  } catch (error) {
    console.error(`Error extracting data for ${path} from page ${page}:`, error.message);
    throw error;
  }
}

export { extractor, countPages };
