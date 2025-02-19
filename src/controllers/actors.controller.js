import extractVoiceActor from "../extractors/actors.extractor.js";

const getVoiceActors = async (req, res) => {
  const id = req.params.id;
  try {
    const { charactersVoiceActors } = await extractVoiceActor(id);

    // Ensure the data is structured correctly
    if (!charactersVoiceActors || charactersVoiceActors.length === 0) {
      return res.status(404).json({ error: "No voice actors found." });
    }

    return res.json({ charactersVoiceActors }); // Return the desired structure
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "An error occurred" });
  }
};

export default getVoiceActors;
