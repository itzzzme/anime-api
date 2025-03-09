import extractWatchlist from "../extractors/watchlist.extractor.js";

export const getWatchlist = async (req, res) => {
  const { userId, page = 1 } = req.params;

  try {
    const { watchlist, totalPages } = await extractWatchlist(userId, page);
    
    // Restructuring the response
    return res.json({
      success: true,
      results: {
        totalPages, // Include total pages in the response
        data: watchlist.map(item => ({
          id: item.id,
          data_id: item.data_id,
          poster: item.poster,
          title: item.title,
          japanese_title: item.japanese_title,
          description: item.description,
          tvInfo: {
            showType: item.tvInfo.showType,
            duration: item.tvInfo.duration,
            sub: item.tvInfo.sub,
            dub: item.tvInfo.dub,
            // Include eps if it exists
            ...(item.tvInfo.eps && { eps: item.tvInfo.eps })
          },
          adultContent: item.adultContent,
        }))
      }
    });
  } catch (error) {
    console.error("Error getting watchlist:", error.message);
    
    if (!res.headersSent) {
      return res.status(500).json({ error: "An error occurred while fetching the watchlist." });
    }
  }
}; 