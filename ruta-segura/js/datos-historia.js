/**
 * datos-historia.js — CONTENIDO NARRATIVO (RS.Historia)
 * ---------------------------------------------------------------
 * Todo el contenido del juego está aquí como datos: situaciones,
 * opciones, efectos, explicaciones y finales. Para agregar o cambiar
 * situaciones NO hay que tocar el motor (historia.js).
 *
 * NODO
 *   id, fase ('mañana' | 'tarde' | 'noche'), titulo, situacion
 *   situacion: texto, o función (estado) => texto, para variar el mensaje.
 *   variante:  función (estado) => id del nodo real (permite que una
 *              misma decisión cambie según lo ocurrido antes).
 *
 * OPCIÓN
 *   texto        lo que lee el jugador
 *   riesgo       puntos de riesgo que suma (0 = decisión más segura)
 *   efecto       cambios en variables del estado, p. ej. { celular: false }
 *   siguiente    id del próximo nodo, o 'FIN'
 *   consecuencia qué ocurre en la historia
 *   explicacion  mensaje educativo
 *   reaccion     animación en pantalla: { leo: 'scared',
 *                  entidades: [{ id, anim, vx }] }
 *
 * VARIABLES DE ESTADO: riesgo, celular, datosExpuestos
 */
(function (RS) {
  'use strict';

  var nodos = {

    // ---------------- MAÑANA ----------------
    N1: {
      id: 'N1', fase: 'mañana', titulo: 'Calle',
      situacion: 'Mañana. Caminas hacia el paradero con el celular en la mano.',
      opciones: [
        { texto: 'Guardar el celular.', riesgo: 0, siguiente: 'N2A',
          consecuencia: 'Guardas el celular y sigues atento a tu entorno.',
          explicacion: 'Usar el celular en la calle reduce la atención y facilita el robo al paso.',
          reaccion: { leo: 'relieved' } },
        { texto: 'Seguir usándolo mientras caminas.', riesgo: 2, siguiente: 'N2B',
          consecuencia: 'Sigues distraído y entras a una calle con poco tránsito.',
          explicacion: 'La distracción te deja expuesto y el equipo a la vista llama la atención.',
          reaccion: {} }
      ]
    },

    N2A: {
      id: 'N2A', fase: 'mañana', titulo: 'Paradero concurrido',
      situacion: 'Paradero concurrido. Un desconocido insiste en preguntarte la hora mientras otra persona se acerca por detrás.',
      opciones: [
        { texto: 'Responder sin sacar el celular y acercarte a la gente.', riesgo: 0, siguiente: 'N3',
          consecuencia: 'Te mueves hacia las personas y el desconocido se aleja.',
          explicacion: 'La cercanía excesiva y la distracción son señales de alerta. No se exhiben objetos de valor.',
          reaccion: { leo: 'relieved', entidades: [{ id: 'desconocido', anim: 'walk', vx: 70 }] } },
        { texto: 'Sacar el celular para mostrar la hora.', riesgo: 2, efecto: { celular: false }, siguiente: 'N3',
          consecuencia: 'El desconocido te arrebata el celular y huye.',
          explicacion: 'Mostrar el equipo en una situación sospechosa facilita el arrebato.',
          reaccion: { leo: 'scared', entidades: [{ id: 'desconocido', anim: 'walk', vx: 170 }] } }
      ]
    },

    N2B: {
      id: 'N2B', fase: 'mañana', titulo: 'Calle solitaria',
      situacion: 'Calle con poco tránsito. Por tu distracción, alguien se acerca y te exige el celular.',
      opciones: [
        { texto: 'Entregarlo sin resistirte y pedir ayuda a las personas cercanas.', riesgo: 1, efecto: { celular: false }, siguiente: 'N3',
          consecuencia: 'Entregas el celular sin resistirte y pides ayuda a quienes están cerca.',
          explicacion: 'La vida y la integridad valen más que un objeto. No resistirse reduce el daño.',
          reaccion: { leo: 'scared', entidades: [{ id: 'desconocido', anim: 'walk', vx: 170 }] } },
        { texto: 'Resistirte y forcejear.', riesgo: 3, efecto: { celular: false }, siguiente: 'N3',
          consecuencia: 'Forcejeas, igual pierdes el celular y quedas muy alterado.',
          explicacion: 'Resistirse aumenta el peligro y no evita la pérdida del objeto.',
          reaccion: { leo: 'scared', entidades: [{ id: 'desconocido', anim: 'walk', vx: 170 }] } }
      ]
    },

    // ---------------- TARDE ----------------
    // N3 es un nodo "puente": según conserves o no el celular, la situación cambia.
    N3: {
      id: 'N3',
      variante: function (e) { return e.celular ? 'N3A' : 'N3B'; }
    },

    N3A: {
      id: 'N3A', fase: 'tarde', titulo: 'Llamada de extorsión',
      situacion: 'Universidad, tarde. Llama un número desconocido: dice que un familiar fue retenido y exige un depósito inmediato.',
      opciones: [
        { texto: 'Colgar, llamar directamente al familiar y avisar a otra persona de confianza.', riesgo: 0, siguiente: 'N4',
          consecuencia: 'Verificas con tu familiar y descubres que está bien.',
          explicacion: 'La extorsión usa la urgencia y el miedo. Verificar por otro medio desarma el engaño.',
          reaccion: { leo: 'relieved' } },
        { texto: 'Dar tu nombre y dirección para confirmar la identidad.', riesgo: 2, efecto: { datosExpuestos: true }, siguiente: 'N4',
          consecuencia: 'La persona que llama ahora tiene tus datos y los usará para presionarte.',
          explicacion: 'Nunca se deben entregar datos personales a quien llama bajo presión.',
          reaccion: { leo: 'scared' } },
        { texto: 'Depositar el dinero de inmediato.', riesgo: 3, siguiente: 'N4',
          consecuencia: 'Pierdes el dinero y nada garantiza que la presión termine.',
          explicacion: 'Pagar no resuelve la amenaza y el engaño suele repetirse.',
          reaccion: { leo: 'scared' } }
      ]
    },

    N3B: {
      id: 'N3B', fase: 'tarde', titulo: 'Sin celular',
      situacion: 'Universidad, tarde. Sin celular, temes que tu línea y tus cuentas se usen indebidamente. Un compañero te ofrece su teléfono.',
      opciones: [
        { texto: 'Avisar a tu familia, bloquear la línea y las cuentas, y acudir a denunciar.', riesgo: 0, siguiente: 'N4',
          consecuencia: 'Bloqueas tu línea y tus cuentas, y avisas a tu familia.',
          explicacion: 'Actuar rápido limita el mal uso de la línea y las cuentas, y facilita la denuncia.',
          reaccion: { leo: 'relieved' } },
        { texto: 'Esperar a llegar a casa sin hacer nada.', riesgo: 2, efecto: { datosExpuestos: true }, siguiente: 'N4',
          consecuencia: 'Tu línea y tus cuentas quedan desprotegidas durante horas.',
          explicacion: 'Cada hora sin bloquear aumenta el riesgo de que se use tu información.',
          reaccion: { leo: 'scared' } }
      ]
    },

    N4: {
      id: 'N4', fase: 'tarde', titulo: 'Mensaje de amenaza',
      situacion: function (e) {
        var base = 'Llega un mensaje que exige dinero a tu familia a cambio de no dañar su negocio.';
        return e.datosExpuestos ? base + ' El mensaje incluye tu nombre y tu dirección.' : base;
      },
      opciones: [
        { texto: 'No pagar, guardar capturas y denunciar junto a tu familia.', riesgo: 0, siguiente: 'N5',
          consecuencia: 'Tu familia guarda las pruebas y denuncia contigo.',
          explicacion: 'Pagar no garantiza que la amenaza cese. Las pruebas y la denuncia permiten investigar.',
          reaccion: { leo: 'relieved' } },
        { texto: 'Borrar el mensaje y no contar a nadie.', riesgo: 2, siguiente: 'N5',
          consecuencia: 'El mensaje desaparece, pero la amenaza sigue y tu familia queda sin apoyo.',
          explicacion: 'Sin pruebas ni apoyo, es más difícil protegerse y denunciar.',
          reaccion: { leo: 'scared' } },
        { texto: 'Pagar para evitar problemas.', riesgo: 3, siguiente: 'N5',
          consecuencia: 'Tu familia paga y no hay garantía de que la amenaza termine.',
          explicacion: 'Pagar suele alentar nuevas exigencias.',
          reaccion: { leo: 'scared' } }
      ]
    },

    // ---------------- NOCHE ----------------
    N5: {
      id: 'N5', fase: 'noche', titulo: 'Elegir ruta',
      situacion: 'Ya es de noche y debes volver a casa.',
      opciones: [
        { texto: 'Ir por la avenida iluminada y concurrida.', riesgo: 0, siguiente: 'N6A',
          consecuencia: 'Llegas a la avenida, donde hay luz y gente.',
          explicacion: 'Llegar unos minutos después es preferible a exponerse en una zona solitaria.',
          reaccion: { leo: 'relieved' } },
        { texto: 'Tomar el atajo oscuro.', riesgo: 2, siguiente: 'N6B',
          consecuencia: 'Entras a un atajo oscuro y solitario.',
          explicacion: 'Los atajos oscuros reducen la visibilidad y las posibilidades de recibir ayuda.',
          reaccion: {} }
      ]
    },

    N6A: {
      id: 'N6A', fase: 'noche', titulo: 'Transporte',
      situacion: 'Avenida iluminada. Un vehículo sin identificación se detiene y te ofrece llevarte a casa.',
      opciones: [
        { texto: 'Rechazar, usar transporte formal y avisar la placa a un familiar.', riesgo: 0, siguiente: 'N7',
          consecuencia: 'Tomas un bus formal y envías la placa a tu familia.',
          explicacion: 'Conviene usar transporte identificable y avisar siempre a una persona de confianza.',
          reaccion: { leo: 'relieved' } },
        { texto: 'Subir al vehículo.', riesgo: 3, siguiente: 'N7',
          consecuencia: 'El conductor cambia de ruta y cobra de más; logras bajar en un lugar con gente.',
          explicacion: 'Un vehículo sin identificación no ofrece ninguna garantía de seguridad.',
          reaccion: { leo: 'scared', entidades: [{ id: 'vehiculo', anim: 'idle', vx: 200 }] } }
      ]
    },

    N6B: {
      id: 'N6B', fase: 'noche', titulo: 'Atajo oscuro',
      situacion: 'Atajo oscuro. Sientes que alguien te sigue desde hace varias cuadras.',
      opciones: [
        { texto: 'Dirigirte a un lugar con gente y luz, y pedir ayuda (105 o un familiar).', riesgo: 1, siguiente: 'N7',
          consecuencia: 'Entras a un lugar iluminado y pides ayuda; la persona se aleja.',
          explicacion: 'Ante una sospecha se busca un lugar seguro y se pide ayuda, sin enfrentar la situación a solas.',
          reaccion: { leo: 'relieved', entidades: [{ id: 'desconocido', anim: 'walk', vx: -90 }] } },
        { texto: 'Correr hacia una calle oscura.', riesgo: 3, siguiente: 'N7',
          consecuencia: 'Te alejas de cualquier ayuda y terminas más expuesto.',
          explicacion: 'Correr hacia zonas oscuras te aleja de la gente que podría ayudarte.',
          reaccion: { leo: 'scared' } }
      ]
    },

    N7: {
      id: 'N7', fase: 'noche', titulo: 'Llegada a casa',
      situacion: 'Llegas a casa. ¿Qué haces con lo ocurrido hoy?',
      opciones: [
        { texto: 'Contar a tu familia y completar la denuncia y las medidas pendientes.', riesgo: 0, siguiente: 'FIN',
          consecuencia: 'Tu familia te escucha y refuerzan juntos las medidas de seguridad.',
          explicacion: 'Compartir lo ocurrido permite denunciar, protegerse y alertar a otras personas.',
          reaccion: { leo: 'relieved' } },
        { texto: 'Guardar silencio y no contar nada.', riesgo: 2, siguiente: 'FIN',
          consecuencia: 'Cargas solo con lo ocurrido y no se toma ninguna medida.',
          explicacion: 'Callar impide denunciar y deja a tu entorno sin información para cuidarse.',
          reaccion: { leo: 'scared' } }
      ]
    }
  };

  var finales = {
    F1: {
      id: 'F1', estrellas: 3, imagen: 'final_1',
      titulo: 'Final 1: Ruta segura',
      texto: 'Leo llega a casa sin pérdidas y con su familia informada. Sus decisiones redujeron el riesgo en cada situación del día.',
      mensaje: 'La prevención y la verificación por otro medio reducen el riesgo.'
    },
    F2: {
      id: 'F2', estrellas: 2, imagen: 'final_2',
      titulo: 'Final 2: Aprender a tiempo',
      texto: 'Leo tuvo pérdidas o errores durante el día, pero también tomó decisiones que limitaron el daño.',
      mensaje: 'Reaccionar rápido y denunciar limita el daño.'
    },
    F3: {
      id: 'F3', estrellas: 1, imagen: 'final_3',
      titulo: 'Final 3: Consecuencias acumuladas',
      texto: 'Varias decisiones de riesgo se sumaron: Leo perdió su celular, dinero o datos, y su familia debe iniciar trámites.',
      mensaje: 'Siempre se puede pedir apoyo y reconstruir hábitos. La responsabilidad del delito es siempre de quien lo comete.'
    }
  };

  var cartilla = [
    'Guardar el celular al caminar por la calle.',
    'Preferir rutas iluminadas y concurridas.',
    'No entregar códigos, claves ni datos personales por llamada o mensaje.',
    'Verificar cualquier pedido urgente por otro medio.',
    'No resistirse ante un robo y denunciar después.',
    'Llamar al 105 ante una emergencia.'
  ];

  RS.Historia = {
    nodoInicial: 'N1',
    totalDecisiones: 7,   // decisiones por partida (una por fase del recorrido)
    nodos: nodos,
    finales: finales,
    cartilla: cartilla
  };

})(window.RS = window.RS || {});
