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
}

// To do Time: Lista cose da fare
const todoForm = document.getElementById("todo-form");
const todoList = document.getElementById("todo-list");

document.addEventListener("DOMContentLoaded", () => {
  generaConsiglio();

  // Carica la lista salvata all'avvio
  const salvati = JSON.parse(localStorage.getItem("todoList")) || [];
  salvati.forEach(dato => {
    aggiungiItem(dato.nome, dato.orario, dato.prodotti, dato.completato);
  });
  ordinaLista();
});

if (todoForm) {
  todoForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const nome = document.getElementById("todo-nome").value.trim();
    const orario = document.getElementById("todo-orario").value;
    const prodotti = document.getElementById("todo-prodotti").value.trim();
    if (!nome || !orario) return;

    aggiungiItem(nome, orario, prodotti, false);
    salvaLista();
    todoForm.reset();
    ordinaLista();
  });
}

function aggiungiItem(nome, orario, prodotti, completato) {
  const li = document.createElement("li");
  li.innerHTML = `
    <span><strong>${orario}</strong> – ${nome}${prodotti ? ` (prodotti: ${prodotti})` : ""}</span>
    <input type="checkbox" ${completato ? "checked" : ""} />
  `;

  const checkbox = li.querySelector("input");
  checkbox.addEventListener("change", () => {
    li.classList.toggle("completed", checkbox.checked);
    salvaLista();
  });

  if (completato) li.classList.add("completed");

  todoList.appendChild(li);
}

function ordinaLista() {
  const items = Array.from(todoList.children);
  items.sort((a, b) => {
    const timeA = a.querySelector("strong").innerText;
    const timeB = b.querySelector("strong").innerText;
    return timeA.localeCompare(timeB);
  });
  todoList.innerHTML = "";
  items.forEach(item => todoList.appendChild(item));
}

function salvaLista() {
  const dati = Array.from(todoList.children).map(li => {
    const testo = li.querySelector("span").innerText;
    const match = testo.match(/^(\d{2}:\d{2})\s–\s(.+?)(?:\s\\(prodotti:\s(.+)\\))?$/);
    return {
      orario: match[1],
      nome: match[2],
      prodotti: match[3] || "",
      completato: li.querySelector("input").checked
    };
  });
  localStorage.setItem("todoList", JSON.stringify(dati));
}
