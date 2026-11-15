/**
 * config.js — CONFIGURACIÓN GENERAL DEL JUEGO
 * ---------------------------------------------------------------
 * Aquí se ajustan las constantes de juego (tamaño lógico, velocidad,
 * tiempo por decisión, reglas de finales). No contiene lógica.
 *
 * Todo el proyecto cuelga del espacio de nombres global `RS`
 * (Ruta Segura). Se usan scripts clásicos (no módulos ES) para que el
 * juego funcione al abrir index.html con doble clic (file://).
 */
(function (RS) {
  'use strict';

  RS.Config = {
    // --- Lienzo (resolución lógica; se escala por CSS sin suavizado) ---
    ANCHO: 640,
    ALTO: 360,
    SUELO_Y: 300,              // línea del suelo: los "pies" de personajes y objetos
    LIMITE_IZQUIERDO: 16,      // x mínima a la que puede caminar Leo

    // --- Jugabilidad ---
    VELOCIDAD_LEO: 90,         // píxeles por segundo
    TIEMPO_DECISION: 10,       // segundos por decisión; al agotarse se aplica la opción de mayor riesgo
    ALEATORIZAR_OPCIONES: true,// cambia el orden de las opciones en cada partida
    DURACION_FADE: 0.5,        // segundos de cada transición entre escenas

    // --- Reglas de riesgo y finales ---
    SEGURIDAD_MAXIMA: 100,
    FACTOR_RIESGO: 5,          // Seguridad visible = 100 - riesgo * FACTOR_RIESGO
    FINAL_BUENO_MAX_RIESGO: 3, // Final 1: riesgo <= 3 y Leo conserva el celular
    FINAL_MALO_MIN_RIESGO: 10, // Final 3: riesgo >= 10

    NUMERO_EMERGENCIAS: '105',

    // --- Herramientas de desarrollo (la tecla F2 las activa en pantalla) ---
    DEBUG: false
  };

})(window.RS = window.RS || {});
