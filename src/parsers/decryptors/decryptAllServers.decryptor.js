import { decryptSources_v1 } from "./decrypt_v1.decryptor.js";
import { decryptSources_v2 } from "./decrypt_v2.decryptor.js";
import { extractSubtitle } from "../../extractors/subtitle.extractor.js";

export async function decryptAllServers(data) {
  const promises = data.map(async (server) => {
    const subtitlePromise = extractSubtitle(server.id);

    let decryptionPromise;
    if (server.type === "sub") {
      decryptionPromise = decryptSources_v1(server.id, server.name, server.type);
    } else if (server.type === "dub") {
      decryptionPromise = decryptSources_v2(server.id, server.name, server.type);
    }

    const [subtitleResult, decryptionResult] = await Promise.all([
      subtitlePromise,
      decryptionPromise,
    ]);

    return { decryptionResult, subtitleResult };
  });

  return Promise.allSettled(promises);
}
