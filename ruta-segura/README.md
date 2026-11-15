# Ruta Segura: Trujillo — Videojuego en JavaScript

Juego de decisiones ramificadas (eje **Criminalidad**) en **un solo nivel**: un día completo en la vida de **Leo**, de la mañana a la noche. Cada decisión cambia las situaciones siguientes y conduce a uno de **tres finales**. Está hecho con HTML5 Canvas y JavaScript puro, sin librerías.

## 1. Cómo ejecutarlo

- Abre `index.html` con doble clic en el navegador (Chrome, Edge o Firefox), o
- usa la extensión Live Server de VS Code, o
- súbelo tal cual a GitHub Pages.

No requiere instalación ni internet.

## 2. Controles

| Acción | Teclado | Celular |
|---|---|---|
| Caminar | ← → o A / D | Botones ◀ ▶ en pantalla |
| Decidir | Teclas 1, 2, 3 | Tocar la opción |
| Continuar | Enter o Espacio | Botón Continuar |
| Ver estado de los gráficos | F2 | — |

Cada decisión tiene 10 segundos (`TIEMPO_DECISION` en `js/config.js`). Si se agota, se aplica la opción de mayor riesgo.

## 3. Estructura del proyecto

```
ruta-segura/
├── index.html                 Página y orden de carga de scripts
├── css/estilos.css            Estilos de HUD, paneles y pantallas
├── js/
│   ├── config.js              Constantes del juego (tamaños, tiempos, reglas de finales)
│   ├── assets-manifest.js     CATÁLOGO DE GRÁFICOS (rutas, tamaños, animaciones, función)
│   ├── loader.js              Carga PNG; si falta uno, crea un temporal automáticamente
│   ├── sprites.js             Sprites y animaciones por cuadros
│   ├── datos-historia.js      Situaciones, opciones, efectos, explicaciones y finales
│   ├── estado.js              Variables de la partida y regla de los finales
│   ├── historia.js            Motor de ramificaciones
│   ├── escenas.js             Qué gráfico aparece en cada escena y dónde
│   ├── mundo.js               Escena activa: movimiento, animación, dibujo y transiciones
│   ├── ui.js                  HUD, panel de decisión, retroalimentación y pantallas
│   └── juego.js               Bucle principal, teclado y flujo de la partida
└── assets/
    ├── backgrounds/           Fondos de 640×360 (uno por escena + portada)
    ├── sprites/personajes/    Leo, desconocido, transeúntes, compañero y familia
    ├── sprites/objetos/       Paradero, farola, buses, marcador "!" e ícono de mensaje
    ├── ui/                    Íconos de 24×24 (celular, estrellas)
    └── finales/               Ilustraciones de los 3 finales (320×180)
```

## 4. Cómo incorporar tus ilustraciones pixel art

El juego ya funciona con **imágenes temporales** que tienen el nombre y el tamaño definitivos. Para usar las tuyas:

1. Dibuja cada gráfico con las medidas de la tabla de la sección 5.
2. Guarda el PNG **con el mismo nombre y en la misma carpeta** que el temporal (reemplaza el archivo). Si prefieres otro nombre o carpeta, cambia solo la `ruta` en `js/assets-manifest.js`.
3. Recarga la página. Pulsa **F2** para ver cuáles recursos son DEFINITIVOS y cuáles siguen TEMPORALES.

No hay que modificar la lógica del juego.

**Reglas de las hojas de sprites**

- Una sola fila horizontal de cuadros del mismo tamaño, en el orden indicado (cuadro 0 a la izquierda).
- Fondo transparente en personajes, objetos e íconos; los fondos y finales van sin transparencia.
- Los personajes miran hacia la **derecha**; el juego los voltea por código cuando hace falta.
- Los **pies** del personaje (o la base del objeto) deben quedar en el borde inferior del cuadro, centrados: ahí se ubica en el suelo (`y = 300`).
- Si dibujas al **doble** de resolución (por ejemplo 64×96 por cuadro en lugar de 32×48), el juego lo reduce sin deformar. Si las proporciones no coinciden, avisa en la consola (F12) y en el panel F2.
- Para cambiar las animaciones (cuadros o velocidad), edita solo el campo `animaciones` en `js/assets-manifest.js`.

