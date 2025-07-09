// script.js

// Funzione: Consiglio del Giorno
async function caricaConsiglio() {
  const output = document.getElementById("consiglio-testo");
  output.innerText = "Generazione in corso...";

  const res = await fetch("/api/coach-ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "consiglio",
      prompt: "Genera un consiglio pratico e motivante per un venditore porta a porta di surgelati."
    })
  });

  const data = await res.json();
  output.innerText = data.result || "Errore generazione consiglio.";
}

// Diario di Bordo & Coach AI
const form = document.getElementById("feedback-form");
form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const cliente = document.getElementById("cliente").value;
  const clima = document.getElementById("clima").value;
  const obiettivo = document.getElementById("obiettivo").value;
  const prodotti = document.getElementById("prodotti").value;
  const obiezione = document.getElementById("obiezione").value;
  const miaRisposta = document.getElementById("mia-risposta").value;
  const esito = document.getElementById("esito").value;

  const messaggio = `Cliente: ${cliente}\nClima: ${clima}\nObiettivo: ${obiettivo}\nProdotti: ${prodotti}\nObiezione: ${obiezione}\nRisposta: ${miaRisposta}\nEsito: ${esito}`;

  const output = document.getElementById("analisi-output");
  output.innerText = "Analisi in corso...";

  const res = await fetch("/api/coach-ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "analisi",
      prompt: messaggio
    })
  });

  const data = await res.json();
  output.innerText = data.result || "Errore durante l'analisi.";
});

// Avvia caricamento consiglio al caricamento pagina
document.addEventListener("DOMContentLoaded", () => {
  caricaConsiglio();
});


  const data = await response.json();
  const output = data.result || "Errore nell'analisi del Coach AI.";
  document.getElementById("analisi-output").innerText = output;
});
