import axios from "axios";
import { v1_base_url } from "../utils/base_v1.js";

const baseUrl = v1_base_url;


async function extractEpisodesList(id){
    try {
        const showId='';
        const response = await axios.get(`https://${baseUrl}/ajax/v2/episode/list/${showId}`);  
        const $ = cheerio.load(response.data.html);
        const episodes = [];
        let page = 1;
        while (true) {
            const pageSelector = `#episodes-page-${page}`;
            const pageExists = $(pageSelector).length > 0;
            if (!pageExists) break;
            $(pageSelector).find('a.ssl-item.ep-item').each((i, el) => {
                const $el = $(el);
                episodes.push({
                    number: $el.attr('data-number'),
                    title: $el.attr('title'),
                    jname: $el.find('.ep-name').attr('data-jname'),
                    data_id: $el.attr('data-id'),
                    id: `${id}?ep=`+$el.attr('data-id'),
                });
            });
            page++;
        }
        return episodes;
    } catch (e) {
        console.log(e)
    }
}
export default extractEpisodesList;