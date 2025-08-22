// api/coach-ai.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // 🔑 chiave gestita in Vercel (Environment Variables)
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Usa POST" });
  }

  const { type, prompt } = req.body || {};
  if (!prompt) {
    return res.status(400).json({ error: "Manca il prompt" });
  }

  let systemPrompt = "";
  if (type === "analisi") {
    systemPrompt = "Sei un coach di vendita, analizza il feedback dell'utente e dai consigli pratici.";
  } else if (type === "consiglio") {
    systemPrompt = "Sei un coach motivazionale, offri un consiglio del giorno.";
  } else if (type === "combo") {
    systemPrompt = "Sei un consulente di marketing, suggerisci combo di prodotti dal catalogo.";
  } else {
    systemPrompt = "Sei un assistente AI.";
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // usa un modello supportato dal tuo progetto
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
    });

    const aiMessage =
      completion.choices?.[0]?.message?.content?.trim() || "Nessuna risposta.";
    res.status(200).json({ result: aiMessage });
  } catch (err) {
    console.error("Errore OpenAI:", err);
    res.status(500).json({ error: err.message });
  }
}
