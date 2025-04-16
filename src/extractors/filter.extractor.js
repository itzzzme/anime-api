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

async function extractFilterResults(params = {}) {
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

    const resp = await axios.get(
      `https://${v1_base_url}/filter?${queryParams}`,
      {
        headers: {
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
          "Accept-Encoding": "gzip, deflate, br",
          "User-Agent": DEFAULT_HEADERS,
        },
      }
    );

    const $ = cheerio.load(resp.data);
    const elements = ".flw-item";
    const result = [];

    $(elements).each((_, el) => {
      const $el = $(el);
      const href = $el.find(".film-poster-ahref").attr("href");
      const data_id = Number($el.find(".film-poster-ahref").attr("data-id"));

      result.push({
        id: href ? href.slice(1) : null,
        data_id: data_id ? `${data_id}` : null,
        poster:
          $el.find(".film-poster .film-poster-img").attr("data-src") ||
          $el.find(".film-poster .film-poster-img").attr("src") ||
          null,
        title: $el.find(".film-name .dynamic-name").text().trim(),
        japanese_title:
          $el.find(".film-name .dynamic-name").attr("data-jname") || null,
        tvInfo: {
          showType:
            $el.find(".fd-infor .fdi-item:first-child").text().trim() ||
            "Unknown",
          duration: $el.find(".fd-infor .fdi-duration").text().trim() || null,
          sub:
            Number(
              $el
                .find(".tick-sub")
                .text()
                .replace(/[^0-9]/g, "")
            ) || null,
          dub:
            Number(
              $el
                .find(".tick-dub")
                .text()
                .replace(/[^0-9]/g, "")
            ) || null,
          eps:
            Number(
              $el
                .find(".tick-eps")
                .text()
                .replace(/[^0-9]/g, "")
            ) || null,
        },
        adultContent:
          $el.find(".tick-rate").text().trim() ||
          null,
      });
    });

    const totalPage = Number(
      $('.pre-pagination nav .pagination > .page-item a[title="Last"]')
        ?.attr("href")
        ?.split("=")
        .pop() ||
        $('.pre-pagination nav .pagination > .page-item a[title="Next"]')
          ?.attr("href")
          ?.split("=")
          .pop() ||
        $(".pre-pagination nav .pagination > .page-item.active a")
          ?.text()
          ?.trim() ||
        1
    );

    return [
      parseInt(totalPage, 10),
      result.length > 0 ? result : [],
      parseInt(params.page, 10) || 1,
      parseInt(params.page, 10) < parseInt(totalPage, 10),
    ];
  } catch (e) {
    console.error("Error fetching data:", e);
    throw e;
  }
}

export { extractFilterResults as default };
