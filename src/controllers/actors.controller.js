import extractVoiceActor from "../extractors/actors.extractor.js";

const getVoiceActor = async (req, res) => {
  const id = req.params.id;
  try {
    const voiceActorData = await extractVoiceActor(id);

    // Ensure the data is structured correctly
    if (!voiceActorData || voiceActorData.results.data.length === 0) {
      return res.status(404).json({ error: "No voice actor found." });
    }

    return res.json(voiceActorData); // Return the desired structure
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "An error occurred" });
  }
};

export default getVoiceActor;
