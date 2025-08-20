document.addEventListener("DOMContentLoaded", () => {
  // Navigazione tra sezioni
  document.querySelectorAll("nav button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-target");
      document.querySelectorAll("main section").forEach((sec) => {
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

  // Toggle menu filtri nella sezione combo
  const menuCheckbox = document.getElementById("menu-checkbox");
  const filtriMenu = document.getElementById("filtri-menu");
  const filtriBase = document.getElementById("filtri-base");

  menuCheckbox.addEventListener("change", () => {
    filtriMenu.style.display = menuCheckbox.checked ? "block" : "none";
    filtriBase.style.display = menuCheckbox.checked ? "none" : "block";
  });


  // Gestione filtro e richiesta combo AI
  document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn-combo").addEventListener("click", async () => {
    const isMenu = menuCheckbox.checked;

    const filtri = {
      menu: isMenu,
      primo: isMenu && document.getElementById("filtro-primo").checked,
      secondo: isMenu && document.getElementById("filtro-secondo").checked,
      contorno: isMenu && document.getElementById("filtro-contorno").checked,
      dolce: isMenu && document.getElementById("filtro-dolce").checked,
      sweetlife: document.getElementById("filtro-sweetlife").checked,
      senzaLattosio: document.getElementById("filtro-senza-lattosio").checked,
      senzaGlutine: document.getElementById("filtro-senza-glutine").checked,
      vegetariano: document.getElementById("filtro-vegetariano").checked,
      categoria: !isMenu ? document.getElementById("filtro-categoria").value : null,
      tipo: !isMenu ? document.getElementById("filtro-tipo").value : null,
      prezzo: !isMenu ? document.getElementById("filtro-prezzo").value : null
    };

    const prompt = generaPromptCombo(filtri);

    try {
      const risposta = await fetch("/api/coach-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "combo", prompt })  
      });

      const dati = await risposta.json();
      document.getElementById("risultato-combo").innerText = dati.risposta || "Nessuna risposta.";
    } catch (err) {
      document.getElementById("risultato-combo").innerText = "Errore: " + err.message;
    }
  });

  // Funzione per generare prompt AI in base ai filtri selezionati
  function generaPromptCombo(filtri) {
    const preferenze = [];
    if (filtri.sweetlife) preferenze.push("Sweetlife");
    if (filtri.senzaLattosio) preferenze.push("senza lattosio");
    if (filtri.senzaGlutine) preferenze.push("senza glutine");
    if (filtri.vegetariano) preferenze.push("vegetariano");

    if (filtri.menu) {
      const portate = [];
      if (filtri.primo) portate.push("primo piatto");
      if (filtri.secondo) portate.push("secondo piatto");
      if (filtri.contorno) portate.push("contorno");
      if (filtri.dolce) portate.push("dolce");

      return `Suggerisci una combo di prodotti Bofrost composta da: ${portate.join(", ")}.${preferenze.length > 0 ? " Considera anche se possibile le preferenze: " + preferenze.join(", ") + "." : ""}`;
    } else {
      return `Suggerisci una combo di prodotti Bofrost con categoria: ${filtri.categoria}, tipo: ${filtri.tipo}, prezzo: ${filtri.prezzo}.${preferenze.length > 0 ? " Considera anche se possibile le preferenze: " + preferenze.join(", ") + "." : ""}`;
    }
  }
}); 
                          

// 
//🔹 Funzione per analizzare il diario (analisi AI)
//
async function handleAnalisi(event) {
  event.preventDefault();
  const el = document.getElementById("analisi-output");
  el.innerText = "Analisi in corso...";

  const testo = document.getElementById("feedback-form")?.value || "";

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