## 5. Especificaciones de cada gráfico

| Archivo (en `assets/`) | Hoja total (px) | Cuadro (px) | Cuadros | Ancla | Animaciones (cuadros @fps) | Función |
|---|---|---|---|---|---|---|
| `backgrounds/bg_titulo.png` | 640 × 360 | 640 × 360 | 1 | sup-izq | — | Pantalla de título: ilustración de portada. |
| `backgrounds/bg_calle_manana.png` | 640 × 360 | 640 × 360 | 1 | sup-izq | — | Nodo N1: calle de Trujillo por la mañana (camino al paradero). |
| `backgrounds/bg_paradero_dia.png` | 640 × 360 | 640 × 360 | 1 | sup-izq | — | Nodo N2A: paradero concurrido de día. |
| `backgrounds/bg_calle_solitaria.png` | 640 × 360 | 640 × 360 | 1 | sup-izq | — | Nodo N2B: calle con poco tránsito. |
| `backgrounds/bg_universidad_tarde.png` | 640 × 360 | 640 × 360 | 1 | sup-izq | — | Nodos N3A, N3B y N4: exteriores de la universidad por la tarde. |
| `backgrounds/bg_calle_noche.png` | 640 × 360 | 640 × 360 | 1 | sup-izq | — | Nodo N5: calle al anochecer, momento de elegir ruta. |
| `backgrounds/bg_avenida_noche.png` | 640 × 360 | 640 × 360 | 1 | sup-izq | — | Nodo N6A: avenida iluminada y concurrida de noche. |
| `backgrounds/bg_atajo_oscuro.png` | 640 × 360 | 640 × 360 | 1 | sup-izq | — | Nodo N6B: atajo oscuro y solitario. |
| `backgrounds/bg_casa_noche.png` | 640 × 360 | 640 × 360 | 1 | sup-izq | — | Nodo N7: puerta de la casa de Leo, de noche. |
| `sprites/personajes/leo.png` | 448 × 48 | 32 × 48 | 14 | pie-centro | idle [0,1] @2fps; walk [2,3,4,5] @8fps; walk_phone [6,7,8,9] @8fps; scared [10,11] @4fps; relieved [12,13] @3fps | Protagonista controlado por el jugador. Polo azul #2E86DE. |
| `sprites/personajes/desconocido.png` | 128 × 48 | 32 × 48 | 4 | pie-centro | idle [0,1] @2fps; walk [2,3] @6fps | Persona que genera la situación de riesgo en la calle (N2A, N2B, N6B). Se reconoce por su comportamiento, no por su aspecto. |
| `sprites/personajes/transeunte_a.png` | 64 × 48 | 32 × 48 | 2 | pie-centro | idle [0,1] @1.5fps | Peatón de ambientación (transeúnte tipo A). |
| `sprites/personajes/transeunte_b.png` | 64 × 48 | 32 × 48 | 2 | pie-centro | idle [0,1] @1.5fps | Peatón de ambientación (transeúnte tipo B). |
| `sprites/personajes/companero.png` | 64 × 48 | 32 × 48 | 2 | pie-centro | idle [0,1] @2fps | Compañero de universidad que presta su teléfono (N3B). |
| `sprites/personajes/familia.png` | 96 × 48 | 48 × 48 | 2 | pie-centro | idle [0,1] @2fps | Familiares de Leo esperando en casa (N7). |
| `sprites/objetos/paradero.png` | 96 × 96 | 96 × 96 | 1 | pie-centro | — | Paradero de transporte público (N2A). |
| `sprites/objetos/farola.png` | 64 × 96 | 32 × 96 | 2 | pie-centro | brillo [0,1] @1.5fps | Poste de luz con brillo suave. Marca las zonas iluminadas. |
| `sprites/objetos/bus.png` | 128 × 64 | 128 × 64 | 1 | pie-centro | — | Transporte formal e identificado (N6A). |
| `sprites/objetos/vehiculo_sin_identificar.png` | 96 × 48 | 96 × 48 | 1 | pie-centro | — | Vehículo sin identificación que ofrece llevar a Leo (N6A). |
| `sprites/objetos/marcador_evento.png` | 48 × 24 | 24 × 24 | 2 | pie-centro | pulso [0,1] @3fps | Signo de alerta "!" que indica dónde ocurre la próxima decisión. |
| `sprites/objetos/icono_mensaje.png` | 24 × 24 | 24 × 24 | 1 | pie-centro | — | Ícono de mensaje de texto flotante (N4). |
| `ui/icon_celular_on.png` | 24 × 24 | 24 × 24 | 1 | centro | — | HUD: Leo conserva su celular. |
| `ui/icon_celular_off.png` | 24 × 24 | 24 × 24 | 1 | centro | — | HUD: Leo perdió su celular. |
| `ui/icon_estrella_llena.png` | 24 × 24 | 24 × 24 | 1 | centro | — | Pantalla final: estrella obtenida. |
| `ui/icon_estrella_vacia.png` | 24 × 24 | 24 × 24 | 1 | centro | — | Pantalla final: estrella no obtenida. |
| `finales/final_1.png` | 320 × 180 | 320 × 180 | 1 | sup-izq | — | Final 1: Ruta segura. |
| `finales/final_2.png` | 320 × 180 | 320 × 180 | 1 | sup-izq | — | Final 2: Aprender a tiempo. |
| `finales/final_3.png` | 320 × 180 | 320 × 180 | 1 | sup-izq | — | Final 3: Consecuencias acumuladas. |

