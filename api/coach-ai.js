import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  const { type, prompt } = req.body;

  try {
    let systemPrompt = "";

    if (type === "consiglio") {
      systemPrompt = "Sei un coach di vendita esperto per venditori porta a porta di surgelati.";
    } else if (type === "analisi") {
      systemPrompt = "Sei un coach esperto che analizza il comportamento di vendita e fornisce feedback costruttivo.";
    } else {
      return res.status(400).json({ error: "Tipo non valido" });
    }

    const chat = await openai.chat.completions.create({
      model: "gpt-3.5",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ]
    });

    const aiMessage = chat.choices?.[0]?.message?.content || "Nessuna risposta AI.";
    res.status(200).json({ result: aiMessage });

  } catch (err) {
    console.error("Errore AI:", err);
    res.status(500).json({ error: "Errore nel server AI" });
  }
}
