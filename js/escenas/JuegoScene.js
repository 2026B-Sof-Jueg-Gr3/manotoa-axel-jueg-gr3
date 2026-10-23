/* =========================================================
   JuegoScene — el corazón del juego
   ---------------------------------------------------------
   · Paleta: teclado (← → / A D) o mouse
   · Bola: rebote con ángulo según el punto de impacto
   · Ladrillos: 3 niveles, algunos aguantan 2 golpes
   · Power-ups: paleta ancha, multibola, vida extra
   ========================================================= */
class JuegoScene extends Phaser.Scene {
  constructor() {
    super('Juego');
  }

  create() {
    // --- estado ---
    this.nivel = 0;
    this.puntos = 0;
    this.vidas = TABLERO.VIDAS;
    this.combo = 1;
    this.destruidos = 0;
    this.pausado = false;
    this.transicion = false;
    this.bolaPegada = true;
    this.velBase = NIVELES[0].velocidad;

    // Límites del mundo: rebote arriba, izquierda y derecha; abajo NO
    this.physics.world.setBounds(0, 0, TABLERO.ANCHO, TABLERO.ALTO, true, true, true, false);

    this.crearFondo();
    this.crearPaleta();

    this.bolas = this.physics.add.group();
    this.powerups = this.physics.add.group();
    this.ladrillos = this.physics.add.staticGroup();
    this.emisoress = {};

    this.crearHud();
    this.construirNivel();
    this.crearControles();

    // Colisiones
    this.physics.add.collider(this.bolas, this.ladrillos, this.golpeLadrillo, null, this);
    this.physics.add.collider(this.bolas, this.paleta, this.golpePaleta, null, this);
    this.physics.add.overlap(this.paleta, this.powerups, this.recogerPowerUp, null, this);

    this.resetBola();
    this.actualizarHud();
    this.mostrarAviso(`NIVEL ${this.nivel + 1} · ${NIVELES[this.nivel].nombre}`, '#38bdf8');
  }

  /* =========================================================
     MONTAJE
     ========================================================= */
  crearFondo() {
    this.fondo = this.add.tileSprite(0, 0, TABLERO.ANCHO, TABLERO.ALTO, 'fondo')
      .setOrigin(0, 0)
      .setDepth(0);

    const g = this.add.graphics().setDepth(1);
    g.lineStyle(1, 0x1e293b, 0.35);
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

    this.add.text(TABLERO.ANCHO / 2, 12, 'NIVEL', {
      ...estilo, fontSize: '10px', color: '#475569'
    }).setOrigin(0.5, 0).setDepth(100);
    this.txtNivel = this.add.text(TABLERO.ANCHO / 2, 26, '', {
      ...estilo, fontSize: '16px', color: '#38bdf8'
    }).setOrigin(0.5, 0).setDepth(100).setFontStyle('bold');

    this.add.text(TABLERO.ANCHO - 22, 12, 'VIDAS', {
      ...estilo, fontSize: '10px', color: '#475569'
    }).setOrigin(1, 0).setDepth(100);

    this.iconosVida = [];
    for (let i = 0; i < TABLERO.VIDAS_MAX; i++) {
      const ic = this.add.rectangle(TABLERO.ANCHO - 30 - i * 20, 42, 14, 14, 0xff4d6d)
        .setDepth(100)
        .setStrokeStyle(1, 0xff8fa3, 0.8);
      this.iconosVida.push(ic);
    }

    // Cartel de pausa (oculto)
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
    this.teclas = this.input.keyboard.addKeys('A,D');

    this.input.keyboard.on('keydown-SPACE', () => this.lanzar());
    this.input.keyboard.on('keydown-P', () => this.togglePausa());
    this.input.keyboard.on('keydown-ESC', () => this.togglePausa());
    this.input.keyboard.on('keydown-M', () => this.alternarSonido());
    this.input.on('pointerdown', () => this.lanzar());
    this.input.on('pointermove', (p) => {
      if (this.pausado || this.transicion) return;
      // getWorldPoint es seguro aunque la cámara se mueva o el lienzo esté escalado
      const x = this.cameras.main.getWorldPoint(p.x, p.y).x;
      if (!Number.isFinite(x)) return;
      const mitad = this.paleta.displayWidth / 2;
      this.paleta.x = Phaser.Math.Clamp(x, mitad, TABLERO.ANCHO - mitad);
    });
  }

