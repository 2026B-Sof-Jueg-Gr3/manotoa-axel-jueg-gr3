/* =========================================================
   JuegoScene — El corazón del juego y de la historia
   ---------------------------------------------------------
   FASE 1 del taller, hecha jugable:
     · Lore        → 3 Leyes de la Luz, entregadas como Ecos
     · Resonancia  → aprender = recordar = encender la ciudad
     · Identidad   → romper un bloque ES borrar un recuerdo
     · Giro        → el Núcleo pide romper lo que hay que salvar
     · Secreto     → dejar caer la luz, o mantener R

   Nuevo respecto a la v1:
     · Ecos de Memoria (3 objetos ocultos que enseñan las leyes)
     · Pulso de Resonancia (E / clic derecho) para curvar la luz
     · Gemas de color y medidor de MEMORIA en el HUD
     · Voz del Apagón y consejos de física diegéticos
     · Cámara final "EL NÚCLEO" con dos finales
   ========================================================= */
class JuegoScene extends Phaser.Scene {
  constructor() {
    super('Juego');
  }

  init(data) {
    this.datos = data || {};
    this.enNucleo = !!this.datos.nucleo;
  }

  create() {
    this.physics.resume();

    const d = this.datos;
    // --- estado de partida (se conserva al pasar por el Interludio) ---
    this.nivel = d.nivel != null ? d.nivel : 0;
    this.puntos = d.puntos != null ? d.puntos : 0;
    this.vidas = d.vidas != null ? d.vidas : TABLERO.VIDAS;
    this.rotos = d.rotos != null ? d.rotos : 0;
    this.memoria = d.memoria != null ? d.memoria : 0;
    this.ecosOidos = d.ecosOidos != null ? d.ecosOidos : [];
    this.comboMax = d.comboMax != null ? d.comboMax : 1;
    this.tiempo = d.tiempo != null ? d.tiempo : 0;
    this.gemasEncendidas = d.gemasEncendidas != null ? d.gemasEncendidas : 0;

    this.combo = 1;
    this.destruidos = 0;
    this.resonancia = 60;
    this.pausado = false;
    this.transicion = false;
    this.finalizado = false;
    this.bolaPegada = true;
    this.velBase = NIVELES[Math.min(this.nivel, NIVELES.length - 1)].velocidad;
    this.inicioR = null;
    this.ultimoPulso = 0;
    this.dichos = {};
    this.emisoress = {};

    this.physics.world.setBounds(0, 0, TABLERO.ANCHO, TABLERO.ALTO, true, true, true, false);

    this.crearFondo();
    this.crearPaleta();

    this.bolas = this.physics.add.group();
    this.powerups = this.physics.add.group();
    this.ecos = this.physics.add.group();
    this.ladrillos = this.physics.add.staticGroup();

    this.crearHud();
    this.crearControles();

    this.physics.add.collider(this.bolas, this.ladrillos, this.golpeLadrillo, null, this);
    this.physics.add.collider(this.bolas, this.paleta, this.golpePaleta, null, this);
    this.physics.add.overlap(this.paleta, this.powerups, this.recogerPowerUp, null, this);
    this.physics.add.overlap(this.bolas, this.ecos, this.recogerEco, null, this);

    if (this.enNucleo) this.iniciarNucleo();
    else this.construirNivel();

    this.resetBola();
    this.actualizarHud();

    if (!this.enNucleo) {
      const s = HISTORIA.sectores[this.nivel];
      this.mostrarAviso(`SECTOR ${this.nivel + 1} · ${s.nombre}`, '#38bdf8');
      this.time.delayedCall(1500, () => this.susurro(s.burla, '#a78bfa', 2600));
      if (this.nivel === 0) {
        this.time.delayedCall(3200, () => this.susurro('◈ ALGO PARPADEA ARRIBA', '#ffd93d', 2400));
      }
    }
  }

