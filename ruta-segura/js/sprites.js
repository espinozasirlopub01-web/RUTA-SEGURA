/**
 * sprites.js — SPRITES Y ANIMACIONES (RS.crearSprite)
 * ---------------------------------------------------------------
 * Un sprite representa un recurso del catálogo con su animación actual.
 *
 *   var s = RS.crearSprite('leo');
 *   s.reproducir('walk');          // cambia de animación (si es otra)
 *   s.actualizar(dt);              // avanza el tiempo de animación
 *   s.dibujar(ctx, x, y, { volteo: true });
 *
 * Posición (x, y) según el campo `ancla` del catálogo:
 *   'pie-centro' → (x, y) es el punto entre los pies
 *   'sup-izq'    → (x, y) es la esquina superior izquierda
 *   'centro'     → (x, y) es el centro
 *
 * Tamaño en pantalla: siempre el definido en el catálogo
 * (frameAncho x frameAlto). Si el PNG real es un múltiplo (por ejemplo
 * el doble), se reduce sin deformar.
 */
(function (RS) {
  'use strict';

  function crearSprite(id) {
    var def = RS.Catalogo.recursos[id];
    if (!def) throw new Error('Sprite no definido en el catálogo: ' + id);
    var anims = def.animaciones || null;

    var sprite = {
      id: id,
      def: def,
      animActual: null,
      tiempo: 0,
      frame: 0,

      /** Cambia de animación; no la reinicia si ya es la actual (salvo forzar). */
      reproducir: function (nombre, forzar) {
        if (!anims) return;
        if (!anims[nombre]) {
          if (window.console) console.warn('[Sprite] "' + id + '" no tiene la animación "' + nombre + '".');
          return;
        }
        if (this.animActual === nombre && !forzar) return;
        this.animActual = nombre;
        this.tiempo = 0;
        this.frame = anims[nombre].frames[0];
      },

      /** Avanza la animación dt segundos. */
      actualizar: function (dt) {
        if (!anims || !this.animActual) return;
        var a = anims[this.animActual];
        this.tiempo += dt;
        var indice = Math.floor(this.tiempo * a.fps);
        indice = a.bucle ? indice % a.frames.length : Math.min(indice, a.frames.length - 1);
        this.frame = a.frames[indice];
      },

      /** Dibuja el cuadro actual. opc: { volteo, alpha } */
      dibujar: function (ctx, x, y, opc) {
        opc = opc || {};
        var fuente = RS.Assets.obtener(id).fuente;
        var anchoReal = fuente.naturalWidth || fuente.width;
        var altoReal = fuente.naturalHeight || fuente.height;
        var sw = anchoReal / def.frames;          // ancho real de un cuadro en el PNG
        var dw = def.frameAncho, dh = def.frameAlto;
        var dx = x, dy = y;

        if (def.ancla === 'pie-centro') { dx = x - dw / 2; dy = y - dh; }
        else if (def.ancla === 'centro') { dx = x - dw / 2; dy = y - dh / 2; }
        dx = Math.round(dx);
        dy = Math.round(dy);

        var cuadro = Math.min(this.frame, def.frames - 1);
        ctx.save();
        if (opc.alpha != null) ctx.globalAlpha = opc.alpha;
        var destinoX = dx;
        if (opc.volteo) {
          ctx.translate(dx + dw, 0);
          ctx.scale(-1, 1);
          destinoX = 0;
        }
        ctx.drawImage(fuente, Math.round(cuadro * sw), 0, sw, altoReal, destinoX, dy, dw, dh);
        ctx.restore();

        if (RS.Config.DEBUG && def.tipo !== 'fondo') {
          ctx.strokeStyle = '#00FFAA';
          ctx.strokeRect(dx + 0.5, dy + 0.5, dw - 1, dh - 1);
          ctx.fillStyle = '#00FFAA';
          ctx.font = '8px monospace';
          ctx.textAlign = 'left';
          ctx.fillText(id, dx, dy - 2);
        }
      }
    };

    // Primera animación definida como animación inicial
    if (anims) sprite.reproducir(Object.keys(anims)[0]);
    return sprite;
  }

  RS.crearSprite = crearSprite;

})(window.RS = window.RS || {});
