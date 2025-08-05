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

  // Toggle menu filtri nella sezione combo
  const menuCheckbox = document.getElementById("menu-checkbox");
  const filtriMenu = document.getElementById("filtri-menu");
  const filtriBase = document.getElementById("filtri-base");

  menuCheckbox.addEventListener("change", () => {
    if (menuCheckbox.checked) {
      filtriMenu.style.display = "block";
      filtriBase.style.display = "none";
    } else {
      filtriMenu.style.display = "none";
      filtriBase.style.display = "block";
    }
  });

  // Gestione filtro e richiesta combo AI
  document.getElementById("btn-combo").addEventListener("click", async () => {
    const isMenu = document.getElementById("menu-checkbox").checked;

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

    const risposta = await fetch("/api/coach-ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domanda: prompt })
    });

    const dati = await risposta.json();
    document.getElementById("risultato-combo").innerText = dati.risposta;
  });

  // Funzione per generare prompt AI in base ai filtri selezionati
  function generaPromptCombo(filtri) {
    if (filtri.menu) {
      const portate = [];
      if (filtri.primo) portate.push("primo piatto");
      if (filtri.secondo) portate.push("secondo piatto");
      if (filtri.contorno) portate.push("contorno");
      if (filtri.dolce) portate.push("dolce");

      return `Suggerisci una combo di prodotti Bofrost composta da: ${portate.join(", ")}. Considera anche se possibile le preferenze: ${filtri.sweetlife ? "Sweetlife, " : ""}${filtri.senzaLattosio ? "senza lattosio, " : ""}${filtri.senzaGlutine ? "senza glutine, " : ""}${filtri.vegetariano ? "vegetariano, " : ""}`;
    } else {
      return `Suggerisci una combo di prodotti Bofrost con categoria: ${filtri.categoria}, tipo: ${filtri.tipo}, prezzo: ${filtri.prezzo}. Considera anche se possibile le preferenze: ${filtri.sweetlife ? "Sweetlife, " : ""}${filtri.senzaLattosio ? "senza lattosio, " : ""}${filtri.senzaGlutine ? "senza glutine, " : ""}${filtri.vegetariano ? "vegetariano, " : ""}`;
    }
  }
});
  if (categoria) {
    risultati = risultati.filter(item => item.categoria.toLowerCase() === categoria.toLowerCase());
  }

  if (tipoProdotto) {
    risultati = risultati.filter(item =>
      item.tipo_prodotto &&
      item.tipo_prodotto.toLowerCase() === tipoProdotto.toLowerCase()
    );
  }

  if (senzaLattosio !== undefined) {
    const val = senzaLattosio === 'true';
    risultati = risultati.filter(item => item.senza_lattosio === val);
  }

  if (senzaGlutine !== undefined) {
    const val = senzaGlutine === 'true';
    risultati = risultati.filter(item => item.senza_glutine === val);
  }

  if (sweetlife !== undefined) {
    const val = sweetlife === 'true';
    risultati = risultati.filter(item => item.sweetlife === val);
  }

  if (vegano !== undefined) {
    const val = vegano === 'true';
    risultati = risultati.filter(item => item.vegano === val);
  }

  if (minPrezzo) {
    const minP = parseFloat(minPrezzo);
    risultati = risultati.filter(item => prezzoToNumber(item.prezzo) >= minP);
  }
  if (maxPrezzo) {
    const maxP = parseFloat(maxPrezzo);
    risultati = risultati.filter(item => prezzoToNumber(item.prezzo) <= maxP);
  }

  const p = parseInt(page, 10) || 1;
  const ps = parseInt(pageSize, 10) || 10;
  const start = (p - 1) * ps;
  const end = start + ps;

  const paginati = risultati.slice(start, end);

  res.status(200).json({
    totalItems: risultati.length,
    page: p,
    pageSize: ps,
    totalPages: Math.ceil(risultati.length / ps),
    items: paginati
  });
}
