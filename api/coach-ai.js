// api/coach-ai.js

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  const { type, prompt } = req.body;

  let systemPrompt = "";

  if (type === "consiglio") {
    systemPrompt = "Sei un coach di vendita esperto per venditori di surgelati bofrost. scrivi una breve frase motivazionale e poi dammi una breve pillola che posso usare oggi stesso in vendita.";
  } else if (type === "analisi") {
    const prodotti = document.getElementById("prodotti").value;
    const obiezione = document.getElementById("obiezione").value;
    systemPrompt = "Sei un coach esperto che analizza il comportamento di vendita e fornisce feedback breve, specifico e costruttivo. Dimmi alcune caratteristiche di" + prodotti + "che mi aiutino a presentarlo in modo più convincente. Poi dimmi anche in poche parole cosa avrei potuto dire per gestire e superare meglio obiezione" + obiezione;
  } else {
    return res.status(400).json({ error: "Tipo non valido" });
  }

  try {
    const chat = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
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
