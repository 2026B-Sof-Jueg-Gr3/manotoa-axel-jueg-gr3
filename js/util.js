/* =========================================================
   util.js — Utilidades: récord, formato y sonido
   ========================================================= */

const FUENTE = '"Segoe UI", system-ui, -apple-system, sans-serif';

/** Separa los miles: 12500 -> "12.500" */
function formatearPuntos(n) {
  return n.toLocaleString('es-PE');
}

const CLAVE_RECORD = 'neonbreaker:record';

function leerRecord() {
  try {
    const v = Number(window.localStorage.getItem(CLAVE_RECORD));
    return Number.isFinite(v) && v > 0 ? v : 0;
  } catch (e) {
    return 0;
  }
}

/** Guarda el récord si se supera. Devuelve true cuando es nuevo récord. */
function guardarRecord(puntos) {
  try {
    if (puntos > leerRecord()) {
      window.localStorage.setItem(CLAVE_RECORD, String(puntos));
      return true;
    }
  } catch (e) { /* modo privado: se ignora */ }
  return false;
}

/* ---------------------------------------------------------
   Sonido — pitidos generados con WebAudio, sin archivos
   --------------------------------------------------------- */
const Sonido = {
  ctx: null,
  activo: true,

  /** Se llama en el primer gesto del usuario (política de autoplay) */
  iniciar() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    } catch (e) {
      this.ctx = null;
    }
  },

  tono(freq, dur = 0.08, tipo = 'square', vol = 0.05) {
    if (!this.activo || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gan = this.ctx.createGain();
      osc.type = tipo;
      osc.frequency.setValueAtTime(freq, t);
      gan.gain.setValueAtTime(vol, t);
      gan.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(gan).connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + dur + 0.02);
    } catch (e) { /* silencio */ }
  },

  arpegio(frecuencias, paso = 90) {
    if (!this.activo || !this.ctx) return;
    frecuencias.forEach((f, i) => {
      window.setTimeout(() => this.tono(f, 0.12, 'triangle', 0.05), i * paso);
    });
  }
};
