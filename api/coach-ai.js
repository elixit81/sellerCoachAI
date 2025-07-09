import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { type, prompt } = req.body;

  try {
    let messages = [];

    if (type === "consiglio") {
      messages = [
        { role: "system", content: "Sei un coach di vendita esperto." },
        { role: "user", content: prompt },
      ];
    } else if (type === "analisi") {
      messages = [
        {
          role: "system",
          content: "Sei un coach di vendita esperto che analizza e dà feedback costruttivi.",
        },
        { role: "user", content: prompt },
      ];
    } else {
      res.status(400).json({ error: "Tipo di richiesta non supportato" });
      return;
    }

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: messages,
    });

    const result = completion.data.choices[0].message.content;

    res.status(200).json({ result });
  } catch (error) {
    console.error("OpenAI API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Errore durante la generazione con OpenAI." });
  }
}
