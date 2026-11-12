# Entrega — Taller: Pre-Producción y CI/CD en Videojuegos

## Mensaje para el canal de Teams

```
Taller Pre-Producción y CI/CD — Axel Manotoa

Landing Page (GitHub Pages): https://2026b-sof-jueg-gr3.github.io/manotoa-axel-jueg-gr3/
Plataforma Indie (Itch.io): https://axel112004.itch.io/neon-breaker

CI/CD configurado con GitHub Actions + Butler:
Archivo YAML: .github/workflows/deploy-itchio.yml

Logline: LUMEN, el último fotón de una ciudad que olvidó su color, rompe los bloques del Apagón
para devolverle la luz — sin saber que cada bloque es un recuerdo suyo, y que el último que quede
en pie decidirá si la ciudad vuelve a brillar o vuelve a recordar.

La narrativa se juega: 3 Leyes de la Luz como Ecos de Memoria, Pulso de Resonancia, un Interludio
con giro, una cámara final con dos finales y un truco secreto que entrega el Sello del Último Fotón.

Clasificación: E (Everyone) — violencia mínima contra bloques inanimados.
Licencia: MIT · Assets procedimentales CC0 · Datos solo en localStorage, sin servidor ni analytics.
```

## Checklist

- [x] **Misión 1:** Logline + **Lore** (3 Leyes) + **Resonancia** (aprender = recordar) + **Identidad** (romper = borrar un nombre), todo implementado dentro del juego, no solo en la web. Ver `docs/PREPRODUCCION.md`.
- [x] **Misión 1 extra:** giro narrativo (Interludio), truco secreto, dos finales, Sello persistente y Código de Luz.
- [x] **Misión 2:** Clasificación creativa E + justificación de intensidad visual + Muro de Honor con licencias + **declaración de privacidad de datos locales**.
- [x] **Misión 3:** Landing page inmersiva en `index.html` (raíz del repo) con botón JUGAR que lleva a `juego/index.html`.
- [x] **Misión 3:** Desplegada en GitHub Pages desde `main` / `/(root)`.
- [ ] **Misión 4:** Crear cuenta en Itch.io y subir el juego (requiere tu acción manual o configurar los Secrets).
- [x] **Misión Legendaria:** Archivo `.github/workflows/deploy-itchio.yml` configurado.
- [ ] **Misión Legendaria:** Configurar los 3 Secrets en GitHub (`ITCHIO_API_KEY`, `ITCHIO_USERNAME`, `ITCHIO_GAME`).

## Lo que ya está hecho

1. **Landing page** (`index.html` en la raíz): terminal neón con estrellas animadas, scanlines,
   ladrillos que pulsan, logline, las cuatro piezas de la FASE 1, sección legal con muro de honor
   y declaración de privacidad, y botón JUGAR.
2. **Juego** (`juego/index.html`): Neón Breaker *El Último Fotón*, versión narrativa completa —
   6 escenas, 3 Leyes como Ecos de Memoria, Pulso de Resonancia, Interludio con giro, Núcleo con
   dos finales, truco secreto, Sello persistente y Código de Luz. La landing ya no promete nada que
   el juego no haga.
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
| **Short description or tagline** | `El último fotón de una ciudad que olvidó su color.` |
| **Classification** | `Games – A piece of software you can play` ✅ |
| **Kind of project** | `HTML – You have a ZIP or HTML file that will be played in the browser` ✅ |
| **Release status** | `Released – Project is complete, but might receive some updates` ✅ |
| **Pricing** | mejor **`No payments`** (evita la pantalla de donación; `$0 or donate` también sirve) |
| **Cover image** | `portada-itchio.png` (630 × 500, generada para este proyecto) |
| **Screenshots** | sube 3 de `docs/capturas/`: `01-menu.png`, `03-jugando.png`, `05-fin.png` |
| **Upload / files** | sube **`neon-breaker-itchio.zip`** (310 KB). Trae `index.html` en la raíz y Phaser incluido |
| **Embed options** | **Manually set size** → ancho `800` × alto `600` (la medida real del juego) |
| **Frame options** | ✅ `Fullscreen button` · ✅ `Mobile friendly` · ❌ el resto (scrollbars, auto-start, SharedArrayBuffer) |
| **Description** | pega el contenido de `docs/DESCRIPCION-ITCHIO.html` |
| **Genre** | `Arcade` |
| **Tags** | `breakout`, `arkanoid`, `phaser`, `neon`, `retro`, `combo`, `powerups`, `student-project` |
| **AI generation disclosure** | **Yes** (el código y los textos se escribieron con asistencia de un LLM; el arte y el sonido son procedurales) |
| **App store links / Custom noun** | dejar vacío |
| **Community** | `Comments` activado (para que los compañeros puedan comentar) |
| **Visibility & access** | **`Public`** — si solo te deja `Draft`, guarda y cámbialo a Public desde *Edit game* |

> **El usuario es `axel112004`**, no `axel-manotoa`. Ese mismo valor va en el Secret
> `ITCHIO_USERNAME` y en todos los enlaces. El slug del juego es `neon-breaker`.

> **Usa `neon-breaker-itchio.zip`, no `neon-breaker-web.zip`.** El primero arranca directo en el
> juego y lleva Phaser dentro (0 peticiones externas); el segundo empieza en la landing page, que
> hace scroll y se cortaría dentro del iframe de itch.io. La landing page ya cumple su función en
> GitHub Pages, así que en itch.io no hace falta repetirla.

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

> El `index.html` de la raíz del paquete **es el juego** (no la landing), y Phaser va dentro del
> ZIP. Verificado: 0 peticiones externas, 60 ladrillos, bola a 360, sin errores de consola.

> **Sobre los dos uploads:** Butler publica en el canal `web`, que es un *slot* distinto al archivo
> que subiste a mano desde el formulario (ese no tiene canal). Tras el primer push correcto
> aparecerán dos archivos en *Edit game*: deja el del canal `web` y borra el manual, para que solo
> quede el que se actualiza automáticamente. También puedes saltarte la subida manual y dejar que
> Butler cree el único upload.

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
