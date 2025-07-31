import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const {
    categoria,
    tipoProdotto,
    senzaLattosio,
    senzaGlutine,
    sweetlife,
    vegano,
    minPrezzo,
    maxPrezzo,
    page = '1',
    pageSize = '10'
  } = req.query;

  const filePath = path.join(process.cwd(), 'data', 'catalogo_completo.json');

  let catalogo;
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    catalogo = JSON.parse(fileContents);
  } catch (error) {
    res.status(500).json({ error: 'Errore nel caricamento del catalogo' });
    return;
  }

  function prezzoToNumber(prezzoStr) {
    if (!prezzoStr) return NaN;
    const numero = prezzoStr.replace('€', '').replace(',', '.').trim();
    return parseFloat(numero);
  }

  let risultati = catalogo;

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
