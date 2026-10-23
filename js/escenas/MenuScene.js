/* =========================================================
   MenuScene — pantalla de título
   ========================================================= */
class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#05070d');

    this.add.tileSprite(0, 0, width, height, 'fondo').setOrigin(0, 0);

    // Halo detrás del título
    const halo = this.add.image(width / 2, 205, 'halo').setScale(2.6).setAlpha(0.75);
    this.tweens.add({ targets: halo, alpha: 1, scale: 2.9, duration: 2600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    // Hilera de ladrillos decorativa
    const colores = [0xff4d6d, 0xffa62b, 0xffd93d, 0x4ade80, 0x38bdf8, 0xa78bfa];
    colores.forEach((c, i) => {
      this.add.image(178 + i * 89, 118, 'ladrillo').setTint(c).setScale(0.92);
    });

    // Título
    const titulo = this.add.text(width / 2, 205, 'NEÓN BREAKER', {
      fontFamily: FUENTE, fontSize: '58px', color: '#f8fafc'
    }).setOrigin(0.5).setFontStyle('bold');
    titulo.setPadding(46, 34, 46, 34);
    titulo.setShadow(0, 0, '#38bdf8', 20, false, true);

    this.add.text(width / 2, 252, 'ROMPE TODOS LOS LADRILLOS', {
      fontFamily: FUENTE, fontSize: '13px', color: '#64748b'
    }).setOrigin(0.5);

    // Controles
    const controles = [
      ['← →  ·  A D  ·  MOUSE', 'mover la paleta'],
      ['ESPACIO  ·  CLIC', 'lanzar la bola'],
      ['P', 'pausa'],
      ['M', 'silencio']
    ];
    controles.forEach(([tecla, accion], i) => {
      const y = 330 + i * 32;
      this.add.text(width / 2 - 30, y, tecla, {
        fontFamily: FUENTE, fontSize: '14px', color: '#cbd5e1'
      }).setOrigin(1, 0.5);
      this.add.text(width / 2 - 10, y, accion, {
        fontFamily: FUENTE, fontSize: '14px', color: '#475569'
      }).setOrigin(0, 0.5);
    });

    // Récord
    const record = leerRecord();
    if (record > 0) {
      this.add.text(width / 2, 472, `MEJOR PUNTAJE   ${formatearPuntos(record)}`, {
        fontFamily: FUENTE, fontSize: '15px', color: '#4ade80'
      }).setOrigin(0.5);
    }

    // Llamada a la acción
    const cta = this.add.text(width / 2, 522, 'PULSA ESPACIO O HAZ CLIC PARA JUGAR', {
      fontFamily: FUENTE, fontSize: '17px', color: '#ff4d6d'
    }).setOrigin(0.5).setFontStyle('bold');
    this.tweens.add({ targets: cta, alpha: 0.35, duration: 900, yoyo: true, repeat: -1 });

    const empezar = () => {
      Sonido.iniciar();
      Sonido.tono(700, 0.09, 'square', 0.05);
      this.scene.start('Juego');
    };
    this.input.keyboard.once('keydown-SPACE', empezar);
    this.input.keyboard.once('keydown-ENTER', empezar);
    this.input.once('pointerdown', empezar);
  }
}
