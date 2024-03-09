import express from "express";
import extractSpotlights from "../src/extractors/spotlight.js";
import extractTrending from "../src/extractors/trending.js";
import { extractor, countPages } from "../src/extractors/extract.js";
import extractTopTen from "../src/extractors/topten.js";
import extractAnimeInfo from "../src/extractors/animeInfo.js";
import {
  extractOtherEpisodes,
  extractStreamingInfo,
} from "../src/extractors/streamInfo.js";
import extractSearchResults from "../src/extractors/searchResult.js";
import extractSeasons from "../src/extractors/seasons.js";

const app = express();
const port = process.env.PORT || 4444;

const handleRequest = async (req, res, extractorType) => {
  try {
    let requestedPage = parseInt(req.query.page) || 1;
    const { data, totalPages } = await extractor(extractorType, requestedPage);

    requestedPage = Math.min(requestedPage, totalPages);

    if (requestedPage !== parseInt(req.query.page)) {
      return res.redirect(
        `${req.originalUrl.split("?")[0]}?page=${requestedPage}`
      );
    }

    res.json({ success: true, results: { totalPages, data } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

app.get("/api/", async (req, res) => {
  try {
    const [spotlights, trending] = await Promise.all([
      extractSpotlights(),
      extractTrending(),
    ]);
    res.json({ success: true, results: { spotlights, trending } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

const routeTypes = [
  "top-airing",
  "most-popular",
  "most-favorite",
  "completed",
  "recently-updated",
  "recently-added",
  "top-upcoming",
];

routeTypes.forEach((routeType) => {
  app.get(`/api/${routeType}`, async (req, res) => {
    await handleRequest(req, res, routeType);
  });
});

app.get("/api/top-ten", async (req, res) => {
  try {
    res.json({ success: true, results: await extractTopTen() });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.get("/api/info", async (req, res) => {
  const id = req.query.id;
  try {
    const [seasons, data] = await Promise.all([
      extractSeasons(id),
      extractAnimeInfo(id),
    ]);
    res.json({ success: true, results: { seasons, data } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});
app.get("/api/stream", async (req, res) => {
  try {
    const input = req.query.id;
    const match = input.match(/ep=(\d+)/);
    if (!match) {
      throw new Error("Invalid URL format");
    }
    const finalId = match[1];
    const [ episodes, streamingInfo] = await Promise.all([
      extractOtherEpisodes(input),
      extractStreamingInfo(finalId),
    ]);
    res.json({ success: true, results: { streamingInfo, episodes } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});
app.get("/api/search", async (req, res) => {
  const keyword = req.query.keyword;
  try {
    const data = await extractSearchResults(encodeURIComponent(keyword));
    res.json({ success: true, results: data });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
