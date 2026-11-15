/**
 * assets-manifest.js — CATÁLOGO ÚNICO DE RECURSOS GRÁFICOS
 * ---------------------------------------------------------------
 * ESTE ES EL ÚNICO ARCHIVO QUE DESCRIBE LOS GRÁFICOS DEL JUEGO.
 *
 * Para usar tus ilustraciones pixel art definitivas:
 *   1) Guarda tu PNG con el MISMO nombre y en la MISMA carpeta que indica
 *      `ruta` (reemplaza el archivo temporal), respetando el tamaño; o
 *   2) cambia aquí la `ruta` para apuntar a tu archivo nuevo.
 * No hay que tocar ninguna otra parte del código.
 *
 * Campos de cada recurso:
 *   tipo        'fondo' | 'personaje' | 'objeto' | 'icono' | 'final'
 *   ruta        ruta relativa a RUTA_BASE
 *   frameAncho  ancho en px de UN cuadro (frame)
 *   frameAlto   alto en px de UN cuadro
 *   frames      cantidad de cuadros; la hoja (sprite sheet) es UNA FILA
 *               horizontal de tamaño (frameAncho * frames) x frameAlto
 *   ancla       punto de dibujo: 'pie-centro' (pies, para personajes y objetos),
 *               'sup-izq' (esquina, para fondos) o 'centro' (íconos)
 *   animaciones { nombre: { frames: [índices], fps, bucle } } (opcional)
 *   color       color del marcador temporal (placeholder)
 *   funcion     para qué sirve el recurso en el juego
 *
 * Nota: si tu PNG es un múltiplo entero del tamaño indicado (por ejemplo
 * el doble, 64x96 por cuadro), el juego lo reduce al tamaño lógico sin
 * deformarlo. Si la proporción no coincide, avisa en la consola (F12).
 */
