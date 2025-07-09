document.getElementById("genera-consiglio").addEventListener("click", async () => {
  const response = await fetch("/api/coach-ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: "Genera un breve consiglio pratico e motivante per un venditore porta a porta di surgelati.",
    }),
  });
  const data = await response.json();
  document.getElementById("consiglio-testo").innerText = data.output || "Errore generazione consiglio";
});

// Diario AI Feedback
const form = document.getElementById("feedback-form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const feedback = {
    cliente: document.getElementById("cliente").value,
    clima: document.getElementById("clima").value,
    obiettivo: document.getElementById("obiettivo").value,
    prodotti: document.getElementById("prodotti").value,
    obiezione: document.getElementById("obiezione").value,
    risposta: document.getElementById("mia-risposta").value,
    esito: document.getElementById("esito").value,
  };

  const messaggio = `Cliente: ${feedback.cliente}\nClima: ${feedback.clima}\nObiettivo: ${feedback.obiettivo}\nProdotti: ${feedback.prodotti}\nObiezione: ${feedback.obiezione}\nRisposta: ${feedback.risposta}\nEsito: ${feedback.esito}\n\nFornisci un'analisi di vendita con suggerimenti pratici.`;

  const response = await fetch("/api/coach-ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: messaggio })
  });

  const data = await response.json();
  document.getElementById("analisi-output").innerText = data.output || "Errore generazione analisi.";
});
