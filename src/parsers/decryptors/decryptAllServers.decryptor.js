import { decryptSources_v1 } from "./decrypt_v1.decryptor.js";

export async function decryptAllServers(data) {
  const promises = data.map(async (server) => {
    try {
      if (
        server.type === "sub" ||
        server.type === "dub" ||
        server.type === "raw"
      ) {
        return await decryptSources_v1(server.id, server.name, server.type);
      }
    } catch (error) {
      console.error(`Error decrypting server ${server.id}:`, error);
      return null;
    }
  });
  return Promise.all(promises);
}
