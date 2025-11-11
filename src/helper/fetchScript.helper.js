import axios from "axios";

async function fetchScript(url) {
  const response = await axios.get(url);
  return response.data;
}

export default fetchScript;
