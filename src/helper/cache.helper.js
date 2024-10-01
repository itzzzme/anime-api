import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const CACHE_SERVER_URL = process.env.CACHE_URL;
const ORIGIN_URL = process.env.ORIGIN_URL;

export const getCachedData = async (key) => {
  try {
    const response = await axios.get(`${CACHE_SERVER_URL}/${key}`, {
      headers: {
        Origin: ORIGIN_URL,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
};

export const setCachedData = async (key, value) => {
  try {
    await axios.post(
      CACHE_SERVER_URL,
      { key, value },
      {
        headers: {
          Origin: ORIGIN_URL,
        },
      }
    );
  } catch (error) {
    console.error("Error setting cache data:", error);
    throw error;
  }
};
