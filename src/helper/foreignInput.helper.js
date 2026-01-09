import axios from "axios";
// import { getCachedData, setCachedData } from "./cache.helper";

async function getEnglishTitleFromAniList(userInput) {
  // const cacheKey = `translation:${userInput}`;

  try {
    // Check cache
    // const cachedValue = await getCachedData(cacheKey);
    // if (cachedValue) {
    //   console.log(`Cache Hit ${userInput} -> ${cachedValue}`)
    // }

    const query = `
      query ($search: String) {
        Media (search: $search, type: ANIME) {
          title {
            romaji
            english
          }
        }
      }
    `;

    const response = await axios.post('https://graphql.anilist.co', {
      query,
      variables: { search: userInput }
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 3000 // 3 seconds 
    });

    const titles = response.data?.data?.Media?.title;
    
    if (!titles) {
        console.log(`AniList no match found for: ${userInput}`);
        return userInput;
    }

    const result = titles.english || titles.romaji || userInput;

    // await setCachedData(cacheKey, result);
    
    return result;
  } catch (error) {
    console.error("AniList API Error:", error.response?.data || error.message);
    throw error; 
  }
}

async function convertForeignLanguage(userInput) {
  try {
    if (!userInput) return '';

    // If it's only Latin characters, return as-is
    if (/^[a-zA-Z\s]+$/.test(userInput)) {
      return userInput;
    }

    // Detect if it is Japanese, Chinese or Korean
    const isForeign = /[\u3040-\u30ff\u3000-\u303f\u4e00-\u9faf\uac00-\ud7af]/.test(userInput);

    if (isForeign) {
      const translated = await getEnglishTitleFromAniList(userInput);

      return translated;
    }

    return userInput;
  } catch (error) {
    console.error(`Error converting foreign input ${userInput}:`, error.message);
    return userInput;
  }
}

export default convertForeignLanguage;