# Entrega en Microsoft Teams

## Checklist antes de publicar

- [ ] El repositorio se llama `manotoa-axel-jueg-gr3` (minúsculas, con guiones).
- [ ] Está dentro de la organización `2026B-Sof-Jueg-Gr3` y es **Public**.
- [ ] `index.html` está en la **raíz** del repositorio (no dentro de una subcarpeta).
- [ ] Abre en local con Live Server sin errores en consola (`F12`).
- [ ] La paleta se mueve con **← →**, **A D** y con el **mouse**.
- [ ] La bola se lanza con **espacio** o clic.
- [ ] Se puede pausar con **P** y silenciar con **M**.
- [ ] Al perder las 3 vidas aparece **GAME OVER** y el puntaje.
- [ ] En *Settings → Pages* la rama es `main` (o `master`) y la carpeta `/(root)`.
- [ ] El enlace abre en una ventana de incógnito (sin caché).
- [ ] El repositorio es público y se ve el código.

## Comandos, de cero a publicado

```bash
# 1. clonar (cambia el nombre por el tuyo)
git clone https://github.com/2026B-Sof-Jueg-Gr3/manotoa-axel-jueg-gr3.git
cd manotoa-axel-jueg-gr3

# 2. copiar aquí index.html, game.js, js/ y docs/

# 3. probar: clic derecho en index.html -> Open with Live Server

# 4. publicar
git status
git add .
git commit -m "feat: setup inicial"
git push origin main
```

Después: **Settings → Pages → Deploy from a branch → main → /(root) → Save**.

## Mensaje para el canal de Teams

```
Mi Proyecto Phaser — Axel Manotoa
Link al juego: https://2026b-sof-jueg-gr3.github.io/manotoa-axel-jueg-gr3/
Link al código: https://github.com/2026B-Sof-Jueg-Gr3/manotoa-axel-jueg-gr3
```

Cambia el nombre del repositorio en las dos URLs por el tuyo. Y no olvides el paso final del
enunciado: **juega y comenta el proyecto de al menos dos compañeros**.

## Si el enlace da 404

| Causa probable | Solución |
|---|---|
| Pages todavía está compilando | Esperar 2–3 minutos y recargar |
| `index.html` no está en la raíz | Moverlo a la raíz del repositorio |
| Rama equivocada en Pages | Elegir `main` o `master`, la que exista |
| Repositorio privado en cuenta gratuita | Ponerlo en **Public** |
| Mayúsculas en las rutas | Pages sirve sobre Linux: `js/Nivel.js` ≠ `js/nivel.js` |

## Qué explicar si te piden defender el proyecto

1. **Escenas:** cinco, una responsabilidad cada una (Boot, Preloader, Menú, Juego, Fin).
2. **Física arcade:** la bola es un cuerpo dinámico con `bounce = 1`; los ladrillos son un
   `staticGroup`; la paleta es inmóvil y solo se mueve en horizontal.
3. **El rebote no es genérico:** en `golpePaleta()` el ángulo se calcula con la posición del impacto
   (`offset` entre −1 y 1) → el jugador puede dirigir la bola.
4. **Power-ups:** caen como cuerpos con velocidad vertical y se recogen con un `overlap`, no con un
   `collider` (no deben rebotar).
5. **Niveles:** cada uno es una función `patron(fila, columna)` en `js/niveles.js`; cambiar el nivel
   es cambiar una función.
6. **Sin assets:** las texturas se dibujan con `Graphics.generateTexture()` y un canvas con degradado
   radial; por eso el juego no descarga nada.
7. **Despliegue:** al no usar bundler, la rama `main` sirve directamente desde `/(root)`.
