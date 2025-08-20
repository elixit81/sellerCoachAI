// main/api/coach-ai.js
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito, usa POST." });
  }

  const { type, prompt } = req.body || {};

  // Controllo parametri obbligatori
  if (!type || !prompt) {
    return res.status(400).json({ error: "Parametri mancanti: 'type' e 'prompt' sono obbligatori." });
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
      "Sei un esperto nutrizionista e consulente di vendita. Seleziona 3 combinazioni adatte per un pranzo o cena equilibrato, gustoso e con prodotti surgelati. Ogni combo deve contenere almeno: un alimento principale carne o pesce, un contorno verdure o patate, un completamento fresco. Ogni combo deve essere equilibrata, adatta a un cliente medio e utile da proporre in vendita.";
  } else {
    return res.status(400).json({ error: "Tipo non valido. Usa: consiglio, analisi o combo." });
  }

  try {
    const chat = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      max_tokens: 300,     // limite per risposte concise
      temperature: 0.7,    // bilanciamento tra creatività e coerenza
    });

    const aiMessage = chat.choices?.[0]?.message?.content?.trim() || "Nessuna risposta AI.";
    res.status(200).json({ result: aiMessage });

  } catch (err) {
    console.error("Errore AI:", err);

    // Gestione errori più dettagliata
    if (err.response) {
      res.status(err.response.status).json({
        error: err.response.data?.error?.message || "Errore API OpenAI",
      });
    } else if (err.request) {
      res.status(500).json({ error: "Nessuna risposta ricevuta dall'AI." });
    } else {
      res.status(500).json({ error: "Errore interno del server AI." });
    }
  }
};
