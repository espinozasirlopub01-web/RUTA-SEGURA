/**
 * historia.js — MOTOR DE RAMIFICACIONES (RS.Motor)
 * ---------------------------------------------------------------
 * Conduce la partida: resuelve el nodo actual (incluidas variantes),
 * entrega las opciones, aplica sus efectos y avanza al nodo siguiente.
 * No dibuja nada ni conoce el DOM.
 */
(function (RS) {
  'use strict';

  var C = RS.Config;
  var estado = null;
  var nodoCache = null;
  var opcionesCache = null;

  function mezclar(lista) {
    for (var i = lista.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = lista[i]; lista[i] = lista[j]; lista[j] = t;
    }
    return lista;
  }

  function nuevaPartida() {
    estado = RS.Estado.nuevo();
    nodoCache = null;
    opcionesCache = null;
    return estado;
  }

  /** Resuelve un id a su nodo real (aplicando `variante` si existe). */
  function resolverNodo(id) {
    var nodo = RS.Historia.nodos[id];
    if (!nodo) throw new Error('Nodo inexistente: ' + id);
    if (nodo.variante) return resolverNodo(nodo.variante(estado));
    return nodo;
  }

  function nodoActual() {
    if (!nodoCache) nodoCache = resolverNodo(estado.nodoId);
    return nodoCache;
  }

  function situacion() {
    var s = nodoActual().situacion;
    return typeof s === 'function' ? s(estado) : s;
  }

  /** Opciones del nodo actual (el orden se mezcla una vez por nodo). */
  function opciones() {
    if (!opcionesCache) {
      var lista = nodoActual().opciones.slice();
      opcionesCache = C.ALEATORIZAR_OPCIONES ? mezclar(lista) : lista;
    }
    return opcionesCache;
  }

  function mejorOpcion(nodo) {
    return nodo.opciones.reduce(function (a, b) { return b.riesgo < a.riesgo ? b : a; });
  }

  function peorOpcion() {
    return opciones().reduce(function (a, b) { return b.riesgo > a.riesgo ? b : a; });
  }

  /**
   * Aplica una opción: suma riesgo, aplica efectos, registra la decisión
   * y avanza al siguiente nodo. Devuelve un resumen para la interfaz.
   */
  function elegir(opcion, porTiempo) {
    var nodo = nodoActual();
    var antes = RS.Estado.seguridad(estado);

    estado.riesgo += opcion.riesgo;
    if (opcion.efecto) {
      Object.keys(opcion.efecto).forEach(function (k) { estado[k] = opcion.efecto[k]; });
    }
    estado.decisiones.push({
      nodoId: nodo.id,
      titulo: nodo.titulo,
      elegida: opcion.texto,
      mejor: mejorOpcion(nodo).texto,
      riesgo: opcion.riesgo,
      porTiempo: !!porTiempo
    });
    estado.numDecision += 1;
    estado.nodoId = opcion.siguiente;
    nodoCache = null;
    opcionesCache = null;

    return {
      opcion: opcion,
      porTiempo: !!porTiempo,
      seguridadAntes: antes,
      seguridadDespues: RS.Estado.seguridad(estado),
      terminado: opcion.siguiente === 'FIN'
    };
  }

  RS.Motor = {
    nuevaPartida: nuevaPartida,
    estado: function () { return estado; },
    nodoActual: nodoActual,
    situacion: situacion,
    opciones: opciones,
    peorOpcion: peorOpcion,
    elegir: elegir,
    final: function () { return RS.Historia.finales[RS.Estado.resolverFinal(estado)]; }
  };

})(window.RS = window.RS || {});
