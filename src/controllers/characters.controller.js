import extractCharacter from "../extractors/characters.extractor.js";

const getCharacter = async (req, res) => {
  const id = req.params.id;
  try {
    const { characters } = await extractCharacter(id);

    // Ensure the data is structured correctly
    if (!characters || characters.length === 0) {
      return res.status(404).json({ error: "Character not found." });
    }

    return res.json({ characters }); // Return the desired structure
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "An error occurred" });
  }
};

export default getCharacter; 