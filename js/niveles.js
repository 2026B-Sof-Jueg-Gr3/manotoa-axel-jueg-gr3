/* =========================================================
   niveles.js — Medidas del tablero y diseño de los 3 niveles
   ========================================================= */

const TABLERO = {
  ANCHO: 800,
  ALTO: 600,
  COLUMNAS: 10,
  ANCHO_LADRILLO: 64,
  ALTO_LADRILLO: 24,
  HUECO: 8,
  MARGEN_X: 44,       // (800 - (10*64 + 9*8)) / 2
  Y_INICIO: 104,
  PALETA_Y: 548,
  VEL_PALETA: 660,
  VIDAS: 3,
  VIDAS_MAX: 5
};

/* Cada nivel define:
   - filas:   cuántas filas de ladrillos
   - patron:  qué celdas se construyen (fila, columna) -> bool
   - dureza:  golpes que aguanta el ladrillo de esa fila
   - colores: un color neón por fila
   - velocidad: velocidad base de la bola
*/
const NIVELES = [
  {
    nombre: 'CLÁSICO',
    filas: 6,
    velocidad: 360,
    patron: () => true,
    dureza: () => 1,
    colores: [0xff4d6d, 0xffa62b, 0xffd93d, 0x4ade80, 0x38bdf8, 0xa78bfa]
  },
  {
    nombre: 'PIRÁMIDE',
    filas: 6,
    velocidad: 400,
    patron: (f, c, filas, columnas) => Math.abs(c - (columnas - 1) / 2) <= f + 0.5,
    dureza: (f) => (f === 0 ? 2 : 1),
    colores: [0xffd93d, 0xffa62b, 0xff4d6d, 0xa78bfa, 0x38bdf8, 0x4ade80]
  },
  {
    nombre: 'MURALLAS',
    filas: 7,
    velocidad: 440,
    patron: (f, c) => f === 0 || (f + c) % 2 === 0,
    dureza: (f) => (f <= 1 ? 2 : 1),
    colores: [0x38bdf8, 0xa78bfa, 0xff4d6d, 0xffa62b, 0xffd93d, 0x4ade80, 0x38bdf8]
  }
];
