# Pre-Producción y CI/CD en Videojuegos — Análisis del Taller

**Autor:** Axel Manotoa · **Curso:** ISWD823 · **Fecha:** 2026-11-11

---

## Resumen del taller

El taller pide cuatro misiones (narrativa, legal, landing page, plataforma indie) y una misión
legendaria opcional (CI/CD con GitHub Actions). El objetivo es **darle identidad al juego que ya
tenemos** (Neón Breaker), justificar su concepto, montar una página web inmersiva y, para los más
atrevidos, automatizar el despliegue.

---

## Misión 1: El Alma del Juego (FASE 1 — Ingeniería del Propósito)

La diapositiva 3 del material exige cuatro cosas. Las cuatro están **dentro del juego**, no solo en
la landing page:

| Exigencia | Implementación real |
|---|---|
| **Logline** — premisa de impacto | `HISTORIA.logline` (`js/historia.js`). Se muestra en la landing y estructura el arco completo. |
| **Lore** — reglas del universo lúdico | 3 Leyes de la Luz, entregadas como **Ecos de Memoria** ocultos, uno por sector. |
| **Resonancia** — mecánica que justifica el aprendizaje | El rebote con ángulo *es* la lección de reflexión; aprender = recordar = encender la ciudad. |
| **Identidad** — fusión de historia lúdica | Romper un bloque borra un nombre. La historia y la mecánica son el mismo acto. |

### Logline

> **LUMEN**, el último fotón de una ciudad que olvidó su color, rompe los bloques del Apagón para
> devolverle la luz — sin saber que cada bloque es un recuerdo suyo, y que el último que quede en pie
> decidirá si la ciudad vuelve a brillar **o vuelve a recordar**.

### Lore: las tres Leyes de la Luz

| Ley | Enunciado | Dónde se aprende |
|---|---|---|
| I | Toda luz que golpea, vuelve | Eco del Sector 1 + aviso al golpear en el borde de la paleta |
| II | Romper libera color, pero borra el recuerdo | Eco del Sector 2 + el Interludio |
| III | La última luz no se rompe: se refleja | Eco del Sector 3 + la cámara final |

No aparecen en un manual: se **descubren jugando**, como objetos `◈` que la bola debe tocar. Cada
Eco suma MEMORIA, puntos y energía de resonancia. Encontrar los tres adelanta la pista del final.

### Resonancia: ¿por qué esta mecánica justifica el aprendizaje?

El proyecto exige un componente educativo, y el taller pregunta *«¿cómo hacemos que aprender sea
divertido y no un castigo?»*. La respuesta está en la física del juego:

- El **ángulo de salida depende del punto de impacto** en la paleta (`golpePaleta()`): eso es
  literalmente *incidencia = reflexión*. El jugador lo descubre probando, no leyendo una fórmula.
- El **Pulso de Resonancia** (`E` / clic derecho) curva la trayectoria sin romper nada: enseña
  vector y módulo de velocidad conservando la intuición.
- Los **consejos de física son diegéticos**: los susurra el mundo cuando haces algo notable, no un
  panel de "respuesta incorrecta". No hay exámenes, ni preguntas, ni penalización por no saber.
- **Aprender enciende la ciudad**: cada ley descubierta incrementa `MEMORIA`, ilumina gemas y
  recarga la resonancia. El conocimiento es un recurso del juego, no una obligación.

El código además es material de estudio: 6 escenas con una responsabilidad cada una, comentado
en español, sin bundler, legible de arriba a abajo.

### Identidad, giro y secreto

Durante tres sectores el juego te entrena para **no dejar caer la bola**. Tras limpiar el tercero
aparece el **Interludio**, una escena propia que revela que los bloques eran los recuerdos de la
ciudad y que el Apagón era la sombra del propio LUMEN.

Después llega **EL NÚCLEO**: un único bloque dorado y una orden engañosa,
*«ROMPE EL ÚLTIMO FOTÓN»*. Hay dos salidas:

- **Romperlo** → final hueco: la ciudad brilla, pero nadie recuerda por qué. No pierdes el esfuerzo:
  puedes volver al Núcleo con `R` conservando puntos y estadísticas.
