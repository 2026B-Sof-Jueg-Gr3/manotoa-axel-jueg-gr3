# Entrega — Taller: Pre-Producción y CI/CD en Videojuegos

## Mensaje para el canal de Teams

```
Taller Pre-Producción y CI/CD — Axel Manotoa

Landing Page (GitHub Pages): https://2026b-sof-jueg-gr3.github.io/manotoa-axel-jueg-gr3/
Plataforma Indie (Itch.io): https://axel-manotoa.itch.io/neon-breaker

CI/CD configurado con GitHub Actions + Butler:
Archivo YAML: .github/workflows/deploy-itchio.yml

Logline: En un futuro donde la ciudad neón ha perdido su color, una esfera de energía cuántica
debe destruir todos los bloques de energía estancada para restaurar el brillo de la metrópolis.

Clasificación: E (Everyone) — violencia mínima contra bloques inanimados.
Licencia: MIT · Assets procedimentales CC0.
```

## Checklist

- [x] **Misión 1:** Logline creativo + resonancia ludonarrativa (en la landing page y en `docs/PREPRODUCCION.md`).
- [x] **Misión 2:** Clasificación creativa E + Muro de Honor con licencias (en la landing page).
- [x] **Misión 3:** Landing page inmersiva en `index.html` (raíz del repo) con botón JUGAR que lleva a `juego/index.html`.
- [x] **Misión 3:** Desplegada en GitHub Pages desde `main` / `/(root)`.
- [ ] **Misión 4:** Crear cuenta en Itch.io y subir el juego (requiere tu acción manual o configurar los Secrets).
- [x] **Misión Legendaria:** Archivo `.github/workflows/deploy-itchio.yml` configurado.
- [ ] **Misión Legendaria:** Configurar los 3 Secrets en GitHub (`ITCHIO_API_KEY`, `ITCHIO_USERNAME`, `ITCHIO_GAME`).

## Lo que ya está hecho

1. **Landing page** (`index.html` en la raíz): terminal neón con estrellas animadas, scanlines,
   ladrillos que pulsan, logline, características, sección legal, muro de honor y botón JUGAR.
2. **Juego** (`juego/index.html`): el mismo Neón Breaker de Phaser 3, ahora en subcarpeta.
3. **CI/CD** (`.github/workflows/deploy-itchio.yml`): workflow que empaqueta el juego, instala
   Butler desde `broth.itch.zone` y lo sube a Itch.io en cada push a main.
   Se evita la acción comunitaria rota `josephbmanley/butler-publish-itchio-action@v1.0.3`
   (usa el dominio muerto `broth.itch.ovh`).

## Lo que falta (requiere tu cuenta de Itch.io)

### Paso 1 — Crear cuenta y proyecto en Itch.io

1. Entra a https://itch.io/register y crea una cuenta gratuita.
2. Ve a https://itch.io/game/new y crea el proyecto:
   - **Title:** Neon Breaker
   - **Classification:** Game
   - **Kind of project:** HTML
   - **Upload:** sube un ZIP con `index.html`, `game.js` y `js/` (o espera al CI/CD)
   - **Embed options:** selecciona "Play in browser"
3. Guarda y publica.

### Paso 2 — Generar API Key

1. Ve a https://itch.io/user/settings/api-keys
2. Genera una nueva API key.
3. Cópiala (no la volverás a ver).

### Paso 3 — Configurar Secrets en GitHub

1. Entra a https://github.com/2026B-Sof-Jueg-Gr3/manotoa-axel-jueg-gr3/settings/secrets/actions
2. Crea tres secrets:

| Name | Value |
|---|---|
| `ITCHIO_API_KEY` | (la key del paso 2) |
| `ITCHIO_USERNAME` | `axel-manotoa` (tu usuario de itch.io) |
| `ITCHIO_GAME` | `neon-breaker` (el slug del juego) |

### Paso 4 — Probar el CI/CD

Haz un cambio cualquiera en el código, haz commit y push:

```bash
git add .
git commit -m "chore: probar CI/CD"
git push origin main
```

Ve a la pestaña **Actions** del repositorio en GitHub. Verás el workflow ejecutándose.
En ~2 minutos, el juego estará actualizado en Itch.io.

## Si algo falla

| Problema | Solución |
|---|---|
| El workflow falla en "Install Butler" con `Could not resolve host: broth.itch.ovh` | Eso es la acción rota; el workflow actual ya usa `broth.itch.zone`. Asegúrate de tener el último `deploy-itchio.yml`. |
| El workflow falla en "Push to Itch.io" | Los Secrets no están configurados o el proyecto en Itch.io no existe todavía. |
| Butler dice "game not found" | El slug `ITCHIO_GAME` no coincide con el de itch.io (revisa la URL) |
| La landing page da 404 | Pages sirve desde `main` / `/(root)`; el `index.html` debe estar en la raíz |
| El juego no carga desde la landing | Verifica que `juego/index.html` existe y los scripts tienen `../` como prefijo |
