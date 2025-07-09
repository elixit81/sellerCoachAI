const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { type, prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt mancante" });
    }

    const messages = [
      { role: "system", content: "Sei un coach di vendita esperto." },
      { role: "user", content: prompt },
    ];

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages,
    });

    const result = completion.data.choices[0].message.content;

    res.status(200).json({ result });
  } catch (error) {
    console.error("OpenAI API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Errore interno del server" });
  }
};
