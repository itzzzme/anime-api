import axios from "axios";
import * as cheerio from "cheerio";
import { v1_base_url } from "../utils/base_v1.js";

export async function extractCharacter(id) {
  try {
    const response = await axios.get(`https://${v1_base_url}//character/${id}`);
    const $ = cheerio.load(response.data);

    // Extract basic information
    const name = $(".apw-detail .name").text().trim();
    const japaneseName = $(".apw-detail .sub-name").text().trim();

    // Extract profile image
    const profile = $(".avatar-circle img").attr("src");

    // Extract about information
    const bioText = $("#bio .bio").text().trim();
    const bioHtml = $("#bio .bio").html();
    const about = {
      description: bioText,
      style: bioHtml,
    };

    // Extract voice actors
    const voiceActors = [];
    $("#voiactor .per-info").each((_, element) => {
      const voiceActorElement = $(element);

      const voiceActor = {
        name: voiceActorElement.find(".pi-name a").text().trim(),
        profile: voiceActorElement.find(".pi-avatar img").attr("src"),
        language: voiceActorElement.find(".pi-cast").text().trim(),
        id: voiceActorElement.find(".pi-name a").attr("href")?.split("/").pop(),
      };

      if (voiceActor.name && voiceActor.id) {
        voiceActors.push(voiceActor);
      }
    });

    // Extract animeography
    const animeography = [];
    $(".anif-block-ul li").each((_, el) => {
      const item = $(el);
      const anchor = item.find(".film-name a.dynamic-name");

      const title = anchor.text().trim();
      const japanese_title = anchor.attr("data-jname")?.trim();
      const id = anchor.attr("href")?.split("/").pop();
      const role = item.find(".fdi-item").first().text().trim();
      const type = item.find(".fdi-item").last().text().trim();
      const poster = item.find(".film-poster img").attr("src");

      if (title && id) {
        animeography.push({
          title,
          japanese_title,
          id,
          role: role.replace(" (Role)", ""),
          type,
          poster,
        });
      }
    });

    const characterData = {
      success: true,
      results: {
        data: [
          {
            id,
            name,
            profile,
            japaneseName,
            about,
            voiceActors,
            animeography,
          },
        ],
      },
    };

    return characterData;
  } catch (error) {
    console.error("Error extracting character data:", error);
    throw new Error("Failed to extract character information");
  }
}

export default extractCharacter;
