import axios from "axios";
import * as cheerio from "cheerio";
import baseUrl from "../utils/baseUrl.js";
import { provider } from "../utils/provider.js";

export async function extractSubtitle(id) {
  // console.log(id);
  const resp = await axios.get(`${baseUrl}/ajax/v2/episode/sources/?id=${id}`);
  // console.log(resp.data.link.split('/').pop().replace(/\?k=\d?/g, ""));
  const source = await axios.get(
    `${provider}/embed-2/ajax/e-1/getSources?id=${resp.data.link
      .split("/")
      .pop()
      .replace(/\?k=\d?/g, "")}`
  );
  const subtitles = source.data.tracks;
  const intro = source.data.intro;
  const outro = source.data.outro;
  return { subtitles, intro, outro };
}
