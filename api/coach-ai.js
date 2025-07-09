// File: /api/coach-ai.js

export default async function handler(req, res) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Chiave API non trovata" });
  }

  const { model, messages } = req.body;

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model || "gpt-3.5-turbo",
        messages,
      }),
    });

    const data = await openaiRes.json();

    return res.status(200).json({ result: data.choices[0].message.content });
  } catch (err) {
    return res.status(500).json({ error: "Errore nella richiesta AI" });
  }
}
