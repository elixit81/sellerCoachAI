// api/coach-ai.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { type, prompt } = req.body;
  const systemPrompt =
    type === "consiglio"
      ? "Sei un coach di vendita. Fornisci un breve consiglio pratico e motivante."
      : "Sei un coach esperto che analizza le interazioni di vendita e fornisce feedback costruttivo.";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    const json = await response.json();
    const result = json.choices?.[0]?.message?.content;
    res.status(200).json({ result });
  } catch (err) {
    console.error("Errore AI:", err);
    res.status(500).json({ error: "Errore nel server AI" });
  }
}
