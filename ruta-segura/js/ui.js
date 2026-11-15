/**
 * ui.js — INTERFAZ DE USUARIO EN HTML (RS.UI)
 * ---------------------------------------------------------------
 * Maneja todo lo que NO se dibuja en el lienzo: HUD, panel de
 * decisión, retroalimentación, pantalla de título y pantalla final.
 * Los íconos se obtienen del catálogo (RS.Assets.url), de modo que
 * también se reemplazan solo con cambiar los PNG.
 */
(function (RS) {
  'use strict';

  var C = RS.Config;
  var el = {};
  var cbContinuar = null;

  var IDS = [
    'juego', 'hud-fase', 'hud-decision', 'hud-celular', 'hud-seguridad-barra', 'hud-seguridad-valor',
    'panel-vacio', 'panel-decision', 'situacion', 'opciones', 'temporizador-barra',
    'panel-feedback', 'fb-titulo', 'fb-consecuencia', 'fb-explicacion', 'fb-seguridad', 'btn-continuar',
    'pantalla-titulo', 'aviso-graficos', 'btn-comenzar',
    'pantalla-final', 'final-imagen', 'final-titulo', 'final-estrellas', 'final-texto', 'final-mensaje',
    'final-resumen', 'final-cartilla', 'btn-reiniciar',
    'btn-izq', 'btn-der', 'panel-debug'
  ];

  function crear(etiqueta, clase, texto) {
    var n = document.createElement(etiqueta);
    if (clase) n.className = clase;
    if (texto != null) n.textContent = texto;
    return n;
  }

  /** manejadores: { onComenzar, onReiniciar, onContinuar, onMover(dir, activo) } */
  function iniciar(manejadores) {
    IDS.forEach(function (id) { el[id] = document.getElementById(id); });

    el['btn-comenzar'].addEventListener('click', manejadores.onComenzar);
    el['btn-reiniciar'].addEventListener('click', manejadores.onReiniciar);
    el['btn-continuar'].addEventListener('click', continuar);

    // Controles táctiles: mantener pulsado para caminar
    function enlazar(boton, dir) {
      ['pointerdown'].forEach(function (ev) {
        boton.addEventListener(ev, function (e) { e.preventDefault(); manejadores.onMover(dir, true); });
      });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) {
        boton.addEventListener(ev, function () { manejadores.onMover(dir, false); });
      });
    }
    enlazar(el['btn-izq'], -1);
    enlazar(el['btn-der'], 1);
  }

  /* ---------------- Título y final ---------------- */

  function mostrarTitulo() {
    el['pantalla-titulo'].style.backgroundImage = 'url("' + RS.Assets.url('bg_titulo') + '")';
    var r = RS.Assets.reporte();
    var temporales = r.filter(function (x) { return x.estado === 'TEMPORAL'; }).length;
    el['aviso-graficos'].textContent = temporales > 0
      ? 'Modo gráficos temporales: ' + temporales + ' de ' + r.length + ' recursos usan imágenes de prueba.'
      : 'Todos los gráficos definitivos están cargados.';
    el['pantalla-titulo'].hidden = false;
  }

  function ocultarTitulo() { el['pantalla-titulo'].hidden = true; }

  function setJugando(activo) { el['juego'].classList.toggle('jugando', !!activo); }

  function mostrarFinal(datos, onReiniciar) {
    var f = datos.final;
    el['pantalla-final'].style.backgroundImage = 'url("' + RS.Assets.url('bg_titulo') + '")';
    el['final-imagen'].src = RS.Assets.url(f.imagen);
    el['final-imagen'].alt = f.titulo;
    el['final-titulo'].textContent = f.titulo;
    el['final-texto'].textContent = f.texto;
    el['final-mensaje'].textContent = f.mensaje;

    el['final-estrellas'].innerHTML = '';
    for (var i = 1; i <= 3; i++) {
      var img = crear('img', 'estrella');
      img.src = RS.Assets.url(i <= f.estrellas ? 'icon_estrella_llena' : 'icon_estrella_vacia');
      img.alt = i <= f.estrellas ? 'Estrella obtenida' : 'Estrella no obtenida';
      el['final-estrellas'].appendChild(img);
    }

    el['final-resumen'].innerHTML = '';
    datos.estado.decisiones.forEach(function (d, idx) {
      var li = crear('li', d.riesgo === 0 ? 'seguro' : (d.riesgo >= 3 ? 'grave' : 'riesgo'));
      li.appendChild(crear('strong', null, (idx + 1) + '. ' + d.titulo));
      li.appendChild(crear('div', null, 'Elegiste: ' + d.elegida + (d.porTiempo ? ' (se agotó el tiempo)' : '')));
      if (d.riesgo > 0) li.appendChild(crear('div', 'mejor', 'Opción más segura: ' + d.mejor));
      el['final-resumen'].appendChild(li);
    });

    el['final-cartilla'].innerHTML = '';
    RS.Historia.cartilla.forEach(function (t) { el['final-cartilla'].appendChild(crear('li', null, t)); });

    el['pantalla-final'].hidden = false;
    el['pantalla-final'].scrollTop = 0;
    el['btn-reiniciar'].focus();
  }

  function ocultarFinal() { el['pantalla-final'].hidden = true; }

  /* ---------------- HUD ---------------- */

  function actualizarHUD(estado, nodo) {
    var fase = nodo.fase;
    el['hud-fase'].textContent = fase.charAt(0).toUpperCase() + fase.slice(1);
    el['hud-fase'].setAttribute('data-fase', fase);
    var n = Math.min(estado.numDecision + 1, RS.Historia.totalDecisiones);
    el['hud-decision'].textContent = 'Decisión ' + n + ' de ' + RS.Historia.totalDecisiones;
    el['hud-celular'].src = RS.Assets.url(estado.celular ? 'icon_celular_on' : 'icon_celular_off');
    el['hud-celular'].alt = estado.celular ? 'Conservas tu celular' : 'Perdiste tu celular';

    var s = RS.Estado.seguridad(estado);
    el['hud-seguridad-barra'].style.width = s + '%';
    el['hud-seguridad-barra'].className = s >= 70 ? 'alta' : (s >= 40 ? 'media' : 'baja');
    el['hud-seguridad-valor'].textContent = String(s);
  }

  /* ---------------- Paneles inferiores ---------------- */

  function ocultarPaneles() {
    el['panel-vacio'].hidden = true;
    el['panel-decision'].hidden = true;
    el['panel-feedback'].hidden = true;
  }

  function mostrarEspera() {
    ocultarPaneles();
    el['panel-vacio'].hidden = false;
  }

  /** Muestra la situación y las opciones; onElegir(indice) al pulsar o con las teclas 1-3. */
  function mostrarDecision(textoSituacion, opciones, onElegir) {
    ocultarPaneles();
    el['situacion'].textContent = textoSituacion;
    el['opciones'].innerHTML = '';
    opciones.forEach(function (op, i) {
      var b = crear('button', 'opcion');
      b.type = 'button';
      b.appendChild(crear('span', 'tecla', String(i + 1)));
      b.appendChild(document.createTextNode(' ' + op.texto));
      b.addEventListener('click', function () { onElegir(i); });
      el['opciones'].appendChild(b);
    });
    actualizarTemporizador(1);
    el['panel-decision'].hidden = false;
  }

  /** ratio de 1 (tiempo completo) a 0 (agotado). */
  function actualizarTemporizador(ratio) {
    el['temporizador-barra'].style.width = Math.round(ratio * 100) + '%';
    el['temporizador-barra'].className = ratio < 0.3 ? 'urgente' : '';
  }

  /** datos: { opcion, porTiempo, seguridadAntes, seguridadDespues } */
  function mostrarFeedback(datos, onContinuar) {
    ocultarPaneles();
    var r = datos.opcion.riesgo;
    var panel = el['panel-feedback'];
    panel.className = r === 0 ? 'seguro' : (r >= 3 ? 'grave' : 'riesgo');
    el['fb-titulo'].textContent = r === 0 ? 'Decisión segura' : (r >= 3 ? 'Decisión de alto riesgo' : 'Decisión con riesgo');
    el['fb-consecuencia'].textContent = datos.opcion.consecuencia +
      (datos.porTiempo ? ' (Se agotó el tiempo: se aplicó la opción de mayor riesgo.)' : '');
    el['fb-explicacion'].textContent = datos.opcion.explicacion;
    var delta = datos.seguridadAntes - datos.seguridadDespues;
    el['fb-seguridad'].textContent = delta > 0
      ? 'Seguridad: −' + delta + ' (' + datos.seguridadDespues + ' de ' + C.SEGURIDAD_MAXIMA + ')'
      : 'Seguridad sin cambios (' + datos.seguridadDespues + ' de ' + C.SEGURIDAD_MAXIMA + ')';
    cbContinuar = onContinuar;
    panel.hidden = false;
    el['btn-continuar'].focus();
  }

  function continuar() {
    if (!cbContinuar) return;
    var cb = cbContinuar;
    cbContinuar = null;
    cb();
  }

  /* ---------------- Depuración (F2) ---------------- */

  function mostrarDebug(visible) {
    var p = el['panel-debug'];
    p.hidden = !visible;
    if (!visible) return;
    p.innerHTML = '';
    p.appendChild(crear('strong', null, 'Gráficos (F2 para cerrar)'));
    RS.Assets.reporte().forEach(function (x) {
      var linea = crear('div', x.estado === 'TEMPORAL' ? 'temporal' : 'definitivo', x.estado + ' · ' + x.id + ' · ' + x.ruta);
      p.appendChild(linea);
    });
    RS.Assets.advertencias.forEach(function (m) { p.appendChild(crear('div', 'aviso', m)); });
  }

  RS.UI = {
    iniciar: iniciar,
    mostrarTitulo: mostrarTitulo,
    ocultarTitulo: ocultarTitulo,
    setJugando: setJugando,
    mostrarFinal: mostrarFinal,
    ocultarFinal: ocultarFinal,
    actualizarHUD: actualizarHUD,
    mostrarEspera: mostrarEspera,
    mostrarDecision: mostrarDecision,
    actualizarTemporizador: actualizarTemporizador,
    mostrarFeedback: mostrarFeedback,
    continuar: continuar,
    mostrarDebug: mostrarDebug
  };

})(window.RS = window.RS || {});
