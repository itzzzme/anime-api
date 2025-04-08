import axios from "axios";
import * as cheerio from "cheerio";
import { DEFAULT_HEADERS } from "../configs/header.config.js";
import { v1_base_url } from "../utils/base_v1.js";

async function extractSearchResults(search, page) {
  try {
    const resp = await axios.get(
      `https://${v1_base_url}/search?keyword=${search}&page=${page}`,
      {
        headers: {
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "Accept-Encoding": "gzip, deflate, br",
          "User-Agent": DEFAULT_HEADERS,
        },
      }
    );

    const $ = cheerio.load(resp.data);
    const elements = "#main-content .film_list-wrap .flw-item";

    const totalPage =
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

    const result = [];
    $(elements).each((_, el) => {
      const id =
        $(el)
          .find(".film-detail .film-name .dynamic-name")
          ?.attr("href")
          ?.slice(1)
          .split("?ref=search")[0] || null;
      result.push({
        id: id,
        title: $(el)
          .find(".film-detail .film-name .dynamic-name")
          ?.text()
          ?.trim(),
        japanese_title:
          $(el)
            .find(".film-detail .film-name .dynamic-name")
            ?.attr("data-jname")
            ?.trim() || null,
        poster:
          $(el)
            .find(".film-poster .film-poster-img")
            ?.attr("data-src")
            ?.trim() || null,
        duration: $(el)
          .find(".film-detail .fd-infor .fdi-item.fdi-duration")
          ?.text()
          ?.trim(),
        tvInfo: {
          showType:
            $(el)
              .find(".film-detail .fd-infor .fdi-item:nth-of-type(1)")
              .text()
              .trim() || "Unknown",
          rating: $(el).find(".film-poster .tick-rate")?.text()?.trim() || null,
          sub:
            Number(
              $(el)
                .find(".film-poster .tick-sub")
                ?.text()
                ?.trim()
                .split(" ")
                .pop()
            ) || null,
          dub:
            Number(
              $(el)
                .find(".film-poster .tick-dub")
                ?.text()
                ?.trim()
                .split(" ")
                .pop()
            ) || null,
          eps:
            Number(
              $(el)
                .find(".film-poster .tick-eps")
                ?.text()
                ?.trim()
                .split(" ")
                .pop()
            ) || null,
        },
      });
    });

    return [parseInt(totalPage, 10), result.length > 0 ? result : []];
  } catch (e) {
    console.error(e);
    return e;
  }
}

export default extractSearchResults;
