/**
 * juego.js — PUNTO DE ENTRADA Y FLUJO DE LA PARTIDA (RS.Juego)
 * ---------------------------------------------------------------
 * Coordina los módulos: carga gráficos, maneja el teclado y los
 * controles táctiles, ejecuta el bucle de juego y controla las fases:
 *
 *   titulo → caminando → decision → feedback → transicion → … → final
 *
 * No contiene contenido narrativo (datos-historia.js) ni rutas de
 * imágenes (assets-manifest.js).
 */
(function (RS) {
  'use strict';

  var C = RS.Config;

  var ctx = null;
  var fase = 'cargando';
  var entrada = { izq: false, der: false };
  var tiempoRestante = 0;
  var opcionesActuales = [];
  var resultadoActual = null;
  var ultimoTs = 0;

  /* ---------- Validación de configuración (avisa por consola) ---------- */

  function validarConfiguracion() {
    var errores = [];
    var rec = RS.Catalogo.recursos;

    Object.keys(RS.Escenas).forEach(function (idEsc) {
      var esc = RS.Escenas[idEsc];
      if (!rec[esc.fondo]) errores.push('Escena ' + idEsc + ': fondo no definido "' + esc.fondo + '"');
      esc.entidades.forEach(function (e) {
        var d = rec[e.sprite];
        if (!d) errores.push('Escena ' + idEsc + ': sprite no definido "' + e.sprite + '"');
        else if (e.anim && !(d.animaciones && d.animaciones[e.anim])) {
          errores.push('Escena ' + idEsc + ': "' + e.sprite + '" no tiene la animación "' + e.anim + '"');
        }
      });
      if (!(rec.leo.animaciones[esc.leo.anim])) errores.push('Escena ' + idEsc + ': Leo no tiene la animación "' + esc.leo.anim + '"');
    });

    Object.keys(RS.Historia.nodos).forEach(function (id) {
      var n = RS.Historia.nodos[id];
      (n.opciones || []).forEach(function (o) {
        if (o.siguiente !== 'FIN' && !RS.Historia.nodos[o.siguiente]) errores.push('Nodo ' + id + ': siguiente inexistente "' + o.siguiente + '"');
        if (o.reaccion && o.reaccion.leo && !rec.leo.animaciones[o.reaccion.leo]) errores.push('Nodo ' + id + ': reacción de Leo inexistente "' + o.reaccion.leo + '"');
      });
    });

    errores.forEach(function (m) { if (window.console) console.error('[Configuración] ' + m); });
    return errores;
  }

  /* ---------- Flujo de partida ---------- */

  function comenzar() {
    RS.UI.ocultarTitulo();
    RS.UI.ocultarFinal();
    RS.Motor.nuevaPartida();
    RS.UI.setJugando(true);
    cargarNodoActual();
  }

  function cargarNodoActual() {
    var nodo = RS.Motor.nodoActual();
    fase = 'transicion';
    RS.Mundo.cargarEscena(nodo.id, alLlegarAlEvento);
    RS.UI.actualizarHUD(RS.Motor.estado(), nodo);
    RS.UI.mostrarEspera();
    RS.Mundo.fadeEntrada(function () { fase = 'caminando'; });
  }

  function alLlegarAlEvento() {
    fase = 'decision';
    opcionesActuales = RS.Motor.opciones();
    tiempoRestante = C.TIEMPO_DECISION;
    RS.UI.mostrarDecision(RS.Motor.situacion(), opcionesActuales, function (i) {
      elegir(opcionesActuales[i], false);
    });
  }

  function elegir(opcion, porTiempo) {
    if (fase !== 'decision') return;
    fase = 'feedback';
    var nodoRespondido = RS.Motor.nodoActual();
    resultadoActual = RS.Motor.elegir(opcion, porTiempo);
    RS.Mundo.reaccionar(opcion.reaccion);
    RS.UI.actualizarHUD(RS.Motor.estado(), nodoRespondido);
    RS.UI.mostrarFeedback(resultadoActual, continuar);
  }

  function continuar() {
    fase = 'transicion';
    RS.Mundo.fadeSalida(function () {
      if (resultadoActual.terminado) mostrarFinal();
      else cargarNodoActual();
    });
  }

  function mostrarFinal() {
    fase = 'final';
    RS.UI.setJugando(false);
    RS.UI.mostrarEspera();
    RS.UI.mostrarFinal({ final: RS.Motor.final(), estado: RS.Motor.estado() });
  }

  /* ---------- Entradas ---------- */

  function alternarDebug() {
    C.DEBUG = !C.DEBUG;
    RS.UI.mostrarDebug(C.DEBUG);
  }

  function registrarEntradas() {
    window.addEventListener('keydown', function (e) {
      var k = e.key;
      if (k === 'F2') { e.preventDefault(); alternarDebug(); return; }

      if (fase === 'caminando' || fase === 'transicion') {
        if (k === 'ArrowRight' || k === 'd' || k === 'D') { entrada.der = true; e.preventDefault(); }
        if (k === 'ArrowLeft' || k === 'a' || k === 'A') { entrada.izq = true; e.preventDefault(); }
      }
      if (fase === 'decision') {
        var n = parseInt(k, 10);
        if (n >= 1 && n <= opcionesActuales.length) elegir(opcionesActuales[n - 1], false);
      } else if (fase === 'feedback') {
        if (k === 'Enter' || k === ' ') { e.preventDefault(); RS.UI.continuar(); }
      }
    });

    window.addEventListener('keyup', function (e) {
      var k = e.key;
      if (k === 'ArrowRight' || k === 'd' || k === 'D') entrada.der = false;
      if (k === 'ArrowLeft' || k === 'a' || k === 'A') entrada.izq = false;
    });
  }

  /* ---------- Bucle ---------- */

  function bucle(ts) {
    var dt = Math.min(0.05, ((ts - ultimoTs) / 1000) || 0);
    ultimoTs = ts;

    if (fase === 'decision') {
      tiempoRestante -= dt;
      RS.UI.actualizarTemporizador(Math.max(0, tiempoRestante) / C.TIEMPO_DECISION);
      if (tiempoRestante <= 0) elegir(RS.Motor.peorOpcion(), true);
    }

    RS.Mundo.actualizar(dt, entrada, fase === 'caminando');
    RS.Mundo.dibujar(ctx);
    window.requestAnimationFrame(bucle);
  }

  /* ---------- Arranque ---------- */

  function iniciar() {
    var lienzo = document.getElementById('lienzo');
    lienzo.width = C.ANCHO;
    lienzo.height = C.ALTO;
    ctx = lienzo.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    validarConfiguracion();

    RS.UI.iniciar({
      onComenzar: comenzar,
      onReiniciar: comenzar,
      onMover: function (dir, activo) {
        if (dir > 0) entrada.der = activo; else entrada.izq = activo;
      }
    });
    registrarEntradas();

    RS.Assets.cargarTodo().then(function () {
      fase = 'titulo';
      RS.UI.mostrarTitulo();
      window.requestAnimationFrame(bucle);
    });
  }

  RS.Juego = { iniciar: iniciar, validarConfiguracion: validarConfiguracion };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();

})(window.RS = window.RS || {});
