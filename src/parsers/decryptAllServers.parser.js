import { decryptSources_v1 } from "./decrypt_v1.parser.js";
import { decryptSources_v2 } from "./decrypt_v2.parser.js";
import { extractSubtitle } from "../extractors/extractSubtitle.js";

export async function decryptAllServers(data) {
  const promises = data.map(async (server) => {
    if (server.type === "sub") {
      const subtitleResult = await extractSubtitle(server.id);
      const decryptionResult = await decryptSources_v1(
        server.id,
        server.name,
        server.type
      );
      return { decryptionResult, subtitleResult };
    } else if (server.type === "dub") {
      const subtitleResult = await extractSubtitle(server.id);
      const decryptionResult = await decryptSources_v2(
        server.id,
        server.name,
        server.type
      );
      return { decryptionResult, subtitleResult };
    }
  });

  return Promise.allSettled(promises);
}
