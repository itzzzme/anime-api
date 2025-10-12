import axios from "axios";
import * as cheerio from "cheerio";
import { v1_base_url } from "../utils/base_v1.js";

export default async function extractQtip(id) {
  try {
    const { data } = await axios.get(
      `https://${v1_base_url}/ajax/movie/qtip/${id}`,
      {
        headers: {
          "x-requested-with": "XMLHttpRequest",
        },
      }
    );
    const $ = cheerio.load(data);

    const title = $(".pre-qtip-title").text();
    const rating = $(".pqd-li i.fas.fa-star").parent().text().trim();
    const quality = $(".tick-item.tick-quality").text();
    const subCount = $(".tick-item.tick-sub").text().trim();
    const dubCount = $(".tick-item.tick-dub").text().trim();
    const episodeCount = $(".tick-item.tick-eps").text().trim();
    const type = $(".badge.badge-quality").text();
    const description = $(".pre-qtip-description").text().trim();
    const japaneseTitle = $(".pre-qtip-line:contains('Japanese:') .stick-text")
      .text()
      .trim();
    const airedDate = $(".pre-qtip-line:contains('Aired:') .stick-text")
      .text()
      .trim();
    const status = $(".pre-qtip-line:contains('Status:') .stick-text")
      .text()
      .trim();
    const Synonyms = $(".pre-qtip-line:contains('Synonyms:') .stick-text")
      .text()
      .trim();
    const genres = [];
    $(".pre-qtip-line:contains('Genres:') a").each((i, elem) => {
      genres.push($(elem).text().trim());
    });
    const watchLink = $(".pre-qtip-button a.btn.btn-play").attr("href");

    let anilistId = null;
    let malId = null;
    if (watchLink) {
      try {
        const animeSlug = watchLink.replace('/watch', '');
        
        const mainPageResponse = await axios.get(`https://${v1_base_url}${animeSlug}`);
        const $mainPage = cheerio.load(mainPageResponse.data);
        
        const syncDataScript = $mainPage("#syncData").html();
        if (syncDataScript) {
          const syncData = JSON.parse(syncDataScript);
          anilistId = syncData.anilist_id || null;
          malId = syncData.mal_id || null;
        }
      } catch (error) {
        console.error("Error fetching AniList/MAL IDs:", error);
      }
    }

    const extractedData = {
      title,
      rating,
      anilistId,
      malId,
      quality,
      subCount,
      dubCount,
      episodeCount,
      type,
      description,
      japaneseTitle,
      Synonyms,
      airedDate,
      status,
      genres,
      watchLink,
    };
    return extractedData;
  } catch (error) {
    console.error("Error extracting data:", error);
    return error;
  }
}
