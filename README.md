# Yamaha Agente — versión separada en archivos

Este es el mismo archivo `yamaha-agente.html` que me compartiste, pero
organizado en varios archivos para que sea más fácil de leer, mantener
y subir a un repositorio. **No se modificó ninguna función, cálculo,
texto ni comportamiento** — es exactamente la misma lógica, solo
reacomodada.

## Cómo probarlo

Solo abre `index.html` en el navegador (o súbelo tal cual a GitHub Pages,
Netlify, etc.). No necesita servidor ni build, sigue siendo HTML/CSS/JS
plano, igual que el original.

## Estructura

```
yamaha-agente/
├── index.html              ← la "vista" general: solo estructura HTML
├── css/
│   └── estilos.css         ← todo el diseño y estilos (colores, layout, animaciones)
└── js/
    ├── datos.js             ← "base de datos" del catálogo de motos (objeto plano)
    ├── funciones.js         ← fórmulas puras de cálculo (precios, mensualidades)
    ├── vista.js              ← estado global + funciones que dibujan en pantalla
    │                            (burbujas de chat, widgets, barra de progreso)
    ├── camara.js             ← acciones de captura de fotos (abrir cámara, tomar foto)
    ├── ocr.js                ← servicio que llama a la API para leer la INE
    ├── acciones-firma.js     ← captura de firma en el canvas
    ├── impresion.js          ← genera y manda a imprimir el PDF de cotización
    └── flujo.js              ← orquesta el flujo completo del chat, paso a paso
```

## Orden de carga (importante)

`index.html` carga los `<script>` en este orden porque cada archivo usa
cosas definidas en los anteriores (por ejemplo `flujo.js` usa funciones
de `vista.js`, `camara.js`, `ocr.js` e `impresion.js`):

1. `datos.js`
2. `funciones.js`
3. `vista.js`
4. `camara.js`
5. `ocr.js`
6. `acciones-firma.js`
7. `impresion.js`
8. `flujo.js`

## Cómo se decidió qué va en cada archivo

- **CSS**: se movió tal cual a `css/estilos.css`, sin tocar ninguna regla.
- **"Base de datos"**: el objeto `CATALOGO` (motos, precios, claves) es la
  información pura de negocio — está en `datos.js`. En un proyecto real
  esto se volvería una tabla en MySQL o un JSON que se consulta por API,
  igual que el catálogo de productos de tu POS.
- **Funciones**: las fórmulas de cálculo (`pContado`, `mensualN`, `fmt`, etc.)
  son funciones puras: mismo dato de entrada, mismo resultado siempre, no
  tocan la pantalla. Se separaron en `funciones.js`.
- **Vista**: todo lo que crea o actualiza elementos en el DOM (burbujas,
  widgets, progreso) vive en `vista.js`.
- **Acciones**: cámara (`camara.js`) y firma (`acciones-firma.js`) son
  interacciones directas con hardware/dispositivo del usuario.
- **Impresión**: `impresion.js` es exactamente la parte que arma el HTML
  del PDF y llama a `window.print()`.
- **Flujo**: `flujo.js` es el "director de orquesta" — decide qué paso
  sigue, qué se muestra en el chat y en qué momento. Usa piezas de todos
  los demás archivos.

## Nota pendiente (no se tocó, solo para que lo tengas en el radar)

El archivo original guarda la API key de Anthropic en `sessionStorage` del
navegador y hace la llamada a la API **directamente desde el cliente**
(ver `js/ocr.js`). Eso funciona para una prueba local, pero si esto se
sube a un repo público o se usa con clientes reales, cualquiera que abra
las herramientas de desarrollador del navegador podría ver la key. Cuando
quieras, lo ideal sería mover esa llamada a un backend pequeño (PHP, Node,
lo que uses) que guarde la key del lado del servidor. Lo dejo anotado
nada más, sin tocar el comportamiento actual.