- **No romperlo** → final verdadero. Dos formas de lograrlo: **dejar caer la bola** (lo que todo el
  juego te castigó por hacer se convierte en la solución) o **mantener `R`** (el truco secreto que
  insinúa el glifo `◈ R`). Si escuchaste las tres leyes, la pista aparece de inmediato; si no, el
  juego te la susurra a los 11 segundos.

### El orgullo de terminar

El final verdadero recompone la ciudad como constelación, entrega el **Sello del Último Fotón**,
el rango **Guardián del Último Fotón**, un panel con 5 estadísticas y un **Código de Luz**
compartible derivado de la partida. El sello se guarda en `localStorage` y el menú lo muestra en
las siguientes sesiones: el esfuerzo deja huella.

---

## Misión 2: Las Reglas del Mundo Real (FASE 2 — Estructura de Cumplimiento)

| Exigencia del material | Respuesta del proyecto |
|---|---|
| **Clasificación de audiencia (ESRB)** | E / PEGI 3 |
| **Justificación: intensidad visual** | Destellos, partículas y *shake* de cámara de 60–320 ms; estímulos abstractos, sin daño a seres |
| **Tono** | Adaptación creativa: «violencia mínima contra bloques inanimados que no sienten dolor (lo dice su licencia de software)» |
| **Auditoría de licencias libres** | Muro de Honor en la landing |
| **Atribución de arte externo** | No hay arte externo: todo es procedural CC0; se acredita Phaser (MIT) y la fuente del SO |
| **Privacidad: manejo de datos locales** | Ver apartado siguiente |

### Clasificación Creativa

**Clasificación E (Everyone) — Apto para cualquier humano con pulso.**

El juego contiene "violencia mínima dirigida exclusivamente a bloques de energía inanimados" que se
desintegran en partículas de colores. No hay sangre, no hay personajes, no hay diálogo. Los bloques
no sienten dolor (lo dice su licencia de software).

Equivalente formal: **ESRB E** / **PEGI 3**.

### Privacidad · Manejo de datos locales

No hay servidor, cuentas, analytics ni cookies de terceros. Todo se guarda en el `localStorage` del
propio navegador: récord (`neonbreaker:record`) y sello (`neonbreaker:sello`). En modo incógnito
el juego funciona igual; simplemente no persiste. Ningún dato sale del equipo del jugador.

### Muro de Honor

| Recurso | Origen | Licencia |
|---|---|---|
| Texturas (ladrillos, bola, paleta, power-ups, Eco, Fotón) | Phaser Graphics | CC0 |
| Fondo estrellado y halo radial | Canvas API + tileSprite | CC0 |
| Efectos de sonido | Web Audio API (osciladores) | CC0 |
| Motor de juego (Phaser 3.90) | photonstorm.github.io | MIT |
| Fuente del sistema | Segoe UI / system-ui | Uso legítimo del SO |

Todo el código del proyecto está bajo licencia **MIT**.

---

## Misión 3: El Escaparate Digital (Landing Page)

Se creó un `index.html` en la raíz del repositorio que funciona como **menú de inicio** antes del
juego. No es un trámite: es una terminal neón con:

- Campo de estrellas animado con CSS
- Scanlines sutiles tipo monitor CRT
- Fila de ladrillos que pulsan con glow
- Título con text-shadow neón
- Logline en cuerpo central
- Sección de características principales
- Sección legal (clasificación + muro de honor)
- Botón gigante **JUGAR** que lleva a `juego/index.html` (el canvas de Phaser)
- Footer con enlaces a GitHub, Pages e Itch.io

El juego de Phaser se movió a `juego/index.html` (subcarpeta) para que la landing page sea la raíz
y el juego sea el destino del botón.

---

## Misión 4: Eligiendo su Hogar Indie

### Plataforma elegida: Itch.io

**¿Por qué?**

1. **HTML5 nativo:** Itch.io soporta juegos web jugables directamente en el navegador, sin
   descarga. Perfecto para un proyecto Phaser 3 sin build.
2. **Gratuita:** Crear cuenta y subir juegos es gratis (Itch.io toma un porcentaje opcional solo si
   vendes).
