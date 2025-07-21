document.addEventListener("DOMContentLoaded", () => {
  // Navigazione tra sezioni
  document.querySelectorAll("nav button").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-target");
      document.querySelectorAll("main section").forEach(sec => {
        sec.classList.toggle("active", sec.id === target);
      });
    });
  });

  // Pulsanti funzionali
  document.getElementById("btn-consiglio")?.addEventListener("click", generaConsiglio);
  document.getElementById("btn-combo")?.addEventListener("click", suggerisciCombo);
  document.getElementById("feedback-form")?.addEventListener("submit", handleAnalisi);
});

// 🔹 Funzione per generare una frase motivazionale + pillola di vendita
async function generaConsiglio() {
  const el = document.getElementById("consiglio-testo");
  el.innerText = "Generazione in corso...";

  try {
    const res = await fetch("/api/coach-ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "consiglio",
        prompt: "Dammi un consiglio motivazionale e una pillola utile per vendere oggi."
      })
    });

    const data = await res.json();
    el.innerText = data.result || "Nessuna risposta.";
  } catch (e) {
    el.innerText = "Errore: " + e.message;
  }
}
// =======================
// Sezione To Do Time
// =======================

document.addEventListener('DOMContentLoaded', () => {
  const todoForm = document.getElementById('todo-form');
  const todoList = document.getElementById('todo-list');
  const resetBtn = document.getElementById('reset-todo');

  let todos = [];

  function renderTodos() {
    todoList.innerHTML = '';
    todos.forEach((todo, index) => {
      const li = document.createElement('li');
      li.className = todo.completed ? 'completed' : '';

      const span = document.createElement('span');
      span.textContent = `${todo.orario} - ${todo.nome}${todo.prodotti ? ' [' + todo.prodotti + ']' : ''}`;

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = todo.completed;
      checkbox.addEventListener('change', () => {
        todo.completed = checkbox.checked;
        renderTodos();
      });

      const editBtn = document.createElement('button');
      editBtn.textContent = '✏️';
      editBtn.style.marginLeft = '10px';
      editBtn.addEventListener('click', () => {
        document.getElementById('todo-nome').value = todo.nome;
        document.getElementById('todo-orario').value = todo.orario;
        document.getElementById('todo-prodotti').value = todo.prodotti;
        todos.splice(index, 1); // rimuove temporaneamente per poi riaggiungere modificato
        renderTodos();
      });

      const actions = document.createElement('div');
      actions.appendChild(checkbox);
      actions.appendChild(editBtn);

      li.appendChild(span);
      li.appendChild(actions);
      li.style.display = 'flex';
      li.style.justifyContent = 'space-between';
      li.style.alignItems = 'center';

      todoList.appendChild(li);
    });
  }

  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('todo-nome').value.trim();
    const orario = document.getElementById('todo-orario').value;
    const prodotti = document.getElementById('todo-prodotti').value.trim();

    if (nome && orario) {
      todos.push({
        nome,
        orario,
        prodotti,
        completed: false,
      });

      todoForm.reset();
      renderTodos();
    }
  });

  resetBtn.addEventListener('click', () => {
    if (confirm('Vuoi davvero cancellare tutte le attività?')) {
      todos = [];
      renderTodos();
    }
  });

  renderTodos();
});

// 🔹 Funzione per suggerire combo da pranzo/cena analizzando i cataloghi
async function suggerisciCombo() {
  const el = document.getElementById("combo-output");
  el.innerText = "Analisi combo in corso...";

  try {
    const cataloghi = [
      "catalogo_pesce.json",
      "catalogo_carne.json",
      "catalogo_verdure.json",
      "catalogo_sughi.json",
      "catalogo_freschi.json",
      "catalogo_integratori.json",
      "catalogo_patate.json"
    ];

    const dataArr = await Promise.all(
      cataloghi.map(file =>
        fetch(file).then(res => res.ok ? res.json() : [])
      )
    );

    const prodotti = dataArr.flat();

    const prompt = `
Seleziona 3 combinazioni adatte per un pasto (pranzo o cena) equilibrato, gustoso e con prodotti surgelati.
Ogni combo deve contenere almeno:
- un alimento principale (carne o pesce)
- un contorno (verdure o patate)
- un completamento (fresco)
Ecco i prodotti disponibili:
${JSON.stringify(prodotti)}
`;

    const res = await fetch("/api/coach-ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "combo", prompt })
    });

    const data = await res.json();
    el.innerText = data.result || "Nessuna risposta.";
  } catch (e) {
    el.innerText = "Errore combo: " + e.message;
  }
}

// 🔹 Funzione per analizzare il diario (analisi AI)
async function handleAnalisi(event) {
  event.preventDefault();
  const el = document.getElementById("analisi-output");
  el.innerText = "Analisi in corso...";

  const testo = document.getElementById("feedback-text")?.value || "";

  const prompt = `
Ecco cosa ho fatto oggi in vendita:
${testo}
Dammi una breve analisi su:
- come potrei presentare meglio i prodotti
- come avrei potuto rispondere a eventuali obiezioni dei clienti
`;

  try {
    const res = await fetch("/api/coach-ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "analisi", prompt })
    });

    const data = await res.json();
    el.innerText = data.result || "Nessuna risposta.";
  } catch (e) {
    el.innerText = "Errore analisi: " + e.message;
  }
}
