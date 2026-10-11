# 06 · Rendimiento, accesibilidad y SEO

## Presupuestos
Valores objetivo, heredados de Boxrus (donde se cumplieron); se miden en cada fase y se revisan con Luis si resultan irreales.

| Métrica | Escritorio | Móvil (gama media) |
|---|---|---|
| Lighthouse Rendimiento (landing) | ≥ 90 | ≥ 80 |
| Lighthouse Accesibilidad | ≥ 95 | ≥ 95 |
| Lighthouse SEO / Buenas prácticas | ≥ 95 | ≥ 95 |
| LCP (póster del prólogo) | ≤ 1,8 s | ≤ 2,5 s |
| CLS | ≤ 0,05 | ≤ 0,05 |
| JS de la **isla inicial** (gzip) | ≤ 350 KB | ≤ 350 KB |
| JS del **postproceso** (trozo diferido, gzip) | ≤ 80 KB | ≤ 80 KB |
| Descarga 3D total (modelos + texturas + mapas de luz + transcodificador) | ≤ 10 MB | ≤ 5 MB |
| FPS durante el recorrido | 60 estable | ≥ 30 estable |
| Llamadas de dibujo por fotograma (**incluida la pasada de reflejo del suelo**) | ≤ 150 | ≤ 80 |

### Lo que se sabe de Boxrus (para no repetir errores)
- Three.js + React Three Fiber + drei básico ya ocupan **~238 KB**, y el cliente de React **~64 KB**: quedan **~45 KB** para la escena. Boxrus terminó a ~345 de 350.
- Por eso, **desde la fase 0**: postproceso en un trozo diferido; importar de drei solo lo usado; **nada de `Text` de drei** (trae troika y una fuente: rótulos con `CanvasTexture` o geometría propia); `KTX2Loader` con el transcodificador en `public/basis/`; Leaflet solo en `/ubicacion` y bajo demanda; el script de la demo de reservas, fuera de la isla.
- **Riesgo nuevo:** `MeshReflectorMaterial` (drei) añade JS y **duplica las llamadas de dibujo** de lo que se refleja. Medirlo en cuanto entre (fase 3) y, si no cabe, reflejo solo en nivel alto o solo con el entorno capturado.
- Muchos objetos pequeños repetidos (10 sillones, 10 espejos, consolas, listones, retícula): **instancias** y **mallas fusionadas** desde la fase 1.

Cómo medir el peso tras `npm run build`:
```bash
for f in dist/_astro/*.js; do echo "$(gzip -c "$f" | wc -c) $f"; done | sort -n | tail
```
FPS y llamadas de dibujo: `node scripts/capturar.mjs --medir` (o `?depuracion=1` y `window.barberiaRender`) sobre la **compilación de producción** (`npm run build` + `npm run preview`); el servidor de desarrollo y el modo captura dan cifras más bajas y ruidosas.

Cada cierre de fase anota aquí una tabla «Estado medido (fase N)» con el peso por trozo, la descarga 3D, FPS y llamadas de dibujo.

### Estado medido (fase 0)
| Pieza | gzip | Nota |
|---|---|---|
| `client.*.js` (cliente de React de `@astrojs/react`) | 66,6 KB | Se genera pero la portada aún no lo carga (sin isla) |
| CSS global | 2,2 KB | — |
| Bodoni Moda `opsz`, subconjunto latino (woff2) | 45 KB | Fuera del presupuesto de JS; el resto de subconjuntos solo se descarga si hace falta (`unicode-range`) |
| Inter `wght`, subconjunto latino (woff2) | 47 KB | Ídem |

### Medición intermedia (fase 1, maqueta en bloques, 2026-10-11)
| Pieza | gzip | Nota |
|---|---|---|
| three + React Three Fiber (trozo `barberia.*.js`) | 240 KB | Sin drei en la isla inicial (solo en `Depuracion`, diferido) |
| Cliente de React + planificador | 69 KB | — |
| Isla (`Barberia.*.js`: escena y cámara) | 10 KB | — |
| `pausas` y comunes | 1,5 KB | — |
| **Isla inicial total** | **≈ 321 KB** | Margen ≈ 29 KB hasta 350 (sin postproceso, que irá diferido) |
| Script de la landing (GSAP + Lenis + recorrido) | 51 KB | Fuera de la isla, como en Boxrus |

## Niveles de calidad
| Ajuste | Alto | Medio | Bajo |
|---|---|---|---|
| Resolución de render (DPR) | hasta 2 | hasta 1,5 | 1 |
| Sombra del sol | suave, 2K | 1K | sin sombra (solo luz horneada) |
| `RectAreaLight` (retícula, escaparate) | 6 + escaparate | 3 + escaparate | 0 (emisivos + luz horneada) |
| Reflejo del suelo | reflejo plano real (`MeshReflectorMaterial`) | entorno capturado | entorno capturado, más rugoso |
| Haces de luz | sí | sí | muy tenues |
| Motas en los haces | ~300 | ~150 | 0 |
| Giro del poste | sí | sí | no |
| Bloom | completo | reducido | muy reducido |
| Profundidad de campo | sí (planos de detalle) | solo parada 1 | no |
| Texturas | 2K | 1K | 1K/512 |

Elección inicial según el dispositivo y ajuste automático si los FPS caen.

## Alternativas sin 3D
Versión estática cuando no hay WebGL, con `prefers-reduced-motion`, si el nivel «bajo» no llega a 30 FPS o si el usuario elige «Versión ligera». Usa los **pósters** de cada plano con las mismas secciones HTML y transiciones de opacidad.

## Accesibilidad
- Contenido y acciones en **HTML semántico**; canvas decorativo (`aria-hidden`).
- «Saltar al contenido» y «Saltar recorrido».
- Teclado completo, foco visible, orden lógico.
- Contraste AA en todo texto superpuesto (vigilar el **latón** sobre fondo oscuro: si no llega, aclararlo para el texto y dejar el tono de la paleta para filetes e iconos).
- Precios y horario como **tablas o listas accesibles**, nunca como imagen.
- Formulario de la demo de reservas: etiquetas, agrupación por pasos, errores anunciados (`aria-live`), sin trampas de foco; el aviso de «demostración» se lee antes de confirmar.
- Huecos provisionales con su texto alternativo previsto.
- Sin sonido automático.

## SEO (local)
Pensado para que, con una barbería real, funcione desde el primer día:
- `<html lang="es">`, título y descripción por página, URL canónica.
- Datos estructurados **`HairSalon`** (schema.org) con nombre, dirección, coordenadas, teléfono, `openingHoursSpecification` y catálogo de servicios con precios (`hasOfferCatalog`), generados desde `src/content/`.
- Las 5 secciones son páginas indexables con contenido real en HTML.
- Imagen Open Graph: póster del prólogo.
- `sitemap.xml` y `robots.txt`.
- En este proyecto de práctica, **`noindex, nofollow`** para no indexar una barbería inexistente; se quita al pasar a una real.
