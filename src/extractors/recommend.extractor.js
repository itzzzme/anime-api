export default async function extractRecommendedData($) {
  const recommendedElements = $(
    "#main-content .block_area_category .tab-content .block_area-content .film_list-wrap .flw-item"
  );
  return await Promise.all(
    recommendedElements
      .map(async (index, element) => {
        const id = $(element)
          .find(".film-detail .film-name a")
          .attr("href")
          .split("/")
          .pop();
        const data_id = $(element).find(".film-poster a").attr("data-id");
        const title = $(element)
          .find(".film-detail .film-name a")
          .text()
          .trim();
        const japanese_title = $(element)
          .find(".film-detail .film-name a")
          .attr("data-jname")
          .trim();
        const poster = $(element).find(".film-poster img").attr("data-src");
        const $fdiItems = $(".film-detail .fd-infor .fdi-item", element);
        const showType = $fdiItems
          .filter((_, item) => {
            const text = $(item).text().trim().toLowerCase();
            return ["tv", "ona", "movie", "ova", "special"].some((type) =>
              text.includes(type)
            );
          })
          .first();

        const tvInfo = {
          showType: showType ? showType.text().trim() : "Unknown",
          duration: $(".film-detail .fd-infor .fdi-duration", element)
            .text()
            .trim(),
        };

        ["sub", "dub", "eps"].forEach((property) => {
          const value = $(`.tick .tick-${property}`, element).text().trim();
          if (value) {
            tvInfo[property] = value;
          }
        });
        let adultContent = false;
        const tickRateText = $(".film-poster>.tick-rate", element)
          .text()
          .trim();
        if (tickRateText.includes("18+")) {
          adultContent = true;
        }
        return {
          data_id,
          id,
          title,
          japanese_title,
          poster,
          tvInfo,
          adultContent,
        };
      })
      .get()
  );
}
