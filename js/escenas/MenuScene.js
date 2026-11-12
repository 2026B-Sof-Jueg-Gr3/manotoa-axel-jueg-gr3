/* =========================================================
   MenuScene — la antesala del juego
   ---------------------------------------------------------
   Presenta el logline, las tres Leyes como promesa (sin
   revelar el giro), los controles y —si ya lo conseguiste—
   el Sello del Último Fotón, que sobrevive entre partidas.
   ========================================================= */
class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#05070d');
    this.add.tileSprite(0, 0, width, height, 'fondo').setOrigin(0, 0);

    const halo = this.add.image(width / 2, 188, 'halo').setScale(2.6).setAlpha(0.75);
    this.tweens.add({ targets: halo, alpha: 1, scale: 2.9, duration: 2600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    const colores = [0xff4d6d, 0xffa62b, 0xffd93d, 0x4ade80, 0x38bdf8, 0xa78bfa];
    colores.forEach((c, i) => {
      this.add.image(178 + i * 89, 106, 'ladrillo').setTint(c).setScale(0.92);
    });

    const titulo = this.add.text(width / 2, 190, HISTORIA.titulo, {
      fontFamily: FUENTE, fontSize: '56px', color: '#f8fafc'
    }).setOrigin(0.5).setFontStyle('bold');
    titulo.setPadding(46, 30, 46, 30);
    titulo.setShadow(0, 0, '#38bdf8', 20, false, true);

    this.add.text(width / 2, 238, HISTORIA.subtitulo, {
      fontFamily: FUENTE, fontSize: '15px', color: '#ffd93d'
    }).setOrigin(0.5).setFontStyle('bold');

    this.add.text(width / 2, 270,
      'LUMEN debe devolverle el color a una ciudad que olvidó el suyo.', {
        fontFamily: FUENTE, fontSize: '13px', color: '#64748b'
      }).setOrigin(0.5);

    const sello = leerSello();
    if (sello) {
      const linea = this.add.text(width / 2, 300,
        `✦ SELLO DEL ÚLTIMO FOTÓN  ·  ${sello.codigo}`, {
          fontFamily: FUENTE, fontSize: '13px', color: '#ffd93d'
        }).setOrigin(0.5).setFontStyle('bold');
      this.tweens.add({ targets: linea, alpha: 0.55, duration: 1600, yoyo: true, repeat: -1 });
    } else {
      this.add.text(width / 2, 300, 'TRES LEYES. UN ÚLTIMO BLOQUE. DOS FORMAS DE TERMINAR.', {
        fontFamily: FUENTE, fontSize: '12px', color: '#a78bfa'
      }).setOrigin(0.5);
    }

    const controles = [
      ['← →  ·  A D  ·  MOUSE', 'mover la paleta'],
      ['ESPACIO  ·  CLIC', 'lanzar la luz'],
      ['E  ·  CLIC DERECHO', 'pulso de resonancia'],
      ['◈', 'escucha los Ecos de Memoria'],
      ['P  ·  M', 'pausa / silencio']
    ];
    controles.forEach(([tecla, accion], i) => {
      const y = 344 + i * 30;
      this.add.text(width / 2 - 26, y, tecla, {
        fontFamily: FUENTE, fontSize: '13px', color: '#cbd5e1'
      }).setOrigin(1, 0.5);
      this.add.text(width / 2 - 10, y, accion, {
        fontFamily: FUENTE, fontSize: '13px', color: '#475569'
      }).setOrigin(0, 0.5);
    });

    const record = leerRecord();
    if (record > 0) {
      this.add.text(width / 2, 510, `MEJOR PUNTAJE   ${formatearPuntos(record)}`, {
        fontFamily: FUENTE, fontSize: '14px', color: '#4ade80'
      }).setOrigin(0.5);
    }

    const cta = this.add.text(width / 2, 552, 'PULSA ESPACIO PARA ENCENDER LA CIUDAD', {
      fontFamily: FUENTE, fontSize: '16px', color: '#ff4d6d'
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
