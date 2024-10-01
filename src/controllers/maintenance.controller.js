import { join, dirname } from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const handleMaintenance = (req, res) => {
  const filePath = join(
    dirname(dirname(__dirname)),
    "public",
    "maintenance.html"
  );
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
    res.status(404).send(data);
  });
};
