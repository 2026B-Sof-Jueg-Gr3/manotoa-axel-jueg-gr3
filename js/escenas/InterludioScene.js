/* =========================================================
   InterludioScene — EL GIRO
   ---------------------------------------------------------
   Después de limpiar tres sectores, el juego se detiene y le
   dice al jugador qué era en realidad lo que estaba rompiendo.
   Es una escena propia (no un cartel) para que el cambio de
   tono se sienta como un cambio de acto.
   ========================================================= */
class InterludioScene extends Phaser.Scene {
  constructor() {
    super('Interludio');
  }

  init(data) {
    this.datos = data || {};
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#05070d');
    this.add.tileSprite(0, 0, width, height, 'fondo').setOrigin(0, 0);

    // LUMEN y su sombra: la revelación en una sola imagen
    const lumen = this.add.circle(width / 2, 116, 22, 0xffffff, 0.95);
    const halo = this.add.circle(width / 2, 116, 54, 0x38bdf8, 0.12);
    this.tweens.add({ targets: halo, scale: 1.25, alpha: 0.25, duration: 1800, yoyo: true, repeat: -1 });
    this.add.circle(width / 2 + 34, 128, 22, 0x000000, 0.85);
    this.add.text(width / 2, 168, 'LUMEN  /  EL APAGÓN', {
      fontFamily: FUENTE, fontSize: '11px', color: '#475569'
    }).setOrigin(0.5);

    const titulo = this.add.text(width / 2, 214, HISTORIA.interludio.titulo, {
      fontFamily: FUENTE, fontSize: '25px', color: '#f8fafc'
    }).setOrigin(0.5).setFontStyle('bold');
    titulo.setPadding(20, 10, 20, 10);
    titulo.setShadow(0, 0, '#ffd93d', 14, false, true);

    // Las líneas aparecen una a una, como recuerdos que vuelven
    this.yLinea = 262;
    this.lineaActual = 0;
    this.time.addEvent({
      delay: 780,
      repeat: HISTORIA.interludio.lineas.length - 1,
      callback: () => this.mostrarLinea()
    });

    const total = HISTORIA.interludio.lineas.length * 780;
    this.time.delayedCall(total + 500, () => {
      const remate = this.add.text(width / 2, height - 148, HISTORIA.interludio.remate, {
        fontFamily: FUENTE, fontSize: '20px', color: '#ffd93d'
      }).setOrigin(0.5).setFontStyle('bold');
      remate.setPadding(18, 10, 18, 10);
      remate.setShadow(0, 0, '#ffd93d', 12, false, true);

      this.add.text(width / 2, height - 116, HISTORIA.interludio.pie, {
        fontFamily: FUENTE, fontSize: '13px', color: '#94a3b8'
      }).setOrigin(0.5);

      const cta = this.add.text(width / 2, height - 64, 'ESPACIO  ·  ENTRAR AL NÚCLEO', {
        fontFamily: FUENTE, fontSize: '16px', color: '#4ade80'
      }).setOrigin(0.5).setFontStyle('bold');
      this.tweens.add({ targets: cta, alpha: 0.35, duration: 900, yoyo: true, repeat: -1 });
      this.listo = true;
    });

    const continuar = () => {
      if (!this.listo) return;
      Sonido.tono(880, 0.09, 'square', 0.05);
      this.scene.start('Juego', {
        ...this.datos,
        nucleo: true,
        nivel: NIVELES.length - 1,
        gemasEncendidas: 3
      });
    };
    this.input.keyboard.once('keydown-SPACE', continuar);
    this.input.keyboard.once('keydown-ENTER', continuar);
    this.input.once('pointerdown', continuar);
  }

  mostrarLinea() {
    const { width } = this.scale;
    const texto = HISTORIA.interludio.lineas[this.lineaActual];
    const t = this.add.text(width / 2, this.yLinea, texto, {
      fontFamily: FUENTE, fontSize: '14px', color: '#94a3b8',
      align: 'center', wordWrap: { width: 660 }
    }).setOrigin(0.5, 0).setAlpha(0);
    this.tweens.add({ targets: t, alpha: 1, duration: 420 });
    this.yLinea += 27;
    this.lineaActual++;
    Sonido.tono(300 + this.lineaActual * 24, 0.06, 'sine', 0.025);
  }
}
