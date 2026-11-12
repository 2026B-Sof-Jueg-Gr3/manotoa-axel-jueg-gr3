# Entrega — Taller: Pre-Producción y CI/CD en Videojuegos

## Mensaje para el canal de Teams

```
Taller Pre-Producción y CI/CD — Axel Manotoa

Landing Page (GitHub Pages): https://2026b-sof-jueg-gr3.github.io/manotoa-axel-jueg-gr3/
Plataforma Indie (Itch.io): https://axel112004.itch.io/neon-breaker

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
   **Incluye guardia de Secrets:** si aún no están los 3 Secrets, el job termina en verde con un
   aviso y omite el despliegue, en vez de fallar y mandar correos de error en cada push.

## Lo que falta (requiere tu cuenta de Itch.io)

### Paso 1 — Crear el proyecto en Itch.io (`https://itch.io/game/new`)

Valores exactos para cada campo del formulario:

| Campo | Valor |
|---|---|
| **Title** | `Neon Breaker` |
| **Project URL** | `https://axel112004.itch.io/neon-breaker` (ya aparece así, déjalo) |
| **Short description or tagline** | `Una esfera cuántica debe devolverle el color a la ciudad neón.` |
| **Classification** | `Games – A piece of software you can play` ✅ |
| **Kind of project** | `HTML – You have a ZIP or HTML file that will be played in the browser` ✅ |
| **Release status** | `Released – Project is complete, but might receive some updates` ✅ |
| **Pricing** | mejor **`No payments`** (evita la pantalla de donación; `$0 or donate` también sirve) |
| **Cover image** | `portada-itchio.png` (630 × 500, generada para este proyecto) |
| **Screenshots** | sube 3 de `docs/capturas/`: `01-menu.png`, `03-jugando.png`, `05-fin.png` |
| **Upload / files** | sube `neon-breaker-web.zip` (19 KB); trae `index.html` en la raíz |

> **El usuario es `axel112004`**, no `axel-manotoa`. Ese mismo valor va en el Secret
> `ITCHIO_USERNAME` y en todos los enlaces. El slug del juego es `neon-breaker`.

Después de guardar, ve a **Edit game** y confirma que el ZIP quedó marcado como
*HTML5 / Playable in browser* (ver Paso 5).

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
| `ITCHIO_USERNAME` | `axel112004` (tu usuario de itch.io) |
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

### Paso 5 — Marcar el canal como HTML5 (solo la primera vez)

Esto **no lo hace el workflow**: itch.io no detecta juegos web por el nombre del canal, aunque se
llame `web`. Después del primer push correcto:

1. Entra a **Edit game** en itch.io.
2. En la sección de **Uploads**, edita el canal `web` y marca **"HTML5 / Playable in browser"**.
3. Cambia el tipo de la página de *Downloadable* a **HTML**.
4. **Save**. A partir de ahí el juego se juega en el navegador dentro de itch.io.

> Ojo: el `index.html` de la raíz del paquete es la landing page, y el botón JUGAR abre
> `juego/index.html`. Ambos van en el mismo ZIP, así que el embed funciona tal cual.

## Si algo falla

| Problema | Solución |
|---|---|
| El workflow falla en "Install Butler" con `Could not resolve host: broth.itch.ovh` | Eso es la acción rota; el workflow actual ya usa `broth.itch.zone`. Asegúrate de tener el último `deploy-itchio.yml`. |
| El workflow sale verde pero dice "Despliegue omitido" | Es lo esperado: faltan los 3 Secrets. Completa los pasos 1–3. |
| Butler dice "Please set BUTLER_API_KEY" | `ITCHIO_API_KEY` está vacío o mal copiado; regenera la key en itch.io. |
| Butler dice "game not found" | El slug `ITCHIO_GAME` no coincide con el de itch.io (revisa la URL) o el proyecto aún no existe. |
| En itch.io el juego se descarga en vez de jugarse | Falta el paso 5: marcar el canal `web` como HTML5. |
| La landing page da 404 | Pages sirve desde `main` / `/(root)`; el `index.html` debe estar en la raíz |
| El juego no carga desde la landing | Verifica que `juego/index.html` existe y los scripts tienen `../` como prefijo |
