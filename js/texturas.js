/* =========================================================
   texturas.js — Assets procedurales (nada que descargar)
   ---------------------------------------------------------
   Se dibujan con Graphics y se convierten en texturas con
   generateTexture(). El juego completo pesa unos pocos KB,
   no depende de internet y no hay problemas de CORS al
   publicar en GitHub Pages.
   ========================================================= */

function crearTexturas(scene) {
  const g = scene.make.graphics({ x: 0, y: 0, add: false });

  /* ---------- Bola (20 x 20) ---------- */
  g.fillStyle(0x38bdf8, 0.18);
  g.fillCircle(10, 10, 10);
  g.fillStyle(0x7dd3fc, 0.5);
  g.fillCircle(10, 10, 7);
  g.fillStyle(0xffffff, 1);
  g.fillCircle(10, 10, 4.5);
  g.generateTexture('bola', 20, 20);
  g.clear();

  /* ---------- Paleta (110 x 16) ---------- */
  g.fillStyle(0x38bdf8, 0.22);
  g.fillRoundedRect(0, 0, 110, 16, 8);
  g.fillStyle(0x38bdf8, 1);
  g.fillRoundedRect(3, 4, 104, 8, 4);
  g.fillStyle(0xe0f2fe, 1);
  g.fillRoundedRect(10, 5, 90, 2.5, 1);
  g.generateTexture('paleta', 110, 16);
  g.clear();

  /* ---------- Ladrillo (64 x 24) ----------
     La base es gris claro y no blanca: así el setTint() deja
     visible el brillo superior y la sombra inferior. */
  g.fillStyle(0xd9d9d9, 1);
  g.fillRoundedRect(0, 0, 64, 24, 5);
  g.fillStyle(0xffffff, 1);
  g.fillRoundedRect(4, 3, 56, 4, 2);
  g.fillStyle(0x8f8f8f, 1);
  g.fillRoundedRect(4, 18, 56, 3, 1.5);
  g.generateTexture('ladrillo', 64, 24);
  g.clear();

  /* ---------- Partícula suave (16 x 16) ---------- */
  g.fillStyle(0xffffff, 1);
  g.fillCircle(8, 8, 8);
  g.generateTexture('punto', 16, 16);
  g.clear();

  /* ---------- Fondo estrellado (128 x 128) ---------- */
  g.fillStyle(0x0a0e17, 1);
  g.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 26; i++) {
    const r = Phaser.Math.FloatBetween(0.6, 1.6);
    g.fillStyle(0x1e293b, Phaser.Math.FloatBetween(0.4, 0.9));
    g.fillCircle(Phaser.Math.Between(0, 127), Phaser.Math.Between(0, 127), r);
  }
  g.generateTexture('fondo', 128, 128);
  g.clear();

  /* ---------- Power-ups (26 x 26) ----------
     Base blanca tintable + icono oscuro: el icono se mantiene
     legible con cualquier color. */
  const basePower = () => {
    g.fillStyle(0xffffff, 1);
    g.fillRoundedRect(0, 0, 26, 26, 7);
    g.fillStyle(0x0a0e17, 1);
  };

  // Paleta ancha: una barra horizontal
  basePower();
  g.fillRoundedRect(5, 10, 16, 6, 3);
  g.generateTexture('pw_ancho', 26, 26);
  g.clear();

  // Multibola: tres puntos
  basePower();
  g.fillCircle(7, 14, 3);
  g.fillCircle(13, 9, 3);
  g.fillCircle(19, 14, 3);
  g.generateTexture('pw_multi', 26, 26);
  g.clear();

  // Vida extra: una cruz
  basePower();
  g.fillRect(11, 5, 4, 16);
  g.fillRect(5, 11, 16, 4);
  g.generateTexture('pw_vida', 26, 26);
  g.clear();

  /* ---------- Halo radial (256 x 256) ----------
     Graphics no hace degradados, así que este se dibuja en un canvas
     y se registra como textura. Sirve para el brillo de los títulos. */
  const halo = scene.textures.createCanvas('halo', 256, 256);
  if (halo) {
    const ctx = halo.getContext();
    const grd = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grd.addColorStop(0, 'rgba(56, 189, 248, 0.55)');
    grd.addColorStop(0.45, 'rgba(56, 189, 248, 0.16)');
    grd.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 256, 256);
    halo.refresh();
  }

  g.destroy();
}
