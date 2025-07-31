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

  let todos = JSON.parse(localStorage.getItem('todos')) || [];

  function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  function renderTodos() {
    // Ordina per orario crescente
    todos.sort((a, b) => a.orario.localeCompare(b.orario));

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
        saveTodos();
        renderTodos();
      });

      const editBtn = document.createElement('button');
      editBtn.textContent = '✏️';
      editBtn.style.marginLeft = '10px';
      editBtn.addEventListener('click', () => {
        document.getElementById('todo-nome').value = todo.nome;
        document.getElementById('todo-orario').value = todo.orario;
        document.getElementById('todo-prodotti').value = todo.prodotti;
        todos.splice(index, 1);
        saveTodos();
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
      saveTodos();
      renderTodos();
    }
  });

  resetBtn.addEventListener('click', () => {
    if (confirm('Vuoi davvero cancellare tutte le attività?')) {
      todos = [];
      saveTodos();
      renderTodos();
    }
  });

  renderTodos();
});

// Script per mostrare/nascondere i blocchi 
<script>
  const filtroMenu = document.getElementById('filtro-menu');
  const filtriMenu = document.getElementById('filtri-menu');
  const filtriBase = document.getElementById('filtri-base');

  filtroMenu.addEventListener('change', () => {
    const isChecked = filtroMenu.checked;
    filtriMenu.style.display = isChecked ? 'block' : 'none';
    filtriBase.style.display = isChecked ? 'none' : 'block';
  });
</script>

//========================================================================
//🔹 Funzione per suggerire combo da pranzo/cena analizzando i cataloghi
//========================================================================

async function suggerisciCombo() {
  const el = document.getElementById("combo-output");
  el.innerText = "Analisi combo in corso...";

  try {
    // 🔹 Leggi i filtri dal form
    const categoria = document.getElementById("filtro-categoria")?.value;
    const tipoProdotto = document.getElementById("filtro-tipo")?.value;
    const senzaLattosio = document.getElementById("filtro-lattosio")?.checked;
    const senzaGlutine = document.getElementById("filtro-glutine")?.checked;
    const sweetlife = document.getElementById("filtro-sweetlife")?.checked;
    const vegano = document.getElementById("filtro-vegano")?.checked;
    const prezzoMax = parseFloat(document.getElementById("filtro-prezzo")?.value);

    // 🔹 Carica il catalogo completo
    const response = await fetch("catalogo_completo_prova.json");
    const prodotti = await response.json();

    // 🔹 Filtra i prodotti in base ai filtri selezionati
    const prodottiFiltrati = prodotti.filter(p => {
      if (categoria && p.categoria !== categoria) return false;
      if (tipoProdotto && p.tipo !== tipoProdotto) return false;
      if (senzaLattosio && p.senza_lattosio !== true) return false;
      if (senzaGlutine && p.senza_glutine !== true) return false;
      if (sweetlife && p.sweetlife !== true) return false;
      if (vegano && p.vegano !== true) return false;
      if (!isNaN(prezzoMax)) {
        const prezzo = parseFloat(p.prezzo?.replace("€", "").replace(",", "."));
        if (isNaN(prezzo) || prezzo > prezzoMax) return false;
      }
      return true;
    });

    // 🔹 Costruisci il prompt AI
    const prompt = `
Suggerisci 2 combo adatte per un pasto (pranzo o cena) in base ai seguenti filtri:
Prodotti filtrati:
${JSON.stringify(prodottiFiltrati, null, 2)}
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

// 
//🔹 Funzione per analizzare il diario (analisi AI)
//
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
