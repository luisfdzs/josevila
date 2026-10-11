# 09 · Decisiones y preguntas abiertas

## Decisiones tomadas

| Fecha | Decisión | Motivo |
|---|---|---|
| 2026-10-11 | Proyecto **de práctica** (barbería ficticia) para una futura web de una barbería real | Decisión de Luis; mismo planteamiento que Boxrus |
| 2026-10-11 | Misma plantilla y metodología que Billaron y Boxrus: escena 3D en tiempo real, mismo stack, 9 documentos, 7 agentes, fases con aprobación | Reutilizar lo aprendido y el código de Boxrus |
| 2026-10-11 | 5 paradas: **Servicios, Equipo, Galería, Reservar, Ubicación** | Secciones típicas de la web de una barbería (propuesta aceptada por Luis) |
| 2026-10-11 | La referencia (vídeo de una barbería real) como **inspiración libre**: identidad propia y cambios notables; se descartan su marca, hexágonos, arcos, televisiones y objetos | Decisión de Luis. Es material de terceros |
| 2026-10-11 | Identidad propia: **retícula de líneas de luz** en el techo, **espejos rectangulares** con marco de latón y líneas de luz verticales, **acento latón**, **sillón protagonista** clásico al fondo bajo un lucernario | Propuestas de Claude aprobadas por Luis («todas me parecen perfectas») |
| 2026-10-11 | **Más luz natural** que en la referencia: escaparate a la calle (cielo) y, al fondo, ventanal al patio y lucernario con sol y haces | Petición de Luis: «algo más de luz natural, como en la nave de Boxrus» |
| 2026-10-11 | Acento **latón cálido** (`#b08d57`) | Elección de Luis entre latón, madera o ambos |
| 2026-10-11 | Fotos de personas (retratos del equipo, galería de cortes): **huecos provisionales**; ni fotos de terceros ni generadas con IA | Decisión de Luis; la escena va vacía y no se usan fotos ajenas |
| 2026-10-11 | Reservar: **demo sin backend**, determinista, con confirmación simulada y preparada para un proveedor real | Decisión de Luis (opción recomendada) |
| 2026-10-11 | Marca: **José Vila** (solo el nombre; «barbería» como descriptor) | Decisión de Luis |
| 2026-10-11 | Repositorio **público** `luisfdzs/josevila`; Vercel `josevila`, `josevilatest.vercel.app` (test) y `josevila.vercel.app` (prod) | Decisión de Luis (como Boxrus) |
| 2026-10-11 | La descripción detallada de la barbería de referencia vive **solo en la memoria local** (`.claude/memory/referencia-descripcion-video.md`), no en el repo | Decisión de Luis: el repo es público y es un negocio real de terceros |
| 2026-10-11 | Barbería **vacía**, sin personas | Igual que Billaron y Boxrus |
| 2026-10-11 | Solo **español**, alojamiento en **Vercel**, `noindex` mientras sea de práctica | Como Boxrus |
| 2026-10-11 | Se **heredan de Boxrus** (revisables): scroll por paradas en móvil (2,2 s), píldora con Inicio (saltos de 1,5 s con fundido si no son vecinas), logotipo que vuelve al inicio con un viaje, deslizamiento horizontal (izquierda avanza), final en una sola transición, velocidad uniforme con límite de 36° por 1 %, postproceso en trozo diferido, entorno capturado, AgX | Decisiones de Luis en Boxrus que funcionaron; evita repetir iteraciones |
| 2026-10-11 | Capturas con **Playwright** (`scripts/capturar.mjs`, de Billaron) como método principal; Claude in Chrome con iframe como respaldo | En Billaron y Boxrus la ventana oculta de Chrome hizo perder rondas de prueba |
| 2026-10-11 | Metodología documentada en `10-metodologia.md`: 7 agentes con modelo, esfuerzo y herramientas fijados | Petición de Luis: poder empezar en sesiones nuevas sin contexto |
| 2026-10-11 | Tipografía de titulares, logotipo y rótulo: **Bodoni Moda** (pregunta 3); textos en Inter | Elección de Luis sobre una muestra de Playfair Display, Bodoni Moda, Cormorant Garamond y Oswald (opción recomendada: lujo preciso, aguanta en el rótulo) |
| 2026-10-11 | Bodoni Moda con el eje **`opsz`** (`opsz.css`, 46 KB el subconjunto latino) en vez de solo `wght` (26 KB) | Criterio de Claude, revisable: el tamaño óptico ajusta el contraste al tamaño y es lo que la hace legible en el logotipo pequeño |
| 2026-10-11 | Salvaguarda de producción como **`ignoreCommand` en `vercel.json`** (versionada) en vez de en el panel de Vercel | Criterio de Claude, revisable: queda en el repo desde el primer push y no depende de configurarla a mano |
| 2026-10-11 | ✅ **Fase 0 aprobada**; publicada en `dev`, `test` y `prod` | Aprobación de Luis |
| 2026-10-11 | El repo antiguo `luisfdzs/JoseVila` (esqueleto Next.js del 2026-10-03) se renombra a `josevila-next-archivo` y se crea `luisfdzs/josevila` limpio | Decisión de Luis (opción recomendada: reversible, no se pierde nada) |
| 2026-10-11 | Pregunta 7: **probar ambos**. Escritorio con scroll libre por defecto y ajuste a paradas con `?ajuste=1`; Luis decide al cerrar la fase 1 | Decisión de Luis (opción recomendada) |
| 2026-10-11 | ✅ Pregunta 8: **5 puestos por lado** (paso 2,4 m), validado en la maqueta | Decisión de Luis (opción recomendada) |
| 2026-10-11 | El **dintel** va a haces con el muro de entrada; las letras del rótulo sobresalen hacia dentro hasta z = −0,05 | Criterio de Claude: `03` no fijaba su fondo y con fondo hacia dentro el rótulo habría quedado embutido |
| 2026-10-11 | En `?captura=1` el móvil **muestra la píldora** (sin gestos ni animación) | Criterio de Claude: capturas de móvil completas y deterministas (Boxrus tuvo que capturar el móvil sin `captura`) |
| 2026-10-11 | Encuadres móviles con **desplazamiento vertical del objetivo** (`desplazamientoVertical` en `paradas.ts`, `setViewOffset`) en vez de inclinar la mira | Criterio de Claude (agente de coreografía, a propuesta del revisor visual): sube el protagonista sobre la interfaz sin converger las verticales con focales cortas |
| 2026-10-11 | Espejos: el vidrio mide 0,8 × 1,5 y el marco de latón va **por fuera** (0,84 × 1,54) | Criterio de Claude, revisable |
| 2026-10-11 | Sillón protagonista con **base de latón** (para distinguirlo de los sillones de los puestos, de cromo) y tarima con **canto de latón** como banda en el borde superior | Criterio de Claude, revisable con Luis |

