/* =========================================================
   FinScene — el orgullo de haber terminado
   ---------------------------------------------------------
   Tres salidas posibles:
     · derrota    → sin vidas, con opción de reintentar
     · hueco      → rompiste el Último Fotón (final amargo,
                    pero el Núcleo sigue esperando: no pierdes nada)
     · verdadero  → el secreto: la ciudad recuerda. Sello,
                    rango, estadísticas y código de luz.

   El final verdadero guarda un Sello en localStorage: la
   próxima vez que abras el juego, el menú te lo recuerda.
   ========================================================= */
class FinScene extends Phaser.Scene {
  constructor() {
    super('Fin');
  }

  init(data) {
    const d = data || {};
    this.tipo = d.tipo || 'derrota';
    this.puntos = d.puntos || 0;
    this.rotos = d.rotos || 0;
    this.memoria = d.memoria || 0;
    this.comboMax = d.comboMax || 1;
    this.tiempo = d.tiempo || 0;
    this.vidas = d.vidas != null ? d.vidas : 0;
    this.ecosOidos = d.ecosOidos || [];
    this.gemasEncendidas = d.gemasEncendidas || 0;
    this.stats = {
      puntos: this.puntos, rotos: this.rotos, memoria: this.memoria,
      comboMax: this.comboMax, tiempo: this.tiempo, ecos: this.memoria
    };
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#05070d');
    this.add.tileSprite(0, 0, width, height, 'fondo').setOrigin(0, 0);

    this.nuevoRecord = guardarRecord(this.puntos);

    if (this.tipo === 'verdadero') this.crearFinalVerdadero();
    else if (this.tipo === 'hueco') this.crearFinalHueco();
    else this.crearDerrota();

    this.crearPie();
  }

  /* ---------------- FINAL VERDADERO ---------------- */
  crearFinalVerdadero() {
    const { width } = this.scale;
    const cfg = HISTORIA.finales.verdadero;

    guardarSello({
      ...this.stats,
      rango: cfg.rango,
      codigo: codigoDeLuz({ ...this.stats, ecos: this.memoria })
    });

    // Constelación de fondo: los bloques rotos vuelven como nombres
    const colores = [0xff4d6d, 0xffa62b, 0xffd93d, 0x4ade80, 0x38bdf8, 0xa78bfa];
    for (let i = 0; i < 64; i++) {
      const p = this.add.circle(
        Phaser.Math.Between(20, width - 20), Phaser.Math.Between(20, 560),
        Phaser.Math.Between(1, 3), colores[i % colores.length], 0.75
      );
      this.tweens.add({
        targets: p, alpha: 0.2, scale: 1.6,
        duration: Phaser.Math.Between(1100, 2600),
        delay: Phaser.Math.Between(0, 1400), yoyo: true, repeat: -1
      });
    }

    this.dibujarSello(width / 2, 78, cfg.color);

    const titulo = this.add.text(width / 2, 178, cfg.titulo, {
      fontFamily: FUENTE, fontSize: '36px', color: '#f8fafc'
    }).setOrigin(0.5).setFontStyle('bold');
    titulo.setPadding(24, 14, 24, 14);
    titulo.setShadow(0, 0, cfg.color, 22, false, true);

    this.add.text(width / 2, 216, cfg.subtitulo, {
      fontFamily: FUENTE, fontSize: '13px', color: cfg.color
    }).setOrigin(0.5).setFontStyle('bold');

    cfg.cuerpo.forEach((linea, i) => {
      const t = this.add.text(width / 2, 244 + i * 21, linea, {
        fontFamily: FUENTE, fontSize: '14px', color: '#94a3b8'
      }).setOrigin(0.5).setAlpha(0);
      this.tweens.add({ targets: t, alpha: 1, duration: 600, delay: 300 + i * 300 });
    });

    this.time.delayedCall(2100, () => {
      const rango = this.add.text(width / 2, 354, cfg.rango, {
        fontFamily: FUENTE, fontSize: '22px', color: '#ffd93d'
      }).setOrigin(0.5).setFontStyle('bold');
      rango.setPadding(18, 10, 18, 10);
      rango.setShadow(0, 0, '#ffd93d', 16, false, true);

      this.add.text(width / 2, 382, cfg.nota, {
        fontFamily: FUENTE, fontSize: '13px', color: '#4ade80'
      }).setOrigin(0.5);

      this.crearEstadisticas(410);
    });
  }