  /* =========================================================
     NIVEL
     ========================================================= */
  construirNivel() {
    const cfg = NIVELES[this.nivel];
    this.ladrillos.clear(true, true);
    this.velBase = cfg.velocidad;
    this.destruidos = 0;

    const paso = TABLERO.ANCHO_LADRILLO + TABLERO.HUECO;
    for (let f = 0; f < cfg.filas; f++) {
      for (let c = 0; c < TABLERO.COLUMNAS; c++) {
        if (!cfg.patron(f, c, cfg.filas, TABLERO.COLUMNAS)) continue;

        const x = TABLERO.MARGEN_X + c * paso + TABLERO.ANCHO_LADRILLO / 2;
        const y = TABLERO.Y_INICIO + f * (TABLERO.ALTO_LADRILLO + TABLERO.HUECO) + TABLERO.ALTO_LADRILLO / 2;
        const color = cfg.colores[f % cfg.colores.length];

        const ladrillo = this.ladrillos.create(x, y, 'ladrillo');
        ladrillo.setTint(color);
        ladrillo.setDepth(10);
        ladrillo.vida = cfg.dureza(f);
        ladrillo.color = color;
      }
    }
  }

  nivelCompletado() {
    this.transicion = true;
    this.puntos += 100;
    this.bolas.clear(true, true);
    this.powerups.clear(true, true);
    this.actualizarHud();
    this.mostrarAviso('¡NIVEL COMPLETADO!', '#4ade80');
    Sonido.arpegio([523, 659, 784, 1046]);

    this.time.delayedCall(1500, () => {
      if (this.nivel + 1 >= NIVELES.length) {
        this.finPartida(true);
        return;
      }
      this.nivel++;
      this.construirNivel();
      this.resetBola();
      this.actualizarHud();
      this.transicion = false;
      this.mostrarAviso(`NIVEL ${this.nivel + 1} · ${NIVELES[this.nivel].nombre}`, '#38bdf8');
    });
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

    // El ángulo de salida depende de dónde golpea la paleta
    const mitad = paleta.displayWidth / 2;
    const offset = Phaser.Math.Clamp((bola.x - paleta.x) / mitad, -1, 1);
    const ang = offset * Phaser.Math.DegToRad(60);
    const v = Math.max(bola.body.velocity.length(), this.velocidadBola());

    bola.body.setVelocity(Math.sin(ang) * v, -Math.cos(ang) * v);
    bola.y = paleta.y - paleta.displayHeight / 2 - 11;

    this.combo = 1;
    Sonido.tono(300 + Math.abs(offset) * 180, 0.05, 'triangle', 0.045);
    this.chispas(0x38bdf8).emitParticleAt(bola.x, bola.y + 10, 4);
  }

  golpeLadrillo(bola, ladrillo) {
    if (!ladrillo.active || !bola.active) return;

    // Un mismo impacto puede avisar dos veces (separación en X y en Y):
    // se ignora cualquier golpe repetido dentro de los 90 ms siguientes.
    const ahora = this.time.now;
    if (ladrillo.ultimoGolpe && ahora - ladrillo.ultimoGolpe < 90) return;
    ladrillo.ultimoGolpe = ahora;

    const x = ladrillo.x;
    const y = ladrillo.y;
    const color = ladrillo.color;
    ladrillo.vida--;

    this.chispas(color).emitParticleAt(x, y, 7);

    if (ladrillo.vida > 0) {
      ladrillo.setAlpha(0.45);
      Sonido.tono(200, 0.05, 'square', 0.04);
      this.cameras.main.shake(60, 0.002);
      return;
    }

    this.puntos += 10 * this.combo;
    this.combo = Math.min(this.combo + 1, 5);
    this.destruidos++;
    ladrillo.destroy();

    Sonido.tono(420 + this.combo * 55, 0.06, 'square', 0.05);
    this.cameras.main.shake(70, 0.003);

    if (Math.random() < 0.14) this.soltarPowerUp(x, y);
    this.actualizarHud();

    if (this.ladrillos.countActive(true) === 0) this.nivelCompletado();
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

    let dir = new Phaser.Math.Vector2(base.body.velocity.x, base.body.velocity.y);
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

    if (this.vidas <= 0) {
      this.finPartida(false);
      return;
    }
    this.resetBola();
  }

