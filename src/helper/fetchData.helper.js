import axios from "axios";
export async function fetchData(url) {
    const response = await axios.get(url);
    return response.data;
  }