  dibujarSello(x, y, color) {
    const g = this.add.graphics();
    g.lineStyle(3, 0xffd93d, 0.9);
    g.strokeCircle(x, y, 46);
    g.lineStyle(1, 0xffd93d, 0.45);
    g.strokeCircle(x, y, 54);
    g.fillStyle(0xffd93d, 0.12);
    g.fillCircle(x, y, 46);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(x, y, 9);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      g.fillStyle(0xffd93d, 0.85);
      g.fillCircle(x + Math.cos(a) * 36, y + Math.sin(a) * 36, 2.5);
    }
    this.tweens.add({ targets: g, alpha: 0.72, duration: 1600, yoyo: true, repeat: -1 });
    this.add.text(x, y + 68, 'SELLO DEL ÚLTIMO FOTÓN', {
      fontFamily: FUENTE, fontSize: '10px', color: '#ffd93d'
    }).setOrigin(0.5);
  }

  /* ---------------- FINAL HUECO ---------------- */
  crearFinalHueco() {
    const { width } = this.scale;
    const cfg = HISTORIA.finales.hueco;

    const titulo = this.add.text(width / 2, 130, cfg.titulo, {
      fontFamily: FUENTE, fontSize: '46px', color: '#f8fafc'
    }).setOrigin(0.5).setFontStyle('bold');
    titulo.setPadding(24, 14, 24, 14);
    titulo.setShadow(0, 0, cfg.color, 20, false, true);

    this.add.text(width / 2, 186, cfg.subtitulo, {
      fontFamily: FUENTE, fontSize: '16px', color: cfg.color
    }).setOrigin(0.5).setFontStyle('bold');

    cfg.cuerpo.forEach((linea, i) => {
      this.add.text(width / 2, 230 + i * 24, linea, {
        fontFamily: FUENTE, fontSize: '14px', color: '#94a3b8'
      }).setOrigin(0.5);
    });

    const nota = this.add.text(width / 2, 320, cfg.nota, {
      fontFamily: FUENTE, fontSize: '15px', color: '#ffd93d'
    }).setOrigin(0.5).setFontStyle('bold');
    this.tweens.add({ targets: nota, alpha: 0.45, duration: 1100, yoyo: true, repeat: -1 });

    this.add.text(width / 2, 352, cfg.rango, {
      fontFamily: FUENTE, fontSize: '13px', color: '#64748b'
    }).setOrigin(0.5);

    this.crearEstadisticas(380);

    // No pierdes el esfuerzo: el Núcleo vuelve a abrirse
    const btn = this.add.text(width / 2, 532, 'VOLVER AL NÚCLEO  [R]', {
      fontFamily: FUENTE, fontSize: '17px', color: '#4ade80'
    }).setOrigin(0.5).setFontStyle('bold');
    this.tweens.add({ targets: btn, alpha: 0.4, duration: 900, yoyo: true, repeat: -1 });

    const volver = () => this.scene.start('Juego', {
      puntos: this.puntos, rotos: this.rotos, memoria: this.memoria,
      ecosOidos: this.ecosOidos, comboMax: this.comboMax, tiempo: this.tiempo,
      vidas: Math.max(this.vidas, 1), nivel: NIVELES.length - 1,
      gemasEncendidas: this.gemasEncendidas, nucleo: true
    });
    this.input.keyboard.once('keydown-R', volver);
    this.btnVolver = btn;
    btn.setInteractive({ useHandCursor: true }).on('pointerdown', volver);
  }

  /* ---------------- DERROTA ---------------- */
  crearDerrota() {
    const { width } = this.scale;
    const t = this.add.text(width / 2, 170, 'LA LUZ SE AGOTÓ', {
      fontFamily: FUENTE, fontSize: '46px', color: '#ff4d6d'
    }).setOrigin(0.5).setFontStyle('bold');
    t.setPadding(24, 14, 24, 14);
    t.setShadow(0, 0, '#ff4d6d', 20, false, true);

    this.add.text(width / 2, 234, 'La ciudad sigue esperando a alguien que se acuerde de ella.', {
      fontFamily: FUENTE, fontSize: '14px', color: '#94a3b8'
    }).setOrigin(0.5);
    this.crearEstadisticas(292);
  }

  /* ---------------- ESTADÍSTICAS Y CÓDIGO ---------------- */
  /* yTop = borde superior del panel */
  crearEstadisticas(yTop) {
    const { width } = this.scale;
    const filas = [
      ['PUNTAJE', formatearPuntos(this.puntos)],
      ['BLOQUES ROTOS', String(this.rotos)],
      ['MEMORIA', `${this.memoria}/3`],
      ['COMBO MÁXIMO', `x${this.comboMax}`],
      ['TIEMPO', formatearTiempo(this.tiempo)]
    ];
    const panel = this.add.rectangle(width / 2, yTop + 50, 460, 100, 0x0a0e17, 0.9)
      .setStrokeStyle(1, 0x1e293b, 1);
    panel.setAlpha(0);
    this.tweens.add({ targets: panel, alpha: 1, duration: 400 });

    filas.forEach(([k, v], i) => {
      const col = i % 3;
      const fila = Math.floor(i / 3);
      const x = width / 2 - 190 + col * 152;
      const yy = yTop + 12 + fila * 42;
      this.add.text(x, yy, k, {
        fontFamily: FUENTE, fontSize: '10px', color: '#475569'
      }).setOrigin(0, 0);
      this.add.text(x, yy + 14, v, {
        fontFamily: FUENTE, fontSize: '18px', color: '#f8fafc'
      }).setOrigin(0, 0).setFontStyle('bold');
    });

    const codigo = codigoDeLuz({ ...this.stats, ecos: this.memoria });
    this.add.text(width / 2, yTop + 116, `CÓDIGO DE LUZ   ${codigo}`, {
      fontFamily: FUENTE, fontSize: '12px', color: '#38bdf8'
    }).setOrigin(0.5);
  }

  crearPie() {
    const { width, height } = this.scale;
    const cta = this.add.text(width / 2, height - 28, 'ESPACIO  ·  VOLVER AL MENÚ', {
      fontFamily: FUENTE, fontSize: '15px', color: '#94a3b8'
    }).setOrigin(0.5);
    this.tweens.add({ targets: cta, alpha: 0.45, duration: 1000, yoyo: true, repeat: -1 });
    const ir = () => this.scene.start('Menu');
    this.input.keyboard.once('keydown-SPACE', ir);
    this.input.keyboard.once('keydown-ENTER', ir);
    cta.setInteractive({ useHandCursor: true }).on('pointerdown', ir);
  }
}
