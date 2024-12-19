// this is kept as backup in case megacloud's architecture rollback to it's previous architecture


// import decryptMegacloud from "./megacloud.decryptor.js";

// export async function decryptAllServers(data) {
//   const promises = data.map(async (server) => {
//     try {
//       if (
//         server.type === "sub" ||
//         server.type === "dub" ||
//         server.type === "raw"
//       ) {
//         return await decryptMegacloud(server.id, server.name, server.type);
//       }
//     } catch (error) {
//       console.error(`Error decrypting server ${server.id}:`, error);
//       return null;
//     }
//   });
//   return Promise.all(promises);
// }
