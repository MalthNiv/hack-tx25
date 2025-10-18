export default async function handler(req, res) {
    const cardName = req.query.cardName;
    if (!cardName) return res.status(400).json({ error: "Missing cardName" });

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) return res.status(500).json({ error: "Missing GEMINI_API_KEY" });

    try {
        const response = await fetch("https://gemini.example/v1/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GEMINI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: `Give a mystical, oracle-style interpretation for a card named "${cardName}". Keep it short and mystical.`
            })
        });

        const json = await response.json();
        const interpretation = json.text || json.output || "No interpretation returned";
        res.status(200).json({ interpretation });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch Gemini interpretation" });
    }
}