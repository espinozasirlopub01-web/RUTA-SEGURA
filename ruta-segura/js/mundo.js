/**
 * mundo.js — ESCENA ACTIVA (RS.Mundo)
 * ---------------------------------------------------------------
 * Construye la escena a partir de RS.Escenas, mueve a Leo, anima a las
 * entidades, aplica las reacciones de cada decisión y dibuja todo en
 * el lienzo. Solo pide gráficos por id (RS.crearSprite).
 *
 * Orden de dibujo: fondo → entidades de capa 'fondo' → marcador "!" →
 * Leo → entidades de capa 'frente' → transición (fade).
 */
(function (RS) {
  'use strict';

  var C = RS.Config;

  var fondo = null;
  var leo = null;
  var entidades = [];
  var marcador = null;
  var disparadorX = 0;
  var animCaminar = 'walk';
  var llegado = false;
  var alLlegar = null;
  var fade = { alpha: 1, desde: 1, hasta: 1, t: 0, activo: false, cb: null };

  /** Carga la escena del nodo `idEscena`. `callbackLlegada` se llama al llegar al evento. */
  function cargarEscena(idEscena, callbackLlegada) {
    var cfg = RS.Escenas[idEscena];
    if (!cfg) throw new Error('Escena no definida: ' + idEscena);

    fondo = RS.crearSprite(cfg.fondo);
    leo = { sprite: RS.crearSprite('leo'), x: cfg.leo.x, y: C.SUELO_Y, volteo: false };
    leo.sprite.reproducir('idle');
    animCaminar = cfg.leo.anim || 'walk';
    disparadorX = cfg.leo.disparadorX;

    entidades = cfg.entidades.map(function (e) {
      var ent = {
        id: e.id,
        cfg: e,
        sprite: RS.crearSprite(e.sprite),
        x: e.x,
        y: (e.y != null) ? e.y : C.SUELO_Y,
        volteo: !!e.volteo,
        vx: 0,
        detenido: false
      };
      if (e.anim) ent.sprite.reproducir(e.anim);
      return ent;
    });

    marcador = RS.crearSprite('marcador_evento');
    llegado = false;
    alLlegar = callbackLlegada;
    fade.alpha = 1;   // la escena nueva empieza en negro; fadeEntrada la revela
  }

  function buscarEntidad(id) {
    for (var i = 0; i < entidades.length; i++) if (entidades[i].id === id) return entidades[i];
    return null;
  }

  /** Aplica la reacción visual de una decisión: { leo: 'scared', entidades: [...] }. */
  function reaccionar(reaccion) {
    if (!reaccion) return;
    if (reaccion.leo) leo.sprite.reproducir(reaccion.leo, true);
    (reaccion.entidades || []).forEach(function (r) {
      var e = buscarEntidad(r.id);
      if (!e) return;
      e.detenido = true;                       // deja de seguir a Leo
      e.vx = r.vx || 0;
      if (e.vx !== 0) e.volteo = e.vx < 0;
      if (r.anim) e.sprite.reproducir(r.anim);
    });
  }

  function actualizarEntidad(e, dt) {
    var s = e.cfg.sigue;
    if (s && !e.detenido) {
      var meta = leo.x - s.distancia;
      if (e.x < meta - 1) { e.x += s.velocidad * dt; e.sprite.reproducir('walk'); }
      else e.sprite.reproducir('idle');
    }
    if (e.vx) e.x += e.vx * dt;
    e.sprite.actualizar(dt);
  }

  function actualizarFade(dt) {
    if (!fade.activo) return;
    fade.t += dt;
    var p = Math.min(1, fade.t / C.DURACION_FADE);
    fade.alpha = fade.desde + (fade.hasta - fade.desde) * p;
    if (p >= 1) {
      fade.activo = false;
      var cb = fade.cb;
      fade.cb = null;
      if (cb) cb();
    }
  }

  function iniciarFade(desde, hasta, cb) {
    fade.desde = desde; fade.hasta = hasta; fade.t = 0; fade.activo = true; fade.cb = cb || null;
    fade.alpha = desde;
  }

  /** dt en segundos; entrada { izq, der }; puedeCaminar: el jugador controla a Leo. */
  function actualizar(dt, entrada, puedeCaminar) {
    if (!leo) return;

    if (puedeCaminar && !llegado) {
      var dir = (entrada.der ? 1 : 0) - (entrada.izq ? 1 : 0);
      if (dir !== 0) {
        leo.x = Math.max(C.LIMITE_IZQUIERDO, leo.x + dir * C.VELOCIDAD_LEO * dt);
        leo.volteo = dir < 0;
        leo.sprite.reproducir(animCaminar);
      } else {
        leo.sprite.reproducir('idle');
      }
      if (leo.x >= disparadorX) {
        leo.x = disparadorX;
        leo.volteo = false;
        llegado = true;
        leo.sprite.reproducir('idle');
        if (alLlegar) alLlegar();
      }
    }

    leo.sprite.actualizar(dt);
    marcador.actualizar(dt);
    for (var i = 0; i < entidades.length; i++) actualizarEntidad(entidades[i], dt);
    actualizarFade(dt);
  }

  function dibujar(ctx) {
    ctx.clearRect(0, 0, C.ANCHO, C.ALTO);
    if (!leo) {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, C.ANCHO, C.ALTO);
      return;
    }

    fondo.dibujar(ctx, 0, 0);

    entidades.forEach(function (e) {
      if (e.cfg.capa !== 'frente') e.sprite.dibujar(ctx, e.x, e.y, { volteo: e.volteo });
    });

    if (!llegado) marcador.dibujar(ctx, disparadorX, C.SUELO_Y - 70);

    leo.sprite.dibujar(ctx, leo.x, leo.y, { volteo: leo.volteo });

    entidades.forEach(function (e) {
      if (e.cfg.capa === 'frente') e.sprite.dibujar(ctx, e.x, e.y, { volteo: e.volteo });
    });

    if (C.DEBUG) {
      ctx.strokeStyle = '#FF00AA';
      ctx.beginPath();
      ctx.moveTo(disparadorX + 0.5, 0);
      ctx.lineTo(disparadorX + 0.5, C.ALTO);
      ctx.moveTo(0, C.SUELO_Y + 0.5);
      ctx.lineTo(C.ANCHO, C.SUELO_Y + 0.5);
      ctx.stroke();
    }

    if (fade.alpha > 0) {
      ctx.fillStyle = 'rgba(0,0,0,' + fade.alpha + ')';
      ctx.fillRect(0, 0, C.ANCHO, C.ALTO);
    }
  }

  RS.Mundo = {
    cargarEscena: cargarEscena,
    actualizar: actualizar,
    dibujar: dibujar,
    reaccionar: reaccionar,
    fadeEntrada: function (cb) { iniciarFade(1, 0, cb); },
    fadeSalida: function (cb) { iniciarFade(fade.alpha, 1, cb); }
  };

})(window.RS = window.RS || {});