(function (RS) {
  'use strict';

  var BUCLE = true;

  function fondo(ruta, color, funcion) {
    return { tipo: 'fondo', ruta: ruta, frameAncho: 640, frameAlto: 360, frames: 1,
             ancla: 'sup-izq', color: color, funcion: funcion };
  }
  function ilustracionFinal(ruta, color, funcion) {
    return { tipo: 'final', ruta: ruta, frameAncho: 320, frameAlto: 180, frames: 1,
             ancla: 'sup-izq', color: color, funcion: funcion };
  }
  function personaje(ruta, color, ancho, alto, frames, animaciones, funcion) {
    return { tipo: 'personaje', ruta: ruta, frameAncho: ancho, frameAlto: alto, frames: frames,
             ancla: 'pie-centro', animaciones: animaciones, color: color, funcion: funcion };
  }
  function objeto(ruta, color, ancho, alto, frames, animaciones, funcion) {
    return { tipo: 'objeto', ruta: ruta, frameAncho: ancho, frameAlto: alto, frames: frames,
             ancla: 'pie-centro', animaciones: animaciones, color: color, funcion: funcion };
  }
  function icono(ruta, color, funcion) {
    return { tipo: 'icono', ruta: ruta, frameAncho: 24, frameAlto: 24, frames: 1,
             ancla: 'centro', color: color, funcion: funcion };
  }

  RS.Catalogo = {
    RUTA_BASE: 'assets/',

    recursos: {

      // ============ FONDOS (640 x 360) — assets/backgrounds/ ============
      bg_titulo:            fondo('backgrounds/bg_titulo.png',            '#1F2A44', 'Pantalla de título: ilustración de portada.'),
      bg_calle_manana:      fondo('backgrounds/bg_calle_manana.png',      '#8FD3F4', 'Nodo N1: calle de Trujillo por la mañana (camino al paradero).'),
      bg_paradero_dia:      fondo('backgrounds/bg_paradero_dia.png',      '#8FD3F4', 'Nodo N2A: paradero concurrido de día.'),
      bg_calle_solitaria:   fondo('backgrounds/bg_calle_solitaria.png',   '#7FB8D6', 'Nodo N2B: calle con poco tránsito.'),
      bg_universidad_tarde: fondo('backgrounds/bg_universidad_tarde.png', '#F4A261', 'Nodos N3A, N3B y N4: exteriores de la universidad por la tarde.'),
      bg_calle_noche:       fondo('backgrounds/bg_calle_noche.png',       '#6A4C93', 'Nodo N5: calle al anochecer, momento de elegir ruta.'),
      bg_avenida_noche:     fondo('backgrounds/bg_avenida_noche.png',     '#5B4380', 'Nodo N6A: avenida iluminada y concurrida de noche.'),
      bg_atajo_oscuro:      fondo('backgrounds/bg_atajo_oscuro.png',      '#2B2147', 'Nodo N6B: atajo oscuro y solitario.'),
      bg_casa_noche:        fondo('backgrounds/bg_casa_noche.png',        '#3A2D5C', 'Nodo N7: puerta de la casa de Leo, de noche.'),

      // ============ PERSONAJES — assets/sprites/personajes/ ============
      // Leo (jugador): hoja de 14 cuadros de 32x48 = 448 x 48 px.
      leo: personaje('sprites/personajes/leo.png', '#2E86DE', 32, 48, 14, {
        idle:       { frames: [0, 1],       fps: 2, bucle: BUCLE },
        walk:       { frames: [2, 3, 4, 5], fps: 8, bucle: BUCLE },
        walk_phone: { frames: [6, 7, 8, 9], fps: 8, bucle: BUCLE },  // camina mirando el celular
        scared:     { frames: [10, 11],     fps: 4, bucle: BUCLE },  // asustado
        relieved:   { frames: [12, 13],     fps: 3, bucle: BUCLE }   // aliviado
      }, 'Protagonista controlado por el jugador. Polo azul #2E86DE.'),

      desconocido: personaje('sprites/personajes/desconocido.png', '#8D6E63', 32, 48, 4, {
        idle: { frames: [0, 1], fps: 2, bucle: BUCLE },
        walk: { frames: [2, 3], fps: 6, bucle: BUCLE }
      }, 'Persona que genera la situación de riesgo en la calle (N2A, N2B, N6B). Se reconoce por su comportamiento, no por su aspecto.'),

      transeunte_a: personaje('sprites/personajes/transeunte_a.png', '#A8DADC', 32, 48, 2, {
        idle: { frames: [0, 1], fps: 1.5, bucle: BUCLE }
      }, 'Peatón de ambientación (transeúnte tipo A).'),

      transeunte_b: personaje('sprites/personajes/transeunte_b.png', '#F6BD60', 32, 48, 2, {
        idle: { frames: [0, 1], fps: 1.5, bucle: BUCLE }
      }, 'Peatón de ambientación (transeúnte tipo B).'),

      companero: personaje('sprites/personajes/companero.png', '#B5A8E0', 32, 48, 2, {
        idle: { frames: [0, 1], fps: 2, bucle: BUCLE }
      }, 'Compañero de universidad que presta su teléfono (N3B).'),

      familia: personaje('sprites/personajes/familia.png', '#E58E9B', 48, 48, 2, {
        idle: { frames: [0, 1], fps: 2, bucle: BUCLE }
      }, 'Familiares de Leo esperando en casa (N7).'),

      // ============ OBJETOS Y ESCENARIO — assets/sprites/objetos/ ============
      paradero: objeto('sprites/objetos/paradero.png', '#4F86C6', 96, 96, 1, null,
        'Paradero de transporte público (N2A).'),
      farola: objeto('sprites/objetos/farola.png', '#F2C94C', 32, 96, 2, {
        brillo: { frames: [0, 1], fps: 1.5, bucle: BUCLE }
      }, 'Poste de luz con brillo suave. Marca las zonas iluminadas.'),
      bus: objeto('sprites/objetos/bus.png', '#3A7D44', 128, 64, 1, null,
        'Transporte formal e identificado (N6A).'),
      vehiculo_sin_identificar: objeto('sprites/objetos/vehiculo_sin_identificar.png', '#C0392B', 96, 48, 1, null,
        'Vehículo sin identificación que ofrece llevar a Leo (N6A).'),
      marcador_evento: objeto('sprites/objetos/marcador_evento.png', '#FF6B35', 24, 24, 2, {
        pulso: { frames: [0, 1], fps: 3, bucle: BUCLE }
      }, 'Signo de alerta "!" que indica dónde ocurre la próxima decisión.'),
      icono_mensaje: objeto('sprites/objetos/icono_mensaje.png', '#2ECC71', 24, 24, 1, null,
        'Ícono de mensaje de texto flotante (N4).'),

      // ============ ICONOS DE INTERFAZ (24 x 24) — assets/ui/ ============
      icon_celular_on:     icono('ui/icon_celular_on.png',     '#2ECC71', 'HUD: Leo conserva su celular.'),
      icon_celular_off:    icono('ui/icon_celular_off.png',    '#E74C3C', 'HUD: Leo perdió su celular.'),
      icon_estrella_llena: icono('ui/icon_estrella_llena.png', '#F1C40F', 'Pantalla final: estrella obtenida.'),
      icon_estrella_vacia: icono('ui/icon_estrella_vacia.png', '#7F8C8D', 'Pantalla final: estrella no obtenida.'),

      // ============ ILUSTRACIONES DE FINALES (320 x 180) — assets/finales/ ============
      final_1: ilustracionFinal('finales/final_1.png', '#2ECC71', 'Final 1: Ruta segura.'),
      final_2: ilustracionFinal('finales/final_2.png', '#F4A261', 'Final 2: Aprender a tiempo.'),
      final_3: ilustracionFinal('finales/final_3.png', '#E74C3C', 'Final 3: Consecuencias acumuladas.')
    }
  };

})(window.RS = window.RS || {});
