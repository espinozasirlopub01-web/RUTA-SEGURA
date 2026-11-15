/**
 * loader.js — CARGADOR DE GRÁFICOS (RS.Assets)
 * ---------------------------------------------------------------
 * Carga todas las imágenes definidas en RS.Catalogo.
 *
 *  - Si el archivo PNG existe, lo usa (así entran tus ilustraciones).
 *  - Si el archivo NO existe o falla, genera automáticamente un
 *    marcador temporal (placeholder) con el mismo tamaño y número de
 *    cuadros, de modo que el juego siempre es jugable.
 *  - Valida que las proporciones del PNG coincidan con el catálogo y
 *    avisa por consola si algo no cuadra.
 *
 * El resto del juego NUNCA toca rutas de archivos: pide imágenes por id
 * (RS.Assets.obtener('leo')) o por URL para el HTML (RS.Assets.url(id)).
 */
(function (RS) {
  'use strict';

  var cargadas = {};      // id -> { fuente, esPlaceholder, url }
  var advertencias = [];  // mensajes de validación de dimensiones

  function rutaCompleta(def) {
    return RS.Catalogo.RUTA_BASE + def.ruta;
  }

  /* ---------- Generación de marcadores temporales ---------- */

  function oscurecer(g, x, y, w, h, alfa) {
    g.fillStyle = 'rgba(0,0,0,' + alfa + ')';
    g.fillRect(x, y, w, h);
  }

  function texto(g, str, x, y, tam, color) {
    g.fillStyle = color || '#FFFFFF';
    g.font = 'bold ' + tam + 'px monospace';
    g.textAlign = 'center';
    g.fillText(str, x, y);
  }

  function dibujarCuadro(g, id, def, i) {
    var x0 = i * def.frameAncho, w = def.frameAncho, h = def.frameAlto;
    var c = def.color || '#888888', cx = x0 + w / 2;

    g.save();
    g.beginPath();
    g.rect(x0, 0, w, h);
    g.clip();

    if (def.tipo === 'fondo' || def.tipo === 'final') {
      g.fillStyle = c;
      g.fillRect(x0, 0, w, h);
      oscurecer(g, x0, Math.round(h * 0.55), w, Math.round(h * 0.45), 0.25);
      if (def.tipo === 'fondo') {
        g.fillStyle = '#4A4E57';
        g.fillRect(x0, RS.Config.SUELO_Y, w, h - RS.Config.SUELO_Y);
        g.fillStyle = '#C9C2B2';
        g.fillRect(x0, RS.Config.SUELO_Y, w, 6);
      }
      var tam = def.tipo === 'fondo' ? 20 : 14;
      texto(g, 'TEMPORAL', cx, Math.round(h * 0.36), tam);
      texto(g, id, cx, Math.round(h * 0.36) + tam + 6, Math.round(tam * 0.7));
      texto(g, w + ' x ' + h, cx, Math.round(h * 0.36) + tam * 2 + 10, Math.round(tam * 0.7));
    } else if (def.tipo === 'personaje') {
      var cabeza = Math.round(h * 0.25), cuerpo = Math.round(h * 0.38);
      var piernas = h - cabeza - cuerpo - 2, mov = (i % 2) * 2;
      g.fillStyle = '#F1C27D';
      g.fillRect(Math.round(cx - cabeza / 2), 2, cabeza, cabeza);
      g.fillStyle = c;
      g.fillRect(Math.round(cx - w * 0.3), 2 + cabeza, Math.round(w * 0.6), cuerpo);
      g.fillStyle = '#2D3A4A';
      g.fillRect(Math.round(cx - w * 0.25 + mov), 2 + cabeza + cuerpo, Math.round(w * 0.2), piernas);
      g.fillRect(Math.round(cx + w * 0.05 - mov), 2 + cabeza + cuerpo, Math.round(w * 0.2), piernas);
      texto(g, String(i), cx, 2 + cabeza + Math.round(cuerpo * 0.65), 8);
    } else {
      // objeto o icono
      g.fillStyle = c;
      g.fillRect(x0, 0, w, h);
      g.strokeStyle = 'rgba(255,255,255,0.7)';
      g.strokeRect(x0 + 0.5, 0.5, w - 1, h - 1);
      var etiqueta = (def.tipo === 'icono') ? id.slice(-3) : id.slice(0, Math.max(3, Math.floor(w / 6)));
      texto(g, etiqueta, cx, Math.round(h / 2) + 3, 8);
      if (def.frames > 1) texto(g, String(i), cx, h - 3, 7);
    }

    // marco para ver los límites exactos del cuadro
    g.strokeStyle = 'rgba(255,255,255,0.55)';
    g.strokeRect(x0 + 0.5, 0.5, w - 1, h - 1);
    g.restore();
  }

  function crearPlaceholder(id, def) {
    var lienzo = document.createElement('canvas');
    lienzo.width = def.frameAncho * def.frames;
    lienzo.height = def.frameAlto;
    var g = lienzo.getContext('2d');
    for (var i = 0; i < def.frames; i++) dibujarCuadro(g, id, def, i);
    return { fuente: lienzo, esPlaceholder: true, url: lienzo.toDataURL('image/png') };
  }

  /* ---------- Validación de las ilustraciones reales ---------- */

  function validar(id, def, img) {
    var w = img.naturalWidth || img.width, h = img.naturalHeight || img.height;
    var escalaX = w / (def.frameAncho * def.frames);
    var escalaY = h / def.frameAlto;
    var coincide = Math.abs(escalaX - escalaY) < 0.001 && escalaX >= 1 && escalaX === Math.floor(escalaX);
    if (!coincide) {
      var msg = '[Gráficos] "' + id + '" mide ' + w + 'x' + h + ' px y se esperaba ' +
        (def.frameAncho * def.frames) + 'x' + def.frameAlto + ' px (o un múltiplo entero). ' +
        'Revisa las medidas en ' + def.ruta + '.';
      advertencias.push(msg);
      if (window.console) console.warn(msg);
    }
  }

  /* ---------- Carga ---------- */

  function cargarUno(id, def) {
    return new Promise(function (resolver) {
      var img = new Image();
      img.onload = function () {
        cargadas[id] = { fuente: img, esPlaceholder: false, url: rutaCompleta(def) };
        validar(id, def, img);
        resolver();
      };
      img.onerror = function () {
        cargadas[id] = crearPlaceholder(id, def);
        resolver();
      };
      img.src = rutaCompleta(def);
    });
  }

  function cargarTodo() {
    var recursos = RS.Catalogo.recursos;
    var tareas = Object.keys(recursos).map(function (id) { return cargarUno(id, recursos[id]); });
    return Promise.all(tareas).then(function () {
      var r = reporte();
      var temporales = r.filter(function (x) { return x.estado === 'TEMPORAL'; }).length;
      if (window.console) {
        console.info('[Ruta Segura] Gráficos: ' + (r.length - temporales) + ' definitivos, ' +
          temporales + ' temporales (de ' + r.length + ').');
      }
      return r;
    });
  }

  /** Imagen (o canvas) lista para drawImage. Si no se cargó, crea el temporal al vuelo. */
  function obtener(id) {
    if (!cargadas[id]) {
      var def = RS.Catalogo.recursos[id];
      if (!def) throw new Error('Recurso gráfico no definido en el catálogo: ' + id);
      cargadas[id] = crearPlaceholder(id, def);
    }
    return cargadas[id];
  }

  /** URL utilizable en <img src> del HTML (archivo real o imagen temporal en base64). */
  function url(id) {
    return obtener(id).url;
  }

  function reporte() {
    var recursos = RS.Catalogo.recursos;
    return Object.keys(recursos).map(function (id) {
      var e = cargadas[id];
      return { id: id, ruta: recursos[id].ruta, estado: (!e || e.esPlaceholder) ? 'TEMPORAL' : 'DEFINITIVO' };
    });
  }

  RS.Assets = {
    cargarTodo: cargarTodo,
    obtener: obtener,
    url: url,
    reporte: reporte,
    advertencias: advertencias
  };

})(window.RS = window.RS || {});
