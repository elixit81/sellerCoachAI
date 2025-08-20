// catalogo.js
const fs = require("fs");
const path = require("path");

// Percorso al file JSON unificato
const catalogoPath = path.join(__dirname, "catalogo_completo_prova.json");

// Carica il catalogo
let catalogo = {};
try {
  const rawData = fs.readFileSync(catalogoPath, "utf-8");
  catalogo = JSON.parse(rawData);
} catch (err) {
  console.error("Errore caricamento catalogo.json:", err);
  catalogo = {};
}

module.exports = catalogo;
