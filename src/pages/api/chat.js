import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Server missing API key." });
    }

    const { card } = req.body;
    if (!card?.name) return res.status(400).json({ error: "Missing card name" });

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        let prompt;

        // If no conversation yet, return first reply with 3 points
        if (!card.conversation || card.conversation.trim() === "") {
            prompt = `
You are a calm, concise tarot reader.
Give a reading for the card "${card.name}".
Do not say hello.
Respond in three distinct sections one sentence each:
1. Literal meaning (don't say literal, talk about the god and what they are the god of)
2. Symbolic meaning (interpret the card's meaning for the user)
3. A reflective, simple question for the user.
Use a friendly, conversational, and straightforward tone, and make everything flow together.
`;
        } else {
            // Otherwise continue conversation based on user messages
            prompt = `
You are a calm, concise tarot reader.
The user and you have been chatting:
${card.conversation}
Respond naturally, conversationally, as the tarot reader.
Keep answers concise but thoughtful.
`;
        }

        const result = await model.generateContent(prompt);

        const reply =
            result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
            result?.response?.text ||
            "No response from Gemini.";

        res.status(200).json({ reply });
    } catch (err) {
        res.status(500).json({ error: err.message || "Failed to fetch card reading." });
    }
}
