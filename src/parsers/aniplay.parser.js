import axios from "axios";
import { v3_base_url } from "../utils/base_v3.js";

const DEFAULT_BASE_URL = `https://${v3_base_url}`;

class AniplayExtractor {
  constructor(baseUrl = DEFAULT_BASE_URL) {
    this.baseUrl = baseUrl;
    this.keys = null;
    this.keysTs = 0;
  }

  isCacheValid() {
    const now = Math.floor(Date.now() / 1000);
    return this.keys && now - this.keysTs < 3600;
  }

  async fetchHtml(url) {
    const { data } = await axios.get(url);
    return data;
  }

  async fetchStaticJsUrl() {
    const html = await this.fetchHtml(`${this.baseUrl}/anime/watch/1`);
    const prefix = "/_next/static/chunks/app/(user)/(media)/";
    const start = html.indexOf(prefix);
    if (start === -1) throw new Error("Static chunk path not found in HTML.");

    const slugStart = start + prefix.length;
    const slugEnd = html.indexOf('"', slugStart);
    const jsSlug = html.slice(slugStart, slugEnd);
    return `${this.baseUrl}${prefix}${jsSlug}`;
  }

  async extractKeys() {
    if (this.isCacheValid()) return this.keys;

    const scriptUrl = await this.fetchStaticJsUrl();
    const script = await this.fetchHtml(scriptUrl);

    const regex =
      /\(0,\w+\.createServerReference\)\("([a-f0-9]+)",\w+\.callServer,void 0,\w+\.findSourceMapURL,"(getSources|getEpisodes)"\)/g;

    const matches = script.matchAll(regex);
    const keysMap = { baseUrl: this.baseUrl };

    for (const match of matches) {
      const [, hash, fn] = match;
      keysMap[fn] = hash;
    }

    if (!keysMap["getSources"] || !keysMap["getEpisodes"]) {
      throw new Error("Could not extract all required keys.");
    }

    this.keys = keysMap;
    this.keysTs = Math.floor(Date.now() / 1000);
    return keysMap;
  }

  async getNextAction() {
    const keys = await this.extractKeys();
    return {
      watch: keys["getSources"],
      info: keys["getEpisodes"],
    };
  }

  async fetchEpisode(animeId, ep, host = "hika", type = "sub") {
    const nextAction = await this.getNextAction();
    const url = `${this.baseUrl}/anime/watch/${animeId}?host=${host}&ep=${ep}&type=${type}`;
    const payload = [
      String(animeId),
      host,
      `${animeId}/${ep}`,
      String(ep),
      type,
    ];

    try {
      const res = await axios.post(url, payload, {
        headers: {
          "Next-Action": nextAction.watch,
        },
      });
      const dataStr = res.data.split("1:")[1];
      return JSON.parse(dataStr);
    } catch (err) {
      throw new Error(`Request failed: ${err.message}`);
    }
  }
}

export default AniplayExtractor;
