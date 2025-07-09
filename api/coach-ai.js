export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Sei un coach di vendita esperto e motivante." },
          { role: "user", content: prompt },
        ],
      }),
    });

    const json = await openaiRes.json();
    const output = json.choices?.[0]?.message?.content;

    return res.status(200).json({ output });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Errore interno AI" });
  }
}
