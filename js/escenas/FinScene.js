/* =========================================================
   FinScene — resultado de la partida
   ========================================================= */
class FinScene extends Phaser.Scene {
  constructor() {
    super('Fin');
  }

  init(data) {
    this.puntos = (data && data.puntos) || 0;
    this.nivel = (data && data.nivel) || 1;
    this.victoria = !!(data && data.victoria);
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#05070d');
    this.add.tileSprite(0, 0, width, height, 'fondo').setOrigin(0, 0).setAlpha(0.8);

    const nuevoRecord = guardarRecord(this.puntos);
    const record = leerRecord();

    // Hilera decorativa
    const colores = [0xff4d6d, 0xffa62b, 0xffd93d, 0x4ade80, 0x38bdf8, 0xa78bfa];
    colores.forEach((c, i) => {
      this.add.image(178 + i * 89, 78, 'ladrillo').setTint(c).setScale(0.7).setAlpha(0.55);
    });

    const colorTitulo = this.victoria ? '#4ade80' : '#ff4d6d';
    const titulo = this.add.text(width / 2, 176, this.victoria ? '¡VICTORIA!' : 'GAME OVER', {
      fontFamily: FUENTE, fontSize: '60px', color: colorTitulo
    }).setOrigin(0.5).setFontStyle('bold');
    titulo.setPadding(46, 34, 46, 34);
    titulo.setShadow(0, 0, colorTitulo, 20, false, true);

    this.add.text(width / 2, 234, this.victoria
      ? 'ROMPISTE TODOS LOS LADRILLOS'
      : 'LA BOLA CAYÓ DEMASIADAS VECES', {
      fontFamily: FUENTE, fontSize: '13px', color: '#64748b'
    }).setOrigin(0.5);

    this.add.text(width / 2, 296, 'PUNTAJE', {
      fontFamily: FUENTE, fontSize: '12px', color: '#475569'
    }).setOrigin(0.5);

    this.add.text(width / 2, 340, formatearPuntos(this.puntos), {
      fontFamily: FUENTE, fontSize: '56px', color: '#f8fafc'
    }).setOrigin(0.5).setFontStyle('bold');

    this.add.text(width / 2, 392, `NIVEL ALCANZADO  ${this.nivel}`, {
      fontFamily: FUENTE, fontSize: '14px', color: '#94a3b8'
    }).setOrigin(0.5);

    if (nuevoRecord && this.puntos > 0) {
      const marca = this.add.text(width / 2, 430, 'NUEVO RÉCORD', {
        fontFamily: FUENTE, fontSize: '16px', color: '#ffd93d'
      }).setOrigin(0.5).setFontStyle('bold');
      this.tweens.add({ targets: marca, alpha: 0.3, duration: 700, yoyo: true, repeat: -1 });
    } else if (record > 0) {
      this.add.text(width / 2, 430, `MEJOR PUNTAJE  ${formatearPuntos(record)}`, {
        fontFamily: FUENTE, fontSize: '14px', color: '#475569'
      }).setOrigin(0.5);
    }

    const cta = this.add.text(width / 2, height - 96, 'HAZ CLIC O PULSA ESPACIO PARA VOLVER A JUGAR', {
      fontFamily: FUENTE, fontSize: '16px', color: '#38bdf8'
    }).setOrigin(0.5).setFontStyle('bold');
    this.tweens.add({ targets: cta, alpha: 0.35, duration: 900, yoyo: true, repeat: -1 });

    this.add.text(width / 2, height - 62, 'ESC — volver al menú', {
      fontFamily: FUENTE, fontSize: '12px', color: '#334155'
    }).setOrigin(0.5);

    const otraVez = () => {
      Sonido.tono(700, 0.08, 'square', 0.05);
      this.scene.start('Juego');
    };
    this.input.once('pointerdown', otraVez);
    this.input.keyboard.once('keydown-SPACE', otraVez);
    this.input.keyboard.once('keydown-ENTER', otraVez);
    this.input.keyboard.once('keydown-ESC', () => this.scene.start('Menu'));
  }
}
