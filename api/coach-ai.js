// /pages/api/coach-ai.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito, usa POST." });
  }

  const { type, prompt } = req.body || {};

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "Chiave OpenAI non configurata" });
  }

  if (!type || !prompt) {
    return res.status(400).json({
      error: "Parametri mancanti: 'type' e 'prompt' sono obbligatori.",
    });
  }

  let systemPrompt = "";

  if (type === "consiglio") {
    systemPrompt =
      "Sei un coach di vendita esperto per venditori di surgelati Bofrost. Scrivi una breve frase motivazionale e poi una pillola concreta di vendita.";
  } else if (type === "analisi") {
    systemPrompt =
      "Sei un coach esperto che analizza il comportamento di vendita e fornisce feedback costruttivo su come presentare meglio i prodotti e gestire le obiezioni.";
  } else if (type === "combo") {
    systemPrompt =
      "Sei un nutrizionista e consulente di vendita. Suggerisci 3 combinazioni equilibrate di prodotti surgelati basandoti sul catalogo.";
  } else {
    return res.status(400).json({ error: "Tipo non valido." });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // usa un modello a cui hai accesso
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const aiMessage =
      completion.choices?.[0]?.message?.content?.trim() || "Nessuna risposta AI.";

    res.status(200).json({ result: aiMessage });
  } catch (err) {
    console.error("Errore AI:", err);
    res.status(500).json({
      error: err.response?.data?.error?.message || err.message || "Errore server AI.",
    });
  }
}
