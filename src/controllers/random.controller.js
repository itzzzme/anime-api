import extractRandom from "../extractors/random.extractor.js";

export const getRandom = async (req, res) => {
    try {
        const random = await extractRandom();
        res.json(random);
    } catch (error) {
        console.error("Error getting random anime:", error.message);
        res.status(500).json({ error: "An error occurred while getting random anime" });
    }
}