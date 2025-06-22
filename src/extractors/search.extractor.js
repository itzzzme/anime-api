import axios from "axios";
import * as cheerio from "cheerio";
import { DEFAULT_HEADERS } from "../configs/header.config.js";
import { v1_base_url } from "../utils/base_v1.js";
import {
  FILTER_LANGUAGE_MAP,
  GENRE_MAP,
  FILTER_TYPES,
  FILTER_STATUS,
  FILTER_RATED,
  FILTER_SCORE,
  FILTER_SEASON,
  FILTER_SORT,
} from "../routes/filter.maping.js";

async function extractSearchResults(params = {}) {
  try {
    const normalizeParam = (param, mapping) => {
      if (!param) return undefined;

      if (typeof param === "string") {
        const isAlreadyId = Object.values(mapping).includes(param);
        if (isAlreadyId) {
          return param;
        }

        const key = param.trim().toUpperCase();
        return mapping.hasOwnProperty(key) ? mapping[key] : undefined;
      }
      return param;
    };

    const typeParam = normalizeParam(params.type, FILTER_TYPES);
    const statusParam = normalizeParam(params.status, FILTER_STATUS);
    const ratedParam = normalizeParam(params.rated, FILTER_RATED);
    const scoreParam = normalizeParam(params.score, FILTER_SCORE);
    const seasonParam = normalizeParam(params.season, FILTER_SEASON);
    const sortParam = normalizeParam(params.sort, FILTER_SORT);

    let languageParam = params.language;
    if (typeof languageParam === "string") {
      languageParam = languageParam.trim().toUpperCase();
      languageParam = FILTER_LANGUAGE_MAP[languageParam] || undefined;
    }

    let genresParam = params.genres;
    if (typeof genresParam === "string") {
      genresParam = genresParam
        .split(",")
        .map((genre) => GENRE_MAP[genre.trim().toUpperCase()] || genre.trim())
        .join(",");
    }

    const filteredParams = {
      type: typeParam,
      status: statusParam,
      rated: ratedParam,
      score: scoreParam,
      season: seasonParam,
      language: languageParam,
      genres: genresParam,
      sort: sortParam,
      page: params.page || 1,
      sy: params.sy || undefined,
      sm: params.sm || undefined,
      sd: params.sd || undefined,
      ey: params.ey || undefined,
      em: params.em || undefined,
      ed: params.ed || undefined,
      keyword: params.keyword || undefined,
    };

    Object.keys(filteredParams).forEach((key) => {
      if (filteredParams[key] === undefined) {
        delete filteredParams[key];
      }
    });

    const queryParams = new URLSearchParams(filteredParams).toString();

    const resp = await axios.get(`https://${v1_base_url}/search?${queryParams}`, {
      headers: {
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "User-Agent": DEFAULT_HEADERS,
      },
    });

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
        duration:
          $(el)
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
