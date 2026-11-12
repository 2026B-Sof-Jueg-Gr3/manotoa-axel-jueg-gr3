/* =========================================================
   historia.js — El Alma del Juego
   ---------------------------------------------------------
   FASE 1 del taller (Ingeniería del Propósito):
     · Logline    → premisa de impacto
     · Lore       → reglas del universo lúdico
     · Resonancia → la mecánica justifica el aprendizaje
     · Identidad  → historia y juego son el mismo acto

   Todo el texto vive aquí para que la narrativa sea auditable:
   cambiar una línea cambia lo que el juego dice, no solo lo
   que la landing promete.
   ========================================================= */

const HISTORIA = {
  titulo: 'NEÓN BREAKER',
  subtitulo: 'EL ÚLTIMO FOTÓN',
  protagonista: 'LUMEN',

  logline:
    'LUMEN, el último fotón de una ciudad que olvidó su color, rompe los bloques del Apagón ' +
    'para devolverle la luz — sin saber que cada bloque es un recuerdo suyo, y que el último ' +
    'que quede en pie decidirá si la ciudad vuelve a brillar o vuelve a recordar.',

  /* --- LORE: las tres reglas del universo lúdico -------------
     Se entregan una por sector como "Ecos de Memoria". La tercera
     es la que el juego te oculta y constituye el giro. */
  leyes: [
    {
      numero: 'I',
      nombre: 'TODA LUZ QUE GOLPEA, VUELVE',
      texto: 'El ángulo de salida es el ángulo de entrada. Golpea en el borde de la paleta para abrir la trayectoria.',
      corto: 'INCIDENCIA = REFLEXIÓN · el borde abre el ángulo'
    },
    {
      numero: 'II',
      nombre: 'ROMPER LIBERA COLOR, PERO BORRA EL RECUERDO',
      texto: 'Cada bloque roto devuelve un píxel de luz y se lleva el nombre de lo que iluminaba.',
      corto: 'CADA COLOR RECUPERADO COBRÓ UN NOMBRE'
    },
    {
      numero: 'III',
      nombre: 'LA ÚLTIMA LUZ NO SE ROMPE: SE REFLEJA',
      texto: 'Lo que sostiene a la ciudad no es un bloque que haya que destruir. Es la luz que decide volver.',
      corto: 'NO ROMPER TAMBIÉN ES UNA FORMA DE SALVAR'
    }
  ],

  /* --- SECTORES: nombre, lore y voz del Apagón ---------------- */
  sectores: [
    {
      nombre: 'CIRCUITOS DEL ALBA',
      lore: 'Aquí empezó todo. Las primeras luces aún saben su propio nombre.',
      burla: 'ROMPE. ES LO ÚNICO QUE SABES HACER.'
    },
    {
      nombre: 'TORRE DE FRECUENCIAS',
      lore: 'El Apagón aprendió a apilarse. Algunos recuerdos se resisten dos veces.',
      burla: 'SIGUE. CADA GOLPE TE PARECERÁ MENOS A TI.'
    },
    {
      nombre: 'ARCHIVO DEL APAGÓN',
      lore: 'El último muro guarda lo que LUMEN olvidó al encenderse.',
      burla: 'YA CASI NO QUEDA NADA QUE TE RECUERDE.'
    }
  ],

  /* --- RESONANCIA: aprender = recordar -----------------------
     No hay preguntas, ni exámenes, ni penalización. Descubrir
     una ley enciende memoria; la memoria enciende la ciudad. */
  ecos: [
    'ECO I · Toda luz que golpea, vuelve.',
    'ECO II · Romper libera color, pero borra el recuerdo.',
    'ECO III · La última luz no se rompe: se refleja.'
  ],

  consejos: {
    borde: 'INCIDENCIA = REFLEXIÓN · golpeaste en el borde',
    combo: 'LA INERCIA TAMBIÉN ES MEMORIA · combo x',
    doble: 'LO QUE RESISTE GUARDA MÁS · dos golpes',
    resonancia: 'RESONANCIA · curvaste la luz sin romperla'
  },

  /* --- INTERLUDIO: el giro ------------------------------------ */
  interludio: {
    titulo: 'LO QUE LOS BLOQUES GUARDABAN',
    lineas: [
      'Tres sectores. Ciento cuarenta bloques. Toda la ciudad vuelve a tener color.',
      'Pero LUMEN mira el brillo y no reconoce ni una sola calle.',
      'Los bloques no eran una prisión. Eran los recuerdos de la ciudad,',
      'cristalizados cuando el Apagón llegó.',
      'Cada golpe devolvió un color y borró el nombre que lo sostenía.',
      'Y el Apagón nunca fue un enemigo:',
      'era la sombra que LUMEN proyectó el día que olvidó cómo reflejar.'
    ],
    remate: 'QUEDA UN SOLO BLOQUE. EL ÚLTIMO FOTÓN.',
    pie: 'El juego te va a pedir que lo rompas. Quizá no deberías.'
  },

  /* --- CÁMARA FINAL ------------------------------------------- */
  nucleo: {
    nombre: 'EL NÚCLEO',
    orden: 'ROMPE EL ÚLTIMO FOTÓN',
    susurro: '«Toda luz que golpea, vuelve…»',
    pista: 'A VECES, NO ROMPER ES LA ÚNICA FORMA DE SALVAR',
    pistaSecreta: 'MANTÉN R  ·  O DEJA QUE LA LUZ CAIGA',
    glifo: '◈ R'
  },

  /* --- DOS FINALES -------------------------------------------- */
  finales: {
    hueco: {
      titulo: 'LA CIUDAD BRILLA',
      subtitulo: 'PERO NADIE RECUERDA POR QUÉ',
      color: '#ffd93d',
      cuerpo: [
        'Rompiste el último fotón. La ciudad entera se encendió.',
        'Está limpia, está completa, está vacía.',
        'Nadie sabe el nombre de ninguna calle.'
      ],
      nota: 'HABÍA OTRA FORMA. El Núcleo sigue esperando.',
      rango: 'PORTADOR DEL BRILLO',
      sello: false
    },
    verdadero: {
      titulo: 'EL COLOR SIEMPRE ESTUVO AHÍ',
      subtitulo: 'FINAL VERDADERO · SECRETO DESCUBIERTO',
      color: '#4ade80',
      cuerpo: [
        'LUMEN dejó de golpear y empezó a reflejar.',
        'La luz rebotó en el último fotón, volvió a los tres sectores',
        'y cada bloque recordó el nombre de lo que iluminaba.',
        'La ciudad no necesitaba que la salvaran.',
        'Necesitaba que alguien se acordara de ella.'
      ],
      nota: 'Lograste lo que el juego nunca te pidió.',
      rango: 'GUARDIÁN DEL ÚLTIMO FOTÓN',
      sello: true
    }
  }
};

/* --- Sello persistente: orgullo que sobrevive a la partida --- */
const SELLO_KEY = 'neonbreaker:sello';

function guardarSello(datos) {
  try {
    const anterior = leerSello();
    if (!anterior || datos.puntos > anterior.puntos) {
      localStorage.setItem(SELLO_KEY, JSON.stringify(datos));
    }
  } catch (e) { /* modo incógnito: se juega igual, solo no se guarda */ }
}

function leerSello() {
  try {
    const raw = localStorage.getItem(SELLO_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

/* Código de luz: una firma corta y compartible derivada de la partida */
function codigoDeLuz(stats) {
  const base = (stats.puntos * 7 + stats.ecos * 131 + stats.rotos * 3 + Math.floor(stats.tiempo) * 11) % 46656;
  return 'NB-' + base.toString(36).toUpperCase().padStart(3, '0') + '-' + (stats.ecos >= 3 ? 'III' : 'I');
}
