import axios from "axios";
import * as cheerio from "cheerio";
import { v1_base_url } from "../utils/base_v1.js";

export default async function extractWatchlist(userId, page = 1) {
  try {
    const url = `https://${v1_base_url}/community/user/${userId}/watch-list?page=${page}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const watchlist = [];

    const totalPages =
      Number(
        $('.pre-pagination nav .pagination > .page-item a[title="Last"]')
          ?.attr("href")
          ?.split("=")
          .pop() ??
          $('.pre-pagination nav .pagination > .page-item a[title="Next"]')
            ?.attr("href")
            ?.split("=")
            .pop() ??
          $(".pre-pagination nav .pagination > .page-item.active a")
            ?.text()
            ?.trim()
      ) || 1;

    $(".flw-item").each((index, element) => {
      const title = $(".film-name a", element).text().trim();
      const poster = $(".film-poster img", element).attr("data-src");
      const duration = $(".fdi-duration", element).text().trim();
      const type = $(".fdi-item", element).first().text().trim();
      const id = $(".film-poster a", element).attr("data-id");
      const subCount = $(".tick-item.tick-sub", element).text().trim();
      const dubCount = $(".tick-item.tick-dub", element).text().trim();
      const link = $(".film-name a", element).attr("href");

      const animeId = link.split("/").pop();

      watchlist.push({
        id: animeId,
        title,
        poster,
        duration,
        type,
        subCount,
        dubCount,
        link: `https://${v1_base_url}${link}`,
        showType: type,
        tvInfo: {
          showType: type,
          duration: duration,
          sub: subCount,
          dub: dubCount,
        },
      });
    });

    return { watchlist, totalPages };
  } catch (error) {
    console.error("Error fetching watchlist:", error.message);
    throw error;
  }
}
