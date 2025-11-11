export default async function extractRelatedData($) {
  const relatedSection = $('#main-sidebar .block_area:has(.cat-heading:contains("Related Anime"))');

  const relatedElements = relatedSection.find(
    ".anif-block-ul .ulclear li"
  );

  return await Promise.all(
    relatedElements
      .map(async (index, element) => {
        const $el = $(element);
        const id = $el.find(".film-detail .film-name a").attr("href")?.split("/").pop();
        const data_id = $el.find(".film-poster").attr("data-id");
        const title = $el.find(".film-detail .film-name a").text().trim();
        const japanese_title = $el.find(".film-detail .film-name a").attr("data-jname")?.trim();
        const poster = $el.find(".film-poster img").attr("data-src") || $el.find(".film-poster img").attr("src");

        // Extract show type like "TV", "Movie", etc.
        const showTypeText = $el.find(".tick").text().toLowerCase();
        const showTypeMatch = ["TV", "ONA", "Movie", "OVA", "Special"].find(type =>
          showTypeText.toLowerCase().includes(type.toLowerCase())
        );
        const tvInfo = {
          showType: showTypeMatch || "Unknown"
        };

        // Extract tick items like sub, dub, eps
        ["sub", "dub", "eps"].forEach((type) => {
          const value = $el.find(`.tick-item.tick-${type}`).text().trim();
          if (value) {
            tvInfo[type] = value;
          }
        });

        // Adult content check
        const tickRateText = $el.find(".film-poster > .tick-rate").text().trim();
        const adultContent = tickRateText.includes("18+");

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
