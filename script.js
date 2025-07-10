// script.js

// Funzione: Consiglio del Giorno
async function generaConsiglio() {
  const output = document.getElementById("consiglio-testo");
  output.innerText = "Generazione in corso...";

  try {
    const res = await fetch("/api/coach-ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "consiglio",
        prompt: "Genera una breve frase motivante per un venditore bofrost. Dammi una pillola giornaliera che possa attuare oggi stesso in vendita."
      })
    });

    if (!res.ok) throw new Error(`Errore HTTP: ${res.status}`);

    const data = await res.json();
    output.innerText = data.result || "Errore generazione consiglio.";
  } catch (error) {
    output.innerText = `Errore: ${error.message}`;
  }
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

  try {
    const res = await fetch("/api/coach-ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "analisi",
        prompt: messaggio
      })
    });

    if (!res.ok) throw new Error(`Errore HTTP: ${res.status}`);

    const data = await res.json();
    output.innerText = data.result || "Errore durante l'analisi.";
  } catch (error) {
    output.innerText = `Errore: ${error.message}`;
  }
});

// Avvia caricamento consiglio al caricamento pagina
document.addEventListener("DOMContentLoaded", () => {
  generaConsiglio();
});

// Lista cose da fare
document.getElementById("todo-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = document.getElementById("todo-nome").value.trim();
  const orario = document.getElementById("todo-orario").value;
  const prodotti = document.getElementById("todo-prodotti").value.trim();
  if (!nome || !orario) return;

  const li = document.createElement("li");
  li.innerHTML = `
    <span><strong>${orario}</strong> – ${nome}${prodotti ? ` (prodotti: ${prodotti})` : ""}</span>
    <input type="checkbox" />
  `;

  li.querySelector("input").addEventListener("change", function () {
    li.classList.toggle("completed", this.checked);
  });

  document.getElementById("todo-list").appendChild(li);
  e.target.reset();
});