  /* =========================================================
     MONTAJE
     ========================================================= */
  crearFondo() {
    this.fondo = this.add.tileSprite(0, 0, TABLERO.ANCHO, TABLERO.ALTO, 'fondo')
      .setOrigin(0, 0).setDepth(0);

    const tonos = [0x1e293b, 0x1e3a5f, 0x1e4d63];
    const tono = this.enNucleo ? 0x6b4a12 : tonos[Math.min(this.nivel, 2)];
    const alpha = this.enNucleo ? 0.14 : 0.05 + this.gemasEncendidas * 0.035;
    this.add.rectangle(0, 0, TABLERO.ANCHO, TABLERO.ALTO, tono, alpha)
      .setOrigin(0).setDepth(0.5);

    const g = this.add.graphics().setDepth(1);
    g.lineStyle(1, tono, 0.45);
    for (let x = 0; x <= TABLERO.ANCHO; x += 40) g.lineBetween(x, 0, x, TABLERO.ALTO);
    for (let y = 0; y <= TABLERO.ALTO; y += 40) g.lineBetween(0, y, TABLERO.ANCHO, y);
    g.lineStyle(3, 0x1f2b3d, 1);
    g.strokeRect(1.5, 1.5, TABLERO.ANCHO - 3, TABLERO.ALTO - 3);
  }

  crearPaleta() {
    this.paleta = this.physics.add.image(TABLERO.ANCHO / 2, TABLERO.PALETA_Y, 'paleta');
    this.paleta.setImmovable(true);
    this.paleta.body.setAllowGravity(false);
    this.paleta.setCollideWorldBounds(true);
    this.paleta.setDepth(20);
  }

  crearHud() {
    const estilo = { fontFamily: FUENTE };

    this.add.text(22, 12, 'PUNTOS', { ...estilo, fontSize: '10px', color: '#475569' }).setDepth(100);
    this.txtPuntos = this.add.text(22, 24, '0', {
      ...estilo, fontSize: '28px', color: '#f8fafc'
    }).setDepth(100).setFontStyle('bold');
    this.txtCombo = this.add.text(22, 58, '', {
      ...estilo, fontSize: '12px', color: '#ffd93d'
    }).setDepth(100);

    this.txtEtiqueta = this.add.text(TABLERO.ANCHO / 2, 8, 'SECTOR', {
      ...estilo, fontSize: '9px', color: '#475569'
    }).setOrigin(0.5, 0).setDepth(100);
    this.txtSector = this.add.text(TABLERO.ANCHO / 2, 26, '', {
      ...estilo, fontSize: '15px', color: '#38bdf8'
    }).setOrigin(0.5, 0).setDepth(100).setFontStyle('bold');

    // Gemas de color: el progreso narrativo, no solo un número
    this.gemas = [];
    const coloresGema = [0xff4d6d, 0xffd93d, 0x4ade80];
    for (let i = 0; i < 3; i++) {
      const gx = TABLERO.ANCHO / 2 - 34 + i * 34;
      const gema = this.add.star(gx, 62, 4, 2, 9, coloresGema[i])
        .setDepth(100).setStrokeStyle(1, coloresGema[i], 0.55);
      gema.colorGema = coloresGema[i];
      this.gemas.push(gema);
    }

    this.add.text(TABLERO.ANCHO - 22, 12, 'VIDAS', {
      ...estilo, fontSize: '10px', color: '#475569'
    }).setOrigin(1, 0).setDepth(100);
    this.iconosVida = [];
    for (let i = 0; i < TABLERO.VIDAS_MAX; i++) {
      const ic = this.add.rectangle(TABLERO.ANCHO - 30 - i * 20, 42, 14, 14, 0xff4d6d)
        .setDepth(100).setStrokeStyle(1, 0xff8fa3, 0.8);
      this.iconosVida.push(ic);
    }

    // Memoria (aprendizaje) y Resonancia (nueva mecánica)
    this.txtMemoria = this.add.text(22, TABLERO.ALTO - 26, '', {
      ...estilo, fontSize: '11px', color: '#ffd93d'
    }).setDepth(100);

    this.add.text(TABLERO.ANCHO - 22, TABLERO.ALTO - 26, 'RESONANCIA  [E]', {
      ...estilo, fontSize: '10px', color: '#475569'
    }).setOrigin(1, 1).setDepth(100);
    this.add.rectangle(TABLERO.ANCHO - 150, TABLERO.ALTO - 14, 128, 6, 0x1e293b, 1)
      .setOrigin(0, 0.5).setDepth(100);
    this.barraResonancia = this.add.rectangle(TABLERO.ANCHO - 150, TABLERO.ALTO - 14, 128, 6, 0xa78bfa, 0.95)
      .setOrigin(0, 0.5).setDepth(100);

    // Texto exclusivo del Núcleo
    this.txtOrden = this.add.text(TABLERO.ANCHO / 2, 96, '', {
      ...estilo, fontSize: '19px', color: '#ffd93d'
    }).setOrigin(0.5).setDepth(120).setFontStyle('bold');
    this.txtGlifo = this.add.text(TABLERO.ANCHO - 26, 96, '', {
      ...estilo, fontSize: '18px', color: '#ffd93d'
    }).setOrigin(1, 0).setDepth(120);

    const velo = this.add.rectangle(0, 0, TABLERO.ANCHO, TABLERO.ALTO, 0x05070d, 0.78).setOrigin(0);
    const t1 = this.add.text(TABLERO.ANCHO / 2, TABLERO.ALTO / 2 - 16, 'PAUSA', {
      ...estilo, fontSize: '46px', color: '#f8fafc'
    }).setOrigin(0.5).setFontStyle('bold');
    const t2 = this.add.text(TABLERO.ANCHO / 2, TABLERO.ALTO / 2 + 34, 'P o ESC para continuar', {
      ...estilo, fontSize: '14px', color: '#64748b'
    }).setOrigin(0.5);
    this.overlayPausa = this.add.container(0, 0, [velo, t1, t2]).setDepth(300).setVisible(false);
  }

