// ——— GESTIONE TABS ———
document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll("nav button");
  const sections = document.querySelectorAll("main section");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-target");
      sections.forEach(sec => {
        sec.classList.toggle("active", sec.id === target);
      });
    });
  });

  const salvati = JSON.parse(localStorage.getItem("todoList")) || [];
  salvati.forEach(dato => {
    aggiungiItem(dato.nome, dato.orario, dato.prodotti, dato.completato);
  });
  ordinaLista();

  const bottoneConsiglio = document.getElementById("genera-consiglio");
  if (bottoneConsiglio) {
    bottoneConsiglio.addEventListener("click", generaConsiglio);
  }

  const comboButton = document.getElementById("btn-combo");
  if (comboButton) {
    comboButton.addEventListener("click", suggerisciCombo);
  }
});

// ——— CONSIGLIO DEL GIORNO ———
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

// ——— DIARIO DI BORDO ———
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
      body: JSON.stringify({ type: "analisi", prompt: messaggio })
    });
    if (!res.ok) throw new Error(`Errore HTTP: ${res.status}`);
    const data = await res.json();
    output.innerText = data.result || "Errore durante l'analisi.";
  } catch (error) {
    output.innerText = `Errore: ${error.message}`;
  }
});

// ——— TO DO TIME ———
const todoForm = document.getElementById("todo-form");
const todoList = document.getElementById("todo-list");
const resetButton = document.getElementById("reset-todo");

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

if (resetButton) {
  resetButton.addEventListener("click", () => {
    localStorage.removeItem("todoList");
    todoList.innerHTML = "";
  });
}

function aggiungiItem(nome, orario, prodotti, completato) {
  const li = document.createElement("li");
  li.innerHTML = `<span><strong>${orario}</strong> – ${nome}${prodotti ? ` (prodotti: ${prodotti})` : ""}</span><input type="checkbox" ${completato ? "checked" : ""} />`;
  const checkbox = li.querySelector("input");
  checkbox.addEventListener("change", () => {
    li.classList.toggle("completed", checkbox.checked);
    salvaLista();
    ordinaLista();
  });
  if (completato) li.classList.add("completed");
  todoList.appendChild(li);
}

function ordinaLista() {
  const items = Array.from(todoList.children);
  const incompleti = items.filter(li => !li.querySelector("input").checked);
  const completi = items.filter(li => li.querySelector("input").checked);
  incompleti.sort((a, b) => {
    const timeA = a.querySelector("strong").innerText;
    const timeB = b.querySelector("strong").innerText;
    return timeA.localeCompare(timeB);
  });
  todoList.innerHTML = "";
  [...incompleti, ...completi].forEach(item => todoList.appendChild(item));
}

function salvaLista() {
  const dati = Array.from(todoList.children).map(li => {
    const testo = li.querySelector("span").innerText;
    const match = testo.match(/^(\d{2}:\d{2})\s–\s(.+?)(?: \(prodotti: (.+)\))?$/);
    return {
      orario: match ? match[1] : "",
      nome: match ? match[2] : testo,
      prodotti: match && match[3] ? match[3] : "",
      completato: li.querySelector("input").checked
    };
  });
  localStorage.setItem("todoList", JSON.stringify(dati));
}

// ——— COMBO ———
async function suggerisciCombo() {
  const outputDiv = document.getElementById("combo-output");
  outputDiv.innerHTML = "Analisi in corso...";
  try {
    const fileNames = [
      "catalogo_pesce.json",
      "catalogo_carne.json",
      "catalogo_verdure.json",
      "catalogo_sughi.json",
      "catalogo_freschi.json",
      "catalogo_integratori.json",
      "catalogo_patate.json"
    ];

    const fileData = await Promise.all(
      fileNames.map(name =>
        fetch(name).then(res => res.json()).catch(() => [])
      )
    );

    const prodotti = fileData.flat();
    const prompt = `Hai a disposizione questi prodotti del catalogo divisi per categoria. Suggerisci 3 combinazioni interessanti per un pranzo o una cena, includendo eventualmente un primo, un secondo o un contorno. Rendi gli abbinamenti adatti a persone comuni, in modo equilibrato e con buona varietà.\n\nProdotti:\n${JSON.stringify(prodotti, null, 2)}`;

    const response = await fetch("/api/coach-ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();
    outputDiv.innerHTML = `<pre>${data.result || "Nessuna risposta ricevuta."}</pre>`;
  } catch (error) {
    console.error("Errore nella generazione delle combo:", error);
    outputDiv.innerHTML = "Errore nella generazione delle combinazioni.";
  }
}
