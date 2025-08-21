// catalogo.js (versione ESM)
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// __dirname non esiste in ESM → lo ricreiamo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Esportazione in stile ESM
export default catalogo;