  finPartida(victoria) {
    if (this.finalizado) return;
    this.finalizado = true;
    this.transicion = true;
    this.bolas.clear(true, true);
    this.physics.pause();

    if (victoria) Sonido.arpegio([523, 659, 784, 1046, 1318], 110);

    this.time.delayedCall(500, () => {
      this.scene.start('Fin', {
        puntos: this.puntos,
        nivel: this.nivel + 1,
        victoria: victoria
      });
    });
  }

  /* =========================================================
     UTILIDADES DE ESCENA
     ========================================================= */
  chispas(color) {
    if (!this.emisoress[color]) {
      this.emisoress[color] = this.add.particles(0, 0, 'punto', {
        speed: { min: 60, max: 230 },
        angle: { min: 0, max: 360 },
        lifespan: 420,
        scale: { start: 0.7, end: 0 },
        alpha: { start: 1, end: 0 },
        tint: color,
        emitting: false
      }).setDepth(30);
    }
    return this.emisoress[color];
  }

  mostrarAviso(texto, color, duracion = 1400) {
    const t = this.add.text(TABLERO.ANCHO / 2, TABLERO.ALTO / 2 - 40, texto, {
      fontFamily: FUENTE, fontSize: '34px', color
    }).setOrigin(0.5).setDepth(250).setFontStyle('bold');
    t.setPadding(26, 20, 26, 20);
    t.setShadow(0, 0, color, 14, false, true);

    this.tweens.add({
      targets: t,
      alpha: 0,
      y: t.y - 26,
      delay: Math.max(duracion - 500, 200),
      duration: 500,
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
    this.txtNivel.setText(`NIVEL ${this.nivel + 1} · ${NIVELES[this.nivel].nombre}`);
    this.txtCombo.setText(this.combo > 1 ? `COMBO x${this.combo}` : '');
    this.iconosVida.forEach((ic, i) => ic.setVisible(i < this.vidas));
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

    if (this.pausado || this.transicion) return;

    // La paleta solo se mueve en horizontal: se ancla a su altura
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

    let vivas = 0;
    this.bolas.getChildren().slice().forEach((bola) => {
      if (!bola.active) return;

      // Cayó por el hueco de abajo
      if (bola.y > TABLERO.ALTO + 30) {
        bola.destroy();
        return;
      }

      // Red de seguridad: si una bola se escapa del tablero, se descarta
      if (bola.y < -60 || bola.x < -60 || bola.x > TABLERO.ANCHO + 60) {
        bola.destroy();
        return;
      }

      // Evita trayectorias casi horizontales infinitas
      const vy = bola.body.velocity.y;
      if (Math.abs(vy) < 45 && bola.body.velocity.length() > 0) {
        bola.body.velocity.y += vy >= 0 ? 70 : -70;
      }
      vivas++;
    });

    // Los power-ups que se escapan se descartan
    this.powerups.getChildren().slice().forEach((pw) => {
      if (pw.active && pw.y > TABLERO.ALTO + 30) pw.destroy();
    });

    if (vivas === 0) {
      // Sin bolas: o se perdió la vida o hay que reponer la bola pegada
      if (this.bolaPegada) this.resetBola();
      else this.perderVida();
    }
  }
}
