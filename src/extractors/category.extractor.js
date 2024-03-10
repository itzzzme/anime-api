import axios from "axios";
import baseUrl from "../utils/baseUrl.js";
import countPages from "../helper/countPages.helper.js";
import extractPage from "../helper/extractPages.helper.js";


async function extractor(path, page) {
  try {
    const [data, totalPages] = await Promise.all([
      extractPage(page, path),
      countPages(`${baseUrl}/${path}`),
    ]);

    return { data, totalPages };
  } catch (error) {
    console.error(`Error extracting data for ${path} from page ${page}:`, error.message);
    throw error;
  }
}

export { extractor, countPages };
