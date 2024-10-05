export default async function extractRelatedData($) {
  const relatedElements = $(
    "#main-sidebar .block_area_sidebar .block_area-content .cbox-list .cbox-content .anif-block-ul .ulclear li"
  );
  return await Promise.all(
    relatedElements
      .map(async (index, element) => {
        const id = $(element)
          .find(".film-detail .film-name a")
          .attr("href")
          .split("/")
          .pop();
        const data_id = $(element).find(".film-poster").attr("data-id");
        const title = $(element)
          .find(".film-detail .film-name a")
          .text()
          .trim();
        const japanese_title = $(element)
          .find(".film-detail .film-name a")
          .attr("data-jname")
          .trim();
        const poster = $(element).find(".film-poster img").attr("data-src");
        const $fdiItems = $(".film-detail>.fd-infor>.tick", element);
        const showType = $fdiItems
          .filter((_, item) => {
            const text = $(item).text().trim().toLowerCase();
            return ["tv", "ona", "movie", "ova", "special"].some((type) =>
              text.includes(type)
            );
          })
          .first()
          .text()
          .trim()
          .split(/\s+/)
          .find((word) =>
            ["tv", "ona", "movie", "ova", "special"].includes(
              word.toLowerCase()
            )
          );
        const tvInfo = {
          showType: showType ? showType : "Unknown",
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