  crearControles() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.teclas = this.input.keyboard.addKeys('A,D,E,R');
    if (this.input.mouse) this.input.mouse.disableContextMenu();

    this.input.keyboard.on('keydown-SPACE', () => this.lanzar());
    this.input.keyboard.on('keydown-P', () => this.togglePausa());
    this.input.keyboard.on('keydown-ESC', () => this.togglePausa());
    this.input.keyboard.on('keydown-M', () => this.alternarSonido());
    this.input.keyboard.on('keydown-E', () => this.pulsoResonancia());
    this.input.keyboard.on('keydown-R', () => {
      // El auto-repeat del teclado dispara keydown-R muchas veces:
      // solo la primera pulsación inicia el contador del secreto.
      if (this.enNucleo && !this.transicion && !this.inicioR) this.inicioR = this.time.now;
    });
    this.input.keyboard.on('keyup-R', () => { this.inicioR = null; });

    this.input.on('pointerdown', (p) => {
      if (p.rightButtonDown && p.rightButtonDown()) {
        this.pulsoResonancia();
        return;
      }
      this.lanzar();
    });
    this.input.on('pointermove', (p) => {
      if (this.pausado || this.transicion) return;
      const x = this.cameras.main.getWorldPoint(p.x, p.y).x;
      if (!Number.isFinite(x)) return;
      const mitad = this.paleta.displayWidth / 2;
      this.paleta.x = Phaser.Math.Clamp(x, mitad, TABLERO.ANCHO - mitad);
    });
  }

  /* =========================================================
     NIVELES / SECTORES
     ========================================================= */
  construirNivel() {
    const cfg = NIVELES[this.nivel];
    this.ladrillos.clear(true, true);
    this.ecos.clear(true, true);
    this.powerups.clear(true, true);
    this.velBase = cfg.velocidad;
    this.destruidos = 0;
    this.dichos = {};

    const paso = TABLERO.ANCHO_LADRILLO + TABLERO.HUECO;
    for (let f = 0; f < cfg.filas; f++) {
      for (let c = 0; c < TABLERO.COLUMNAS; c++) {
        if (!cfg.patron(f, c, cfg.filas, TABLERO.COLUMNAS)) continue;
        const x = TABLERO.MARGEN_X + c * paso + TABLERO.ANCHO_LADRILLO / 2;
        const y = TABLERO.Y_INICIO + f * (TABLERO.ALTO_LADRILLO + TABLERO.HUECO) + TABLERO.ALTO_LADRILLO / 2;
        const color = cfg.colores[f % cfg.colores.length];
        const ladrillo = this.ladrillos.create(x, y, 'ladrillo');
        ladrillo.setTint(color).setDepth(10);
        ladrillo.vida = cfg.dureza(f);
        ladrillo.color = color;
        ladrillo.esFoton = false;
      }
    }
    this.crearEco(this.nivel);
  }

  /* Un Eco por sector: la ley se aprende jugando, no leyendo un test */
  crearEco(indice) {
    if (this.ecosOidos.indexOf(indice) !== -1) return;
    const xs = [400, 96, 704];
    const eco = this.ecos.create(xs[indice], 84, 'eco');
    eco.setDepth(12).setTint(0xffd93d).setAlpha(0.55);
    eco.body.setAllowGravity(false);
    eco.body.setImmovable(true);
    eco.indice = indice;
    this.tweens.add({
      targets: eco, alpha: 0.95, scale: 1.18,
      duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
    });
  }

  recogerEco(bola, eco) {
    if (!eco.active || this.transicion) return;
    const indice = eco.indice;
    const x = eco.x, y = eco.y;
    eco.destroy();
    if (this.ecosOidos.indexOf(indice) === -1) this.ecosOidos.push(indice);
    this.memoria = Math.min(this.ecosOidos.length, 3);
    this.puntos += 150;
    this.resonancia = Math.min(100, this.resonancia + 30);

    Sonido.arpegio([523, 784, 1046], 80);
    this.chispas(0xffd93d).emitParticleAt(x, y, 20);
    this.mostrarAviso(HISTORIA.leyes[indice].nombre, '#ffd93d', 2100);
    this.time.delayedCall(900, () => this.susurro(HISTORIA.leyes[indice].corto, '#ffd93d', 2600));
    this.actualizarHud();
  }

  nivelCompletado() {
    if (this.transicion) return;
    this.transicion = true;
    this.puntos += 100;
    this.bolas.clear(true, true);
    this.powerups.clear(true, true);
    this.gemasEncendidas = Math.min(3, this.gemasEncendidas + 1);
    this.actualizarHud();
    this.mostrarAviso('SECTOR RESTAURADO', '#4ade80');
    Sonido.arpegio([523, 659, 784, 1046]);

    this.time.delayedCall(1600, () => {
      if (this.nivel + 1 >= NIVELES.length) {
        this.scene.start('Interludio', this.estadisticas());
        return;
      }
      this.nivel++;
      this.transicion = false;
      this.construirNivel();
      this.resetBola();
      this.actualizarHud();
      const s = HISTORIA.sectores[this.nivel];
      this.mostrarAviso(`SECTOR ${this.nivel + 1} · ${s.nombre}`, '#38bdf8');
      this.time.delayedCall(1500, () => this.susurro(s.burla, '#a78bfa', 2600));
    });
  }

  /* =========================================================
     EL NÚCLEO — el giro y el secreto
     ========================================================= */
  iniciarNucleo() {
    this.ladrillos.clear(true, true);
    this.ecos.clear(true, true);
    this.powerups.clear(true, true);
    this.destruidos = 0;
    this.vidas = Math.max(this.vidas, 1);
    this.velBase = 380;

    const ladrillo = this.ladrillos.create(TABLERO.ANCHO / 2, 250, 'foton');
    ladrillo.setDepth(10);
    ladrillo.vida = 1;
    ladrillo.color = 0xffd93d;
    ladrillo.esFoton = true;
    this.foton = ladrillo;
    this.tweens.add({
      targets: ladrillo, scale: 1.06, alpha: 0.86,
      duration: 1300, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
    });

    this.txtOrden.setText(HISTORIA.nucleo.orden);
    this.txtGlifo.setText(this.memoria >= 3 ? HISTORIA.nucleo.glifo : '');
    this.susurro(HISTORIA.nucleo.susurro, '#94a3b8', 4200);

    const espera = this.memoria >= 3 ? 2500 : 11000;
    this.time.delayedCall(espera, () => {
      if (!this.transicion && !this.finalizado) {
        this.susurro(
          this.memoria >= 3 ? HISTORIA.nucleo.pistaSecreta : HISTORIA.nucleo.pista,
          '#4ade80', 5000
        );
        this.txtGlifo.setText(HISTORIA.nucleo.glifo);
      }
    });
  }

  finalVerdadero() {
    if (this.finalizado || this.transicion) return;
    this.transicion = true;
    Sonido.arpegio([523, 659, 784, 1046, 1318, 1568], 100);
    this.estallidoDeLuz();
    this.time.delayedCall(900, () => this.finPartida('verdadero'));
  }

  finalHueco() {
    if (this.finalizado || this.transicion) return;
    this.transicion = true;
    Sonido.tono(120, 0.5, 'sawtooth', 0.06);
    this.cameras.main.shake(320, 0.014);
    this.time.delayedCall(500, () => this.finPartida('hueco'));
  }

  estallidoDeLuz() {
    const colores = [0xff4d6d, 0xffa62b, 0xffd93d, 0x4ade80, 0x38bdf8, 0xa78bfa];
    for (let i = 0; i < 3; i++) {
      this.time.delayedCall(i * 160, () => {
        const flash = this.add.rectangle(0, 0, TABLERO.ANCHO, TABLERO.ALTO, colores[i], 0.22)
          .setOrigin(0).setDepth(240);
        this.tweens.add({ targets: flash, alpha: 0, duration: 700, onComplete: () => flash.destroy() });
      });
    }
    for (let i = 0; i < 46; i++) {
      const x = Phaser.Math.Between(40, TABLERO.ANCHO - 40);
      const y = Phaser.Math.Between(110, TABLERO.ALTO - 90);
      const c = colores[i % colores.length];
      const punto = this.add.circle(x, y, Phaser.Math.Between(2, 5), c, 0.9).setDepth(241);
      this.tweens.add({
        targets: punto, alpha: 0.25, scale: 1.8,
        duration: Phaser.Math.Between(900, 1900),
        delay: Phaser.Math.Between(0, 700), yoyo: true, repeat: -1
      });
    }
  }

  /* =========================================================
     BOLA
     ========================================================= */
  crearBola(x, y) {
    const bola = this.bolas.create(x, y, 'bola');
    bola.setCircle(10);
    bola.body.setBounce(1, 1);
    bola.body.setCollideWorldBounds(true);
    bola.setDepth(20);
    return bola;
  }

  velocidadBola() {
    return Math.min(this.velBase + this.destruidos * 1.5, 640);
  }

  resetBola() {
    this.bolas.clear(true, true);
    const bola = this.crearBola(this.paleta.x, this.paleta.y - 24);
    bola.body.setVelocity(0, 0);
    this.bolaPegada = true;
    this.combo = 1;
  }

  lanzar() {
    if (this.pausado || this.transicion || !this.bolaPegada) return;
    const bola = this.bolas.getFirstAlive();
    if (!bola) return;
    this.bolaPegada = false;
    const ang = Phaser.Math.DegToRad(Phaser.Math.Between(-35, 35));
    const v = this.velocidadBola();
    bola.body.setVelocity(Math.sin(ang) * v, -Math.cos(ang) * v);
    Sonido.tono(680, 0.07, 'square', 0.05);
  }

  golpePaleta(bola, paleta) {
    if (!bola.active) return;
    const mitad = paleta.displayWidth / 2;
    const offset = Phaser.Math.Clamp((bola.x - paleta.x) / mitad, -1, 1);
    const ang = offset * Phaser.Math.DegToRad(60);
    const v = Math.max(bola.body.velocity.length(), this.velocidadBola());
    bola.body.setVelocity(Math.sin(ang) * v, -Math.cos(ang) * v);
    bola.y = paleta.y - paleta.displayHeight / 2 - 11;

    this.combo = 1;
    Sonido.tono(300 + Math.abs(offset) * 180, 0.05, 'triangle', 0.045);
    this.chispas(0x38bdf8).emitParticleAt(bola.x, bola.y + 10, 4);

    if (Math.abs(offset) > 0.78 && !this.dichos.borde) {
      this.dichos.borde = true;
      this.susurro(HISTORIA.consejos.borde, '#38bdf8', 2200);
      this.resonancia = Math.min(100, this.resonancia + 12);
      this.actualizarHud();
    }
  }

  golpeLadrillo(bola, ladrillo) {
    if (!ladrillo.active || !bola.active || this.transicion) return;

    const ahora = this.time.now;
    if (ladrillo.ultimoGolpe && ahora - ladrillo.ultimoGolpe < 90) return;
    ladrillo.ultimoGolpe = ahora;

    const x = ladrillo.x, y = ladrillo.y, color = ladrillo.color;
    ladrillo.vida--;
    this.chispas(color).emitParticleAt(x, y, ladrillo.esFoton ? 30 : 7);

    if (ladrillo.vida > 0) {
      ladrillo.setAlpha(0.45);
      Sonido.tono(200, 0.05, 'square', 0.04);
      this.cameras.main.shake(60, 0.002);
      if (!this.dichos.doble) {
        this.dichos.doble = true;
        this.susurro(HISTORIA.consejos.doble, '#a78bfa', 2200);
      }
      return;
    }

    this.puntos += 10 * this.combo;
    this.combo = Math.min(this.combo + 1, 5);
    this.comboMax = Math.max(this.comboMax, this.combo);
    this.destruidos++;
    this.rotos++;
    this.resonancia = Math.min(100, this.resonancia + 6);
    const eraFoton = ladrillo.esFoton;
    ladrillo.destroy();

    Sonido.tono(420 + this.combo * 55, 0.06, 'square', 0.05);
    this.cameras.main.shake(70, 0.003);

    if (this.combo >= 3 && !this.dichos.combo) {
      this.dichos.combo = true;
      this.susurro(HISTORIA.consejos.combo + this.combo, '#ffd93d', 2000);
    }

    if (eraFoton) { this.finalHueco(); return; }

    if (Math.random() < 0.14) this.soltarPowerUp(x, y);
    this.actualizarHud();
    if (this.ladrillos.countActive(true) === 0) this.nivelCompletado();
  }

  /* =========================================================
     PULSO DE RESONANCIA — nueva mecánica ligada al lore
     ========================================================= */
  pulsoResonancia() {
    if (this.pausado || this.transicion || this.finalizado) return;
    if (this.resonancia < 25) return;
    if (this.ultimoPulso && this.time.now - this.ultimoPulso < 350) return;
    this.ultimoPulso = this.time.now;
    this.resonancia -= 25;

    const onda = this.add.circle(this.paleta.x, this.paleta.y, 30, 0xa78bfa, 0.28)
      .setDepth(19).setStrokeStyle(2, 0xa78bfa, 0.8);
    this.tweens.add({
      targets: onda, radius: 135, alpha: 0, duration: 420,
      onComplete: () => onda.destroy()
    });

    this.bolas.getChildren().forEach((b) => {
      if (!b.active || b.body.velocity.length() < 1) return;
      if (Phaser.Math.Distance.Between(b.x, b.y, this.paleta.x, this.paleta.y) > 180) return;
      const dir = b.x < this.paleta.x ? -1 : 1;
      const v = b.body.velocity;
      const modulo = v.length();
      const nv = new Phaser.Math.Vector2(v.x + dir * 85, v.y).normalize().scale(modulo);
      b.body.setVelocity(nv.x, nv.y);
    });

    Sonido.tono(520, 0.12, 'sine', 0.045);
    if (!this.dichos.resonancia) {
      this.dichos.resonancia = true;
      this.susurro(HISTORIA.consejos.resonancia, '#a78bfa', 2400);
    }
    this.actualizarHud();
  }

  /* =========================================================
     POWER-UPS
     ========================================================= */
  soltarPowerUp(x, y) {
    const sorteo = Math.random();
    let tipo = 'ancho';
    if (sorteo > 0.35) tipo = 'multi';
    if (sorteo > 0.85) tipo = 'vida';
    const pw = this.powerups.create(x, y, `pw_${tipo}`);
    pw.setDepth(15);
    pw.tipo = tipo;
    pw.body.setAllowGravity(false);
    pw.body.setVelocityY(165);
    pw.setTint(tipo === 'ancho' ? 0x38bdf8 : tipo === 'multi' ? 0xa78bfa : 0x4ade80);
    this.tweens.add({ targets: pw, angle: 360, duration: 2000, repeat: -1 });
  }

  recogerPowerUp(paleta, pw) {
    if (!pw.active) return;
    const tipo = pw.tipo;
    pw.destroy();
    Sonido.arpegio([784, 988], 60);
    if (tipo === 'ancho') {
      this.paleta.setScale(1.45, 1);
      if (this.temporizadorAncho) this.temporizadorAncho.remove();
      this.temporizadorAncho = this.time.delayedCall(9000, () => this.paleta.setScale(1, 1));
      this.mostrarAviso('PALETA ANCHA', '#38bdf8', 900);
    } else if (tipo === 'multi') {
      this.multibola();
      this.mostrarAviso('MULTIBOLA', '#a78bfa', 900);
    } else {
      this.vidas = Math.min(this.vidas + 1, TABLERO.VIDAS_MAX);
      this.actualizarHud();
      this.mostrarAviso('VIDA EXTRA', '#4ade80', 900);
    }
  }

  multibola() {
    const base = this.bolas.getFirstAlive();
    if (!base) return;
    const dir = new Phaser.Math.Vector2(base.body.velocity.x, base.body.velocity.y);
    if (dir.length() < 1) dir.set(0, -1);
    const v = Math.max(dir.length(), this.velocidadBola());
    dir.normalize().scale(v);
    [-1, 1].forEach((signo) => {
      const nueva = this.crearBola(base.x, base.y);
      const d = dir.clone().rotate(signo * 0.55);
      nueva.body.setVelocity(d.x, d.y);
    });
  }

  /* =========================================================
     VIDAS Y FIN
     ========================================================= */
  perderVida() {
    this.vidas--;
    this.combo = 1;
    this.actualizarHud();
    this.cameras.main.shake(240, 0.012);
    Sonido.tono(150, 0.32, 'sawtooth', 0.06);
    if (this.vidas <= 0) { this.finPartida('derrota'); return; }
    this.resetBola();
  }

  estadisticas() {
    return {
      puntos: this.puntos,
      rotos: this.rotos,
      memoria: this.memoria,
      ecosOidos: this.ecosOidos.slice(),
      comboMax: this.comboMax,
      tiempo: Math.round(this.tiempo),
      vidas: this.vidas,
      nivel: this.nivel,
      gemasEncendidas: this.gemasEncendidas
    };
  }

  finPartida(tipo) {
    if (this.finalizado) return;
    this.finalizado = true;
    this.transicion = true;
    this.bolas.clear(true, true);
    this.physics.pause();
    const datos = this.estadisticas();
    this.time.delayedCall(500, () => {
      this.scene.start('Fin', { ...datos, tipo: tipo });
    });
  }

  /* =========================================================
     UTILIDADES DE ESCENA
     ========================================================= */
  chispas(color) {
    if (!this.emisoress[color]) {
      this.emisoress[color] = this.add.particles(0, 0, 'punto', {
        speed: { min: 60, max: 230 }, angle: { min: 0, max: 360 },
        lifespan: 420, scale: { start: 0.7, end: 0 },
        alpha: { start: 1, end: 0 }, tint: color, emitting: false
      }).setDepth(30);
    }
    return this.emisoress[color];
  }

  mostrarAviso(texto, color, duracion = 1400) {
    const t = this.add.text(TABLERO.ANCHO / 2, TABLERO.ALTO / 2 - 40, texto, {
      fontFamily: FUENTE, fontSize: '30px', color
    }).setOrigin(0.5).setDepth(250).setFontStyle('bold');
    t.setPadding(26, 20, 26, 20);
    t.setShadow(0, 0, color, 14, false, true);
    this.tweens.add({
      targets: t, alpha: 0, y: t.y - 26,
      delay: Math.max(duracion - 500, 200), duration: 500,
      onComplete: () => t.destroy()
    });
  }

  /* Susurro: la voz del mundo. Pequeño, diegético, nunca interrumpe. */
  susurro(texto, color = '#94a3b8', duracion = 2200) {
    if (this.finalizado) return;
    const t = this.add.text(TABLERO.ANCHO / 2, 130, texto, {
      fontFamily: FUENTE, fontSize: '13px', color,
      align: 'center', wordWrap: { width: 620 }
    }).setOrigin(0.5, 0).setDepth(140).setAlpha(0);
    this.tweens.add({
      targets: t, alpha: 0.95, duration: 350,
      yoyo: true, hold: duracion,
      onComplete: () => t.destroy()
    });
  }

  togglePausa() {
    if (this.transicion) return;
    this.pausado = !this.pausado;
    if (this.pausado) {
      this.physics.pause();
      this.overlayPausa.setVisible(true);
    } else {
      this.physics.resume();
      this.overlayPausa.setVisible(false);
    }
  }

  alternarSonido() {
    Sonido.activo = !Sonido.activo;
    const t = this.add.text(TABLERO.ANCHO / 2, 92, Sonido.activo ? 'SONIDO ON' : 'SONIDO OFF', {
      fontFamily: FUENTE, fontSize: '12px', color: '#94a3b8'
    }).setOrigin(0.5).setDepth(260);
    this.tweens.add({ targets: t, alpha: 0, delay: 500, duration: 400, onComplete: () => t.destroy() });
  }

  actualizarHud() {
    this.txtPuntos.setText(formatearPuntos(this.puntos));
    this.txtEtiqueta.setText(this.enNucleo ? 'CÁMARA FINAL' : 'SECTOR');
    this.txtSector.setText(this.enNucleo
      ? HISTORIA.nucleo.nombre
      : `SECTOR ${this.nivel + 1} · ${HISTORIA.sectores[this.nivel].nombre}`);
    this.txtCombo.setText(this.combo > 1 ? `COMBO x${this.combo}` : '');
    this.txtMemoria.setText(`◈ MEMORIA  ${this.memoria}/3   ·   BLOQUES ${this.rotos}`);
    this.iconosVida.forEach((ic, i) => ic.setVisible(i < this.vidas));
    this.gemas.forEach((g, i) => {
      const encendida = i < this.gemasEncendidas;
      g.setFillStyle(g.colorGema, encendida ? 0.95 : 0.18);
      g.setAlpha(encendida ? 1 : 0.55);
    });
    this.barraResonancia.setScale(Math.max(0.001, this.resonancia / 100), 1);
  }

  moverPaleta() {
    const izq = this.cursors.left.isDown || this.teclas.A.isDown;
    const der = this.cursors.right.isDown || this.teclas.D.isDown;
    if (izq) this.paleta.setVelocityX(-TABLERO.VEL_PALETA);
    else if (der) this.paleta.setVelocityX(TABLERO.VEL_PALETA);
    else this.paleta.setVelocityX(0);
  }

  /* =========================================================
     BUCLE
     ========================================================= */
  update(time, delta) {
    this.fondo.tilePositionY -= delta * 0.008;
    if (this.pausado || this.transicion || this.finalizado) return;

    this.tiempo += delta / 1000;

    if (this.paleta.y !== TABLERO.PALETA_Y) {
      this.paleta.y = TABLERO.PALETA_Y;
      this.paleta.body.velocity.y = 0;
    }
    this.moverPaleta();

    const primera = this.bolas.getFirstAlive();
    if (this.bolaPegada && primera) {
      primera.x = this.paleta.x;
      primera.y = this.paleta.y - 24;
      primera.body.setVelocity(0, 0);
    }

    // SECRETO: mantener R en el Núcleo
    if (this.enNucleo && this.inicioR && this.time.now - this.inicioR > 600) {
      this.inicioR = null;
      this.finalVerdadero();
      return;
    }

    let vivas = 0, cayo = false;
    this.bolas.getChildren().slice().forEach((bola) => {
      if (!bola.active) return;
      if (bola.y > TABLERO.ALTO + 30) { bola.destroy(); cayo = true; return; }
      if (bola.y < -60 || bola.x < -60 || bola.x > TABLERO.ANCHO + 60) { bola.destroy(); return; }
      const vy = bola.body.velocity.y;
      if (Math.abs(vy) < 45 && bola.body.velocity.length() > 0) {
        bola.body.velocity.y += vy >= 0 ? 70 : -70;
      }
      vivas++;
    });

    this.powerups.getChildren().slice().forEach((pw) => {
      if (pw.active && pw.y > TABLERO.ALTO + 30) pw.destroy();
    });

    // EL GIRO: aquello que todo el juego te castigó por hacer es la solución
    if (this.enNucleo && cayo && !this.bolaPegada) {
      this.finalVerdadero();
      return;
    }

    if (vivas === 0) {
      if (this.bolaPegada) this.resetBola();
      else this.perderVida();
    }
  }
}
