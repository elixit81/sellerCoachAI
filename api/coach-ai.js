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
    systemPrompt =
      "Sei un coach di vendita esperto per venditori di surgelati Bofrost. Scrivi una breve frase motivazionale e poi dammi una breve pillola concreta che posso usare oggi stesso in vendita.";
  } else if (type === "analisi") {
    systemPrompt =
      "Sei un coach esperto che analizza il comportamento di vendita e fornisce feedback specifico e costruttivo. Indica anche le caratteristiche del prodotto da valorizzare e suggerisci in poche parole come gestire meglio l'obiezione.";
  } else if (type === "combo") {
    systemPrompt =
      "Sei un esperto nutrizionista e consulente di vendita. Analizza i prodotti elencati e suggerisci 3 combinazioni per un pranzo o una cena usando almeno due o tre prodotti ciascuna. Ogni combo deve essere equilibrata, adatta a un cliente medio e utile da proporre in vendita.";
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