## Preguntas abiertas

| # | Pregunta | Afecta a | Cuándo hace falta | Recomendación |
|---|---|---|---|---|
| 1 | ¿Ciudad para la dirección ficticia? (afecta al mapa) | Contenido | Fase 4 | — |
| 2 | Tono de los textos: tú o usted; más clásico o más cercano | Interfaz | Fase 4 | Tú, cercano y sobrio |
| ~~3~~ | ~~Tipografía de titulares~~ | — | — | **Cerrada el 2026-10-11:** Bodoni Moda (ver decisiones) |
| 4 | Hora del día y color del sol (afecta a la dirección del sol y al haz del lucernario) | Luz | Fase 3 | Mediodía cálido, sol alto (~65°) para que el haz caiga sobre el sillón |
| 5 | ¿Luz precalculada en Blender? | Luz, peso | Fase 3 | Sí, como en Boxrus (escena estática; proceso ya probado) |
| 6 | Reflejo del suelo: reflejo plano real (`MeshReflectorMaterial`) o solo entorno capturado | Luz, rendimiento | Fase 3 | Real en nivel alto si cabe en el presupuesto; entorno en medio y bajo |
| 7 | ¿Ajuste a paradas al dejar de hacer scroll o scroll libre? (en escritorio; en móvil, scroll por paradas) | Coreografía | Cierre de la fase 1 (Luis prueba ambos) | Implementados los dos: libre por defecto, ajuste con `?ajuste=1` |
| ~~8~~ | ~~Número de puestos~~ | — | — | **Cerrada el 2026-10-11:** 5 por lado (ver decisiones) |
| 9 | Poste de barbero: rojo, blanco y azul clásicos (algo apagados) o versión en negro y latón | Escena | Fase 3 | Clásico, pequeño: es el guiño al oficio |

## Pendientes menores
- *(vacío)*
