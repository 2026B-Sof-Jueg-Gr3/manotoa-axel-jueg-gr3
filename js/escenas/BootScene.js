/* =========================================================
   BootScene — arranque mínimo
   ========================================================= */
class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create() {
    this.cameras.main.setBackgroundColor('#05070d');
    this.scene.start('Preloader');
  }
}
