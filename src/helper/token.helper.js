import axios from 'axios';
import * as cheerio from 'cheerio';
import { v1_base_url } from '../utils/base_v1.js';

export default async function extractToken(url) {
  try {
    const { data: html } = await axios.get(url, {
      headers: {
        Referer: `https://${v1_base_url}/`
      }
    });

    const $ = cheerio.load(html);
    const results = {};

    // 1. Meta tag
    const meta = $('meta[name="_gg_fb"]').attr('content');
    if (meta) results.meta = meta;

    // 2. Data attribute
    const dpi = $('[data-dpi]').attr('data-dpi');
    if (dpi) results.dataDpi = dpi;

    // 3. Nonce from empty script
    const nonceScript = $('script[nonce]').filter((i, el) => {
      return $(el).text().includes('empty nonce script');
    }).attr('nonce');
    if (nonceScript) results.nonce = nonceScript;

    // 4. JS string assignment: window.<key> = "value";
    const stringAssignRegex = /window\.(\w+)\s*=\s*["']([\w-]+)["']/g;
    const stringMatches = [...html.matchAll(stringAssignRegex)];
    for (const [_, key, value] of stringMatches) {
      results[`window.${key}`] = value;
    }

    // 5. JS object assignment: window.<key> = { ... };
    const objectAssignRegex = /window\.(\w+)\s*=\s*(\{[\s\S]*?\});/g;
    const matches = [...html.matchAll(objectAssignRegex)];
    for (const [_, varName, rawObj] of matches) {
      try {
        const parsedObj = eval('(' + rawObj + ')'); 
        if (parsedObj && typeof parsedObj === 'object') {
          const stringValues = Object.values(parsedObj).filter(val => typeof val === 'string');
          const concatenated = stringValues.join('');
          if (concatenated.length >= 20) {
            results[`window.${varName}`] = concatenated;
          }
        }
      } catch (e) {
        // Skip invalid object
      }
    }

    // 6. HTML comment: <!-- _is_th:... -->
    $('*').contents().each(function () {
      if (this.type === 'comment') {
        const match = this.data.trim().match(/^_is_th:([\w-]+)$/);
        if (match) {
          results.commentToken = match[1].trim();
        }
      }
    });

    const token = Object.values(results)[0];
    return token || null;
  } catch (err) {
    console.error('Error:', err.message);
    return null;
  }
}