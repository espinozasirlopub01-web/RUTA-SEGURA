/**
 * estado.js — ESTADO DE LA PARTIDA Y REGLAS (RS.Estado)
 * ---------------------------------------------------------------
 * Funciones puras sobre el objeto de estado. No dependen de gráficos
 * ni del DOM, por lo que se pueden probar de forma aislada.
 *
 *   riesgo          acumulador oculto (0 a 17)
 *   celular         true si Leo conserva su celular
 *   datosExpuestos  true si Leo entregó o dejó sin proteger sus datos
 *   nodoId          nodo actual
 *   numDecision     decisiones ya tomadas
 *   decisiones      historial para el resumen final
 */
(function (RS) {
  'use strict';

  var C = RS.Config;

  function nuevo() {
    return {
      riesgo: 0,
      celular: true,
      datosExpuestos: false,
      nodoId: RS.Historia.nodoInicial,
      numDecision: 0,
      decisiones: []
    };
  }

  /** Seguridad visible en la barra: 100 - riesgo * FACTOR_RIESGO (mínimo 0). */
  function seguridad(estado) {
    return Math.max(0, C.SEGURIDAD_MAXIMA - estado.riesgo * C.FACTOR_RIESGO);
  }

  /** Devuelve 'F1', 'F2' o 'F3' según las reglas del diseño. */
  function resolverFinal(estado) {
    if (estado.riesgo >= C.FINAL_MALO_MIN_RIESGO) return 'F3';
    if (estado.riesgo <= C.FINAL_BUENO_MAX_RIESGO && estado.celular) return 'F1';
    return 'F2';
  }

  RS.Estado = {
    nuevo: nuevo,
    seguridad: seguridad,
    resolverFinal: resolverFinal
  };

})(window.RS = window.RS || {});