## 6. Cómo funciona la historia

- **Contenido:** todo está en `js/datos-historia.js` como datos. Cada nodo tiene situación y opciones; cada opción tiene `riesgo`, `efecto`, `siguiente`, `consecuencia`, `explicacion` y `reaccion` (animación en pantalla).
- **Variables:** `riesgo` (oculto, 0 a 17), `celular` y `datosExpuestos`.
- **Ramificaciones:** N1 → N2A o N2B → N3 (se resuelve a N3A con celular o N3B sin celular) → N4 → N5 → N6A o N6B → N7 → final.
- **Finales:** Final 1 si `riesgo ≤ 3` y conserva el celular; Final 3 si `riesgo ≥ 10`; Final 2 en los demás casos.
- **Seguridad visible:** `100 − riesgo × 5`.
- **Escenas:** `js/escenas.js` define, para cada nodo, el fondo, la posición de Leo, el punto de la decisión y los personajes y objetos con su función.

Para agregar una situación nueva: crea el nodo en `datos-historia.js`, enlázalo desde una opción con `siguiente` y define su escena en `escenas.js`. El motor no cambia. Al abrir el juego, la consola avisa si algún enlace o gráfico referenciado no existe.

## 7. Verificación realizada

- 300 partidas aleatorias simuladas: sin errores de JavaScript, 7 decisiones por partida, finales coherentes con las reglas y variantes N3A/N3B asignadas correctamente.
- Mejor camino (riesgo 0) → Final 1; peor camino (riesgo 17) → Final 3; tiempo agotado → opción de mayor riesgo.
- Juego completo sin ningún PNG en `assets/` (se generan temporales) y con PNG de medidas incorrectas (avisa por consola).
- Prueba hecha sobre un DOM simulado; falta la prueba visual en tu navegador.

## 8. Contenido educativo

Los consejos son de prevención general. Antes de presentar el juego, conviene validarlos con fuentes oficiales como la Policía Nacional del Perú y el Ministerio del Interior. En una emergencia, el número es el 105.
