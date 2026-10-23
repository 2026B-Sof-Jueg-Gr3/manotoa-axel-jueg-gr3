/* =========================================================
   game.js — Paso 4 del taller: configuración y arranque
   ========================================================= */

const CONFIG = {
  type: Phaser.AUTO,          // WebGL si el navegador lo permite, si no Canvas
  parent: 'juego',
  width: 800,                 // misma medida del ejemplo del taller
  height: 600,
  backgroundColor: '#05070d',
  pixelArt: false,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },      // la bola no cae: se mueve por velocidad
      debug: false            // ponlo en true para ver los cuerpos de física
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,   // se adapta a cualquier pantalla sin deformarse
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [BootScene, PreloaderScene, MenuScene, JuegoScene, FinScene]
};

const juego = new Phaser.Game(CONFIG);

// Acceso desde la consola del navegador para depurar:
//   juego.scene.getScene('Juego').puntos
window.juego = juego;
