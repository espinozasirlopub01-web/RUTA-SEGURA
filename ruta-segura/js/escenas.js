/**
 * escenas.js — DEFINICIÓN DE CADA ESCENA (RS.Escenas)
 * ---------------------------------------------------------------
 * Una escena por nodo resuelto de la historia (N1, N2A, N2B, N3A, N3B,
 * N4, N5, N6A, N6B, N7). Aquí se decide QUÉ gráfico aparece, DÓNDE y
 * para QUÉ sirve. Los gráficos se piden por id del catálogo, nunca por
 * ruta de archivo.
 *
 * ESCENA
 *   fondo      id del fondo (640x360)
 *   leo        { x: posición inicial, anim: animación al caminar,
 *                disparadorX: x donde ocurre la decisión }
 *   entidades  lista de elementos visuales:
 *     id        nombre único dentro de la escena (las reacciones lo usan)
 *     sprite    id del catálogo
 *     x, y      posición de los pies (y = SUELO_Y si se omite)
 *     anim      animación inicial
 *     capa      'fondo' (detrás de Leo) | 'frente' (delante de Leo)
 *     volteo    true para que mire a la izquierda
 *     sigue     { distancia, velocidad }: camina detrás de Leo
 *     funcion   para qué sirve (documentación)
 *
 * Coordenadas: lienzo lógico de 640x360; el suelo está en y = 300.
 */
(function (RS) {
  'use strict';

  RS.Escenas = {

    N1: {
      fondo: 'bg_calle_manana',
      leo: { x: 40, anim: 'walk_phone', disparadorX: 400 },
      entidades: [
        { id: 'farola_1', sprite: 'farola', x: 210, anim: 'brillo', capa: 'fondo',
          funcion: 'Ambientación: poste de luz de la calle.' },
        { id: 'transeunte_1', sprite: 'transeunte_a', x: 540, anim: 'idle', capa: 'frente', volteo: true,
          funcion: 'Ambientación: peatón que da sensación de calle transitada.' }
      ]
    },

    N2A: {
      fondo: 'bg_paradero_dia',
      leo: { x: 40, anim: 'walk', disparadorX: 380 },
      entidades: [
        { id: 'paradero', sprite: 'paradero', x: 300, anim: null, capa: 'fondo',
          funcion: 'Escenario: paradero donde espera la gente.' },
        { id: 'transeunte_1', sprite: 'transeunte_a', x: 345, anim: 'idle', capa: 'fondo',
          funcion: 'Ambientación: persona esperando en el paradero.' },
        { id: 'transeunte_2', sprite: 'transeunte_b', x: 440, anim: 'idle', capa: 'fondo', volteo: true,
          funcion: 'Ambientación: persona esperando en el paradero.' },
        { id: 'desconocido', sprite: 'desconocido', x: 520, anim: 'idle', capa: 'frente', volteo: true,
          funcion: 'Situación de riesgo: insiste en preguntar la hora.' }
      ]
    },

    N2B: {
      fondo: 'bg_calle_solitaria',
      leo: { x: 40, anim: 'walk_phone', disparadorX: 360 },
      entidades: [
        { id: 'farola_1', sprite: 'farola', x: 160, anim: 'brillo', capa: 'fondo',
          funcion: 'Ambientación: poste de luz débil en una calle solitaria.' },
        { id: 'desconocido', sprite: 'desconocido', x: 500, anim: 'idle', capa: 'frente', volteo: true,
          funcion: 'Situación de riesgo: se acerca para exigir el celular.' }
      ]
    },

    N3A: {
      fondo: 'bg_universidad_tarde',
      leo: { x: 40, anim: 'walk', disparadorX: 380 },
      entidades: [
        { id: 'transeunte_1', sprite: 'transeunte_b', x: 500, anim: 'idle', capa: 'frente', volteo: true,
          funcion: 'Ambientación: estudiante en la universidad.' }
      ]
    },

    N3B: {
      fondo: 'bg_universidad_tarde',
      leo: { x: 40, anim: 'walk', disparadorX: 380 },
      entidades: [
        { id: 'companero', sprite: 'companero', x: 470, anim: 'idle', capa: 'frente', volteo: true,
          funcion: 'Ayuda: compañero que ofrece su teléfono.' }
      ]
    },

    N4: {
      fondo: 'bg_universidad_tarde',
      leo: { x: 40, anim: 'walk', disparadorX: 380 },
      entidades: [
        { id: 'mensaje', sprite: 'icono_mensaje', x: 470, y: 250, anim: null, capa: 'frente',
          funcion: 'Situación de riesgo: mensaje de amenaza que llega al teléfono de la familia.' }
      ]
    },

    N5: {
      fondo: 'bg_calle_noche',
      leo: { x: 40, anim: 'walk', disparadorX: 380 },
      entidades: [
        { id: 'farola_1', sprite: 'farola', x: 150, anim: 'brillo', capa: 'fondo',
          funcion: 'Ambientación: poste de luz de la calle.' },
        { id: 'farola_2', sprite: 'farola', x: 520, anim: 'brillo', capa: 'fondo',
          funcion: 'Ambientación: poste de luz que marca la zona iluminada.' }
      ]
    },

    N6A: {
      fondo: 'bg_avenida_noche',
      leo: { x: 40, anim: 'walk', disparadorX: 340 },
      entidades: [
        { id: 'farola_1', sprite: 'farola', x: 100, anim: 'brillo', capa: 'fondo',
          funcion: 'Ambientación: avenida iluminada.' },
        { id: 'bus', sprite: 'bus', x: 230, anim: null, capa: 'fondo',
          funcion: 'Opción segura: transporte formal e identificado.' },
        { id: 'transeunte_1', sprite: 'transeunte_b', x: 330, anim: 'idle', capa: 'fondo',
          funcion: 'Ambientación: persona esperando transporte.' },
        { id: 'vehiculo', sprite: 'vehiculo_sin_identificar', x: 520, anim: null, capa: 'fondo',
          funcion: 'Situación de riesgo: vehículo sin identificación que ofrece llevar a Leo.' }
      ]
    },

    N6B: {
      fondo: 'bg_atajo_oscuro',
      leo: { x: 120, anim: 'walk', disparadorX: 420 },
      entidades: [
        { id: 'desconocido', sprite: 'desconocido', x: 40, anim: 'walk', capa: 'frente',
          sigue: { distancia: 70, velocidad: 45 },
          funcion: 'Situación de riesgo: persona que sigue a Leo desde atrás.' }
      ]
    },

    N7: {
      fondo: 'bg_casa_noche',
      leo: { x: 40, anim: 'walk', disparadorX: 380 },
      entidades: [
        { id: 'familia', sprite: 'familia', x: 500, anim: 'idle', capa: 'frente', volteo: true,
          funcion: 'Apoyo: familia que espera a Leo en casa.' }
      ]
    }
  };

})(window.RS = window.RS || {});
