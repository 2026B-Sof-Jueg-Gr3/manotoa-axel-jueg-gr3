# Pre-Producción y CI/CD en Videojuegos — Análisis del Taller

**Autor:** Axel Manotoa · **Curso:** ISWD823 · **Fecha:** 2026-11-11

---

## Resumen del taller

El taller pide cuatro misiones (narrativa, legal, landing page, plataforma indie) y una misión
legendaria opcional (CI/CD con GitHub Actions). El objetivo es **darle identidad al juego que ya
tenemos** (Neón Breaker), justificar su concepto, montar una página web inmersiva y, para los más
atrevidos, automatizar el despliegue.

---

## Misión 1: El Alma del Juego (Narrativa y Propósito)

### Logline

> En un futuro donde la ciudad neón ha perdido su color, una esfera de energía cuántica debe
> destruir todos los bloques de energía estancada para restaurar el brillo de la metrópolis.
> Cada ladrillo roto libera color; cada combo, acelera la reconstrucción.

### Resonancia Ludonarrativa

La mecánica principal —romper bloques con una bola que rebota— **es** la narrativa. No hay
disociación entre lo que el jugador hace y lo que la historia dice que pasa:

- **Romper un ladrillo** = liberar un píxel de color estancado.
- **El combo** = la inercia de la reconstrucción: a más bloques seguidos sin tocar la paleta, más
  rápido se recupera el brillo (y más puntos, porque el multiplicador sube).
- **Perder una vida** = la esfera pierde energía y hay que reinitciar el sector.
- **Limpiar un nivel** = sector restaurado, la ciudad recupera un bloque de color completo.

El aprendizaje educativo que exige el proyecto (física arcade, colisiones, arquitectura de escenas
en Phaser 3) está embebido en la implementación: el código es legible, comentado en español y
diseñado para que un estudiante pueda leerlo y entenderlo.

---

## Misión 2: Las Reglas del Mundo Real (Legal y Ético)

### Clasificación Creativa

**Clasificación E (Everyone) — Apto para cualquier humano con pulso.**

El juego contiene "violencia mínima dirigida exclusivamente a bloques de energía inanimados" que se
desintegran en partículas de colores. No hay sangre, no hay personajes, no hay diálogo. Los bloques
no sienten dolor (lo dice su licencia de software).

Equivalente formal: **ESRB E** / **PEGI 3**.

### Muro de Honor

| Recurso | Origen | Licencia |
|---|---|---|
| Texturas (ladrillos, bola, paleta, power-ups) | Generadas con Phaser Graphics | CC0 |
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

- **Usuario:** `axel-manotoa`
- **Juego:** `neon-breaker`
- **Canal:** `web` (HTML5 jugable en navegador)
- **URL:** https://axel-manotoa.itch.io/neon-breaker

---

## Misión Legendaria: CI/CD con GitHub Actions

### Archivo: `.github/workflows/deploy-itchio.yml`

El workflow se activa en cada **push a `main`** y hace lo siguiente:

1. **Checkout** del repositorio con `actions/checkout@v4`.
2. **Verifica los Secrets.** Si faltan, el job acaba en verde con un `::warning::` y omite el
   despliegue: así un push no genera correos de error mientras se configura la cuenta.
3. **Empaqueta** el juego (`index.html`, `juego/`, `js/`, `game.js`, `docs/` → `dist/`) y valida
   que los tres archivos clave existen.
4. **Instala Butler** desde `broth.itch.zone` (v15.x) y ejecuta
   `butler push dist usuario/juego:web --userversion <sha>`, con `BUTLER_API_KEY` como variable
   de entorno. Los Secrets se pasan por `env`, no interpolados en el `run`.
5. **Recuerda** que el canal `web` debe marcarse a mano como *HTML5 / Playable in browser* en itch.io.

> **Por qué no se usa la acción del marketplace:** `josephbmanley/butler-publish-itchio-action@v1.0.3`
> construye un Docker que descarga Butler desde `broth.itch.ovh`, un dominio que ya no resuelve
> (`curl: (6) Could not resolve host`). Instalar Butler directamente evita esa dependencia rota.

### Secrets necesarios (configurar una sola vez en GitHub)

| Secret | Valor |
|---|---|
| `ITCHIO_API_KEY` | API key generada en itch.io/profile/api-keys |
| `ITCHIO_USERNAME` | `axel-manotoa` |
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
│   ├── util.js
│   ├── niveles.js
│   ├── texturas.js
│   └── escenas/
│       ├── BootScene.js
│       ├── PreloaderScene.js
│       ├── MenuScene.js
│       ├── JuegoScene.js
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
