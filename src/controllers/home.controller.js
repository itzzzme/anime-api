import { join, dirname } from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const baseDir = dirname(dirname(__filename));

export const handleHomePage = (req, res) => {
  const filePath = join(baseDir, "public", "index.html");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
    res.send(data);
  });
};