3. **Comunidad indie activa:** Es la plataforma de referencia para game jams y proyectos
   estudiantiles.
4. **CI/CD oficial:** Butler (la CLI de Itch.io) se puede ejecutar directamente en GitHub Actions.
   Se usa `broth.itch.zone` para descargar Butler (la acción comunitaria
   `josephbmanley/butler-publish-itchio-action` está rota porque apunta al dominio antiguo
   `broth.itch.ovh`).

### Configuración

- **Usuario:** `axel112004`
- **Juego:** `neon-breaker`
- **Canal:** `web` (HTML5 jugable en navegador)
- **URL:** https://axel112004.itch.io/neon-breaker

---

## Misión Legendaria: CI/CD con GitHub Actions

### Archivo: `.github/workflows/deploy-itchio.yml`

El workflow se activa en cada **push a `main`** y hace lo siguiente:

1. **Checkout** del repositorio con `actions/checkout@v4`.
2. **Verifica los Secrets.** Si faltan, el job acaba en verde con un `::warning::` y omite el
   despliegue: así un push no genera correos de error mientras se configura la cuenta.
3. **Empaqueta para el embed.** El `index.html` de `dist/` es el **juego** (copiado de
   `juego/index.html`, con las rutas `../` reescritas), no la landing page: la landing hace scroll
   y se cortaría dentro del iframe de itch.io. Además se descarga `phaser.min.js` al paquete,
   así el juego funciona **sin peticiones externas** dentro del iframe.
4. **Instala Butler** desde `broth.itch.zone` (v15.x) y ejecuta
   `butler push dist usuario/juego:web --userversion <sha>`, con `BUTLER_API_KEY` como variable
   de entorno. Los Secrets se pasan por `env`, no interpolados en el `run`.
5. **Recuerda** que el canal `web` debe marcarse a mano como *HTML5 / Playable in browser* en itch.io,
   y que el embed debe configurarse a **800 × 600**, la medida real del lienzo de Phaser.

> **Por qué no se usa la acción del marketplace:** `josephbmanley/butler-publish-itchio-action@v1.0.3`
> construye un Docker que descarga Butler desde `broth.itch.ovh`, un dominio que ya no resuelve
> (`curl: (6) Could not resolve host`). Instalar Butler directamente evita esa dependencia rota.

### Secrets necesarios (configurar una sola vez en GitHub)

| Secret | Valor |
|---|---|
| `ITCHIO_API_KEY` | API key generada en itch.io/profile/api-keys |
| `ITCHIO_USERNAME` | `axel112004` |
| `ITCHIO_GAME` | `neon-breaker` |

### Cómo funciona en la práctica

1. Corriges un bug en el código.
2. `git push origin main`
3. GitHub Actions se activa automáticamente.
4. En ~2 minutos, el juego actualizado está publicado en Itch.io.
5. Magia negra de software.

---

## Estructura del proyecto (actualizada)

```
manotoa-axel-jueg-gr3/
├── index.html              # Landing page inmersiva (Misión 3)
├── juego/
│   └── index.html          # Canvas de Phaser (el juego)
├── game.js                 # Configuración del juego
├── js/
│   ├── util.js                # Récord, formato de tiempo, sonido WebAudio
│   ├── historia.js            # Logline, Lore, Leyes, giros, finales y Sello
│   ├── niveles.js
│   ├── texturas.js
│   └── escenas/
│       ├── BootScene.js
│       ├── PreloaderScene.js
│       ├── MenuScene.js
│       ├── JuegoScene.js      # Ecos, Resonancia, sectores y EL NÚCLEO
│       ├── InterludioScene.js # El giro narrativo
│       └── FinScene.js
├── .github/
│   └── workflows/
│       └── deploy-itchio.yml   # CI/CD (Misión Legendaria)
├── docs/
│   ├── ANALISIS.md
│   ├── ENTREGA.md
│   ├── ENTREGA-TALLER2.md      # Mensaje de Teams para este taller
│   ├── PREPRODUCCION.md        # Este archivo
│   └── capturas/
└── README.md
```
