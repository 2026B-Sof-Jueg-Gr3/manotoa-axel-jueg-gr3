# Análisis del material y decisiones de diseño

## 1. «Taller Práctico: Despliegue con Phaser 3» (10 diapositivas)

Es el **enunciado evaluable**. Reto individual: llevar un juego de Phaser 3 desde la idea hasta
producción con GitHub Pages.

| Aspecto | Lo que pide |
|---|---|
| Objetivo | Un juego de Phaser 3 publicado en GitHub Pages |
| Entregable | Enlace **público** |
| Destino | Canal de Teams de la asignatura |

### Los 8 pasos y su requisito crítico

| # | Paso | Requisito |
|---|---|---|
| 1 | Crear repositorio | Organización `2026B-Sof-Jueg-Gr3`, nombre estricto `manotoa-axel-jueg-gr3`, **Public**, con README |
| 2 | Clonar y preparar | `git clone` |
| 3 | `index.html` | Phaser importado por **CDN** (sin npm, sin build) |
| 4 | `game.js` | `Phaser.AUTO`, 800×600, arcade, `preload`/`create`/`update` |
| 5 | Live Server | Probar en local |
| 6 | Commit y push | `git add .` → `commit` → `push origin main` |
| 7 | GitHub Pages | Settings → Pages → *Deploy from a branch* → `main` → `/(root)` |
| 8 | Teams | Mensaje con formato fijo + comentar 2 proyectos |

**Lectura clave:** el paso 3 prohíbe el bundler. Todo tiene que ejecutarse tal cual desde la raíz del
repositorio, así que la arquitectura debe ser HTML + scripts planos.

---

## 2. «Conceptos de Diseño en Carrito» (12 diapositivas)

No es el juego a entregar: es **el modelo de cómo se diseña un juego pequeño y terminado**. Lo que se
aprovecha:

| Idea del documento | Cómo se aplica aquí |
|---|---|
| Protagonista, meta, acciones y respuesta | Paleta + bola (protagonista), limpiar el tablero (meta), mover/lanzar (acciones), rebotes y chispas (respuesta) |
| Ciclo de juego: mirar → decidir → mover → evaluar | Ver dónde viene la bola, decidir el ángulo, mover la paleta, evaluar si el rebote salió como querías |
| Arquitectura de escenas (Boot → Preloader → Menú → Juego → Meta) | Las mismas cinco, con la última renombrada `Fin` |
| Assets procedimentales en el Preloader | `crearTexturas()` genera todo con `Graphics` |
| Mundo vs. pantalla y cámara | Aquí el tablero **cabe entero** en 800×600, así que la cámara no sigue a nadie: se usa `shake` para dar impacto |
| HUD estático sobre el juego | Marcador, nivel y vidas en la franja superior, siempre visibles |
| Reglas simples y una sola métrica | Solo se pierde por dejar caer la bola; la métrica es el puntaje |
| Victoria sin combate | Limpiar los 3 niveles |
| «Fricción cero hacia la revancha» | Un clic y se vuelve a jugar, sin pasar por el menú |

---

## 3. «Presentación de Carrito» (9 diapositivas)

Documentación técnica del proyecto de referencia: **Phaser 4 + Vite + plantilla oficial**, con
`src/game/main.js` y una escena por archivo.

**Contradicción detectada:** el taller exige Phaser 3 por CDN y publicar en `/(root)`, mientras que un
proyecto Vite necesita compilarse y publicarse desde `dist/`. Son incompatibles.

**Decisión:** se conserva la *arquitectura* (una escena por archivo, `game.js` como configuración) pero
con Phaser 3.90 y scripts planos. La API de escenas, cámara y física arcade es prácticamente la misma
en Phaser 3 y 4, así que migrar después es mover archivos, no reescribir.

---

## 4. Elección del juego

El enunciado no pide *Carrito*: pide **un juego propio**. Criterios usados para elegir: que sea
**popular**, **fácil de programar** y que **luzca** al presentarlo.

| Candidato | Popularidad | Dificultad | Veredicto |
|---|---|---|---|
| Snake | Alta | Muy baja | Demasiado simple visualmente |
| Pong | Alta | Muy baja | Poco vistoso |
| Flappy Bird | Muy alta | Baja | Un solo botón: poco que mostrar |
| Tetris | Muy alta | Media-alta | Lógica de grilla larga |
| **Arkanoid / Breakout** | **Alta** | **Baja-media** | **Elegido** |

Breakout gana porque combina lo mejor de los dos extremos: se entiende sin explicación, se programa en
poco código y a la vez ejercita rebotes con ángulo, colisiones contra grupos, power-ups, niveles,
puntaje y estados de partida.

---

## 5. Decisiones de implementación

| Decisión | Motivo |
|---|---|
| 800 × 600 | Es la medida del ejemplo del taller y la ideal para un tablero vertical |
| Phaser 3.90 por CDN | Cumple el paso 3 y funciona en Pages sin compilar |
| 5 escenas en archivos separados | Arquitectura de la presentación, sin bundler |
| Assets procedurales | 0 descargas, 0 CORS, peso mínimo |
| Rebote con ángulo por punto de impacto | Es lo que hace que el juego se sienta «de verdad» |
| Física manual en la paleta (no `collider` puro) | Para que el rebote no dependa de la geometría sino de dónde golpea |
| Un `collider` para bolas ↔ ladrillos | La separación y el rebote los resuelve Arcade |
| `staticGroup` para ladrillos | Son estáticos: más barato y no se mueven al impactar |
| Power-ups con `overlap` | No deben rebotar: se recogen y desaparecen |
| Récord en `localStorage` | Persistencia sin backend |
| Sonido con WebAudio | Pitidos generados en el momento, sin archivos de audio |

### Detalles que hubo que resolver

1. **La bola se quedaba en trayectorias casi horizontales.** Se corrige empujando la velocidad
   vertical cuando `|vy| < 45`.
2. **La paleta podía desplazarse en vertical por la separación de colisiones.** Se ancla a su altura
   en cada `update()`.
3. **La bola podía escapar del tablero.** Además de los límites del mundo, hay una red de seguridad
   que descarta cualquier bola fuera del área.
4. **El `worldX` del puntero llegaba vacío y dejaba la paleta en `NaN`.** Se cambió por
   `cameras.main.getWorldPoint()`.
5. **El brillo de los textos se recortaba en un rectángulo.** Es una limitación del canvas de Phaser:
   se arregla con `setPadding()` en el texto.

---

## 6. Verificación realizada

El juego se ejecutó en Chromium (headless) y se comprobó:

| Comprobación | Resultado |
|---|---|
| Errores de consola / excepciones | Ninguno |
| Ladrillos del nivel 1 | 60 |
| Bola lanzada | Se mueve y rebota |
| Choque contra ladrillo | Se destruye, suma puntos y sube el combo |
| Ladrillo de 2 golpes | Se aclara al primero y desaparece al segundo |
| Power-up de paleta ancha | `scaleX` 1.45 y se consume |
| Pausa | Congela la física y muestra el cartel |
| Fin de partida | Pasa a `Fin` y guarda el récord |
| Paleta con el mouse | Sigue al puntero sin desbordar los bordes |
| 20 s de juego continuo | 0 bolas escapadas, paleta siempre a 548 |
