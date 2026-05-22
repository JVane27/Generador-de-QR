import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
// En Vercel el sistema de archivos es de solo lectura, así que usamos /tmp
const isVercel = process.env.VERCEL === '1';
const DATA_DIR = isVercel ? '/tmp' : join(__dirname, '..', '..', 'data');
const DB_FILE = join(DATA_DIR, 'qr-history.json');

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!existsSync(DB_FILE)) {
    writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

function readDB() {
  ensureDataDir();
  try {
    const raw = readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeDB(data) {
  ensureDataDir();
  writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * Guarda un nuevo QR en el historial.
 * @param {string} texto - El texto o URL del QR.
 * @returns {object} El registro creado.
 */
export function guardarQR(texto) {
  const entries = readDB();
  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    texto,
    fecha: new Date().toISOString(),
  };
  entries.unshift(entry); // más reciente primero
  // Limitar a 50 entradas
  if (entries.length > 50) {
    entries.length = 50;
  }
  writeDB(entries);
  return entry;
}

/**
 * Obtiene todo el historial de QRs.
 * @returns {Array} Lista de registros.
 */
export function obtenerHistorial() {
  return readDB();
}

/**
 * Elimina un QR del historial por ID.
 * @param {string} id - ID del registro a eliminar.
 * @returns {boolean} true si se eliminó.
 */
export function eliminarQR(id) {
  const entries = readDB();
  const filtered = entries.filter(e => e.id !== id);
  if (filtered.length < entries.length) {
    writeDB(filtered);
    return true;
  }
  return false;
}

/**
 * Limpia todo el historial.
 */
export function limpiarHistorial() {
  writeDB([]);
}
