// api/coach-ai.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  console.log("Request received");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito, usa POST." });
  }

  const { type, prompt } = req.body || {};

  if (!process.env.OPENAI_API_KEY) {
    console.error("Chiave OpenAI mancante!");
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
      "Sei un coach di vendita esperto per venditori di surgelati Bofrost. Scrivi una breve frase motivazionale e poi dammi una breve pillola concreta che posso usare oggi stesso in vendita.";
  } else if (type === "analisi") {
    systemPrompt =
      "Sei un coach esperto che analizza il comportamento di vendita e fornisce feedback specifico e costruttivo. Indica anche le caratteristiche del prodotto da valorizzare e suggerisci in poche parole come gestire meglio l'obiezione.";
  } else if (type === "combo") {
    systemPrompt =
      "Sei un esperto nutrizionista e consulente di vendita. Ricevi dal front-end un prompt dettagliato con i filtri selezionati. Rispondi con 3 combinazioni equilibrate di prodotti surgelati.";
  } else {
    return res
      .status(400)
      .json({ error: "Tipo non valido. Usa: consiglio, analisi o combo." });
  }

  try {
    const chat = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const aiMessage =
      chat.choices?.[0]?.message?.content?.trim() || "Nessuna risposta AI.";
    console.log("AI response:", aiMessage);

    res.status(200).json({ result: aiMessage });
  } catch (err) {
    console.error("Errore AI:", err);
    res.status(500).json({
      error:
        err.response?.data?.error?.message ||
        err.message ||
        "Errore interno del server AI.",
    });
  }
}
