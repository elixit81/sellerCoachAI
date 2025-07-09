// Consiglio del Giorno con AI
async function generaConsiglio() {
  const response = await fetch("/api/coach-ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Sei un coach di vendita esperto." },
        { role: "user", content: "Genera un breve consiglio pratico e motivante per un venditore porta a porta di surgelati. Deve essere utile e nuovo ogni giorno." }
      ]
    })
  });

  const data = await response.json();
  const output = data.result || "Errore nel caricamento del consiglio.";
  document.getElementById("consiglio-testo").innerText = output;
}

// Diario di Bordo - Analisi Coach AI
const form = document.getElementById("feedback-form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const cliente = document.getElementById("cliente").value;
  const clima = document.getElementById("clima").value;
  const obiettivo = document.getElementById("obiettivo").value;
  const prodotti = document.getElementById("prodotti").value;
  const obiezione = document.getElementById("obiezione").value;
  const miaRisposta = document.getElementById("mia-risposta").value;
  const esito = document.getElementById("esito").value;

  const messaggioAI = `Cliente: ${cliente}\nClima iniziale: ${clima}\nObiettivo: ${obiettivo}\nProdotti proposti: ${prodotti}\nObiezione: ${obiezione}\nRisposta data: ${miaRisposta}\nEsito: ${esito}\n\nFornisci un'analisi costruttiva del comportamento dell'utente come coach di vendita esperto.`;

  const response = await fetch("/api/coach-ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Sei un coach esperto che analizza le interazioni di vendita e fornisce feedback formativo." },
        { role: "user", content: messaggioAI }
      ]
    })
  });

  const data = await response.json();
  const output = data.result || "Errore nell'analisi del Coach AI.";
  document.getElementById("analisi-output").innerText = output;
});
