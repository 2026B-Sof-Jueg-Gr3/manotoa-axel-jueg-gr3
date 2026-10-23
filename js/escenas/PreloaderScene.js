/* =========================================================
   PreloaderScene — barra de avance + generación de texturas
   ========================================================= */
class PreloaderScene extends Phaser.Scene {
  constructor() {
    super('Preloader');
  }

  preload() {
    // Si algún día usas archivos reales, van aquí:
    // this.load.audio('golpe', 'assets/golpe.mp3');
  }

  create() {
    const { width, height } = this.scale;

    this.add.text(width / 2, height / 2 - 60, 'NEÓN BREAKER', {
      fontFamily: FUENTE, fontSize: '40px', color: '#f8fafc'
    }).setOrigin(0.5).setFontStyle('bold');

    this.add.text(width / 2, height / 2 - 18, 'CARGANDO RECURSOS', {
      fontFamily: FUENTE, fontSize: '12px', color: '#475569'
    }).setOrigin(0.5);

    this.add.rectangle(width / 2, height / 2 + 30, 360, 6, 0x1e293b).setOrigin(0.5);
    const relleno = this.add.rectangle(width / 2 - 180, height / 2 + 30, 360, 6, 0x38bdf8)
      .setOrigin(0, 0.5);

    // Todo es procedural: se genera al instante
    crearTexturas(this);

    const estado = { p: 0 };
    this.tweens.add({
      targets: estado,
      p: 1,
      duration: 650,
      ease: 'Sine.easeInOut',
      onUpdate: () => relleno.setScale(estado.p, 1),
      onComplete: () => this.scene.start('Menu')
    });
  }
}
