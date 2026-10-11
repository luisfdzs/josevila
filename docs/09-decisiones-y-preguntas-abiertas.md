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

## Preguntas abiertas

| # | Pregunta | Afecta a | Cuándo hace falta | Recomendación |
|---|---|---|---|---|
| 1 | ¿Ciudad para la dirección ficticia? (afecta al mapa) | Contenido | Fase 4 | — |
| 2 | Tono de los textos: tú o usted; más clásico o más cercano | Interfaz | Fase 4 | Tú, cercano y sobrio |
| 3 | Tipografía de titulares: Playfair Display, Bodoni Moda, Cormorant Garamond u otra condensada de rótulo | Interfaz, rótulo 3D | Fase 0 | Enseñar a Luis una muestra de las tres con «José Vila» y elegir |
| 4 | Hora del día y color del sol (afecta a la dirección del sol y al haz del lucernario) | Luz | Fase 3 | Mediodía cálido, sol alto (~65°) para que el haz caiga sobre el sillón |
| 5 | ¿Luz precalculada en Blender? | Luz, peso | Fase 3 | Sí, como en Boxrus (escena estática; proceso ya probado) |
| 6 | Reflejo del suelo: reflejo plano real (`MeshReflectorMaterial`) o solo entorno capturado | Luz, rendimiento | Fase 3 | Real en nivel alto si cabe en el presupuesto; entorno en medio y bajo |
| 7 | ¿Ajuste a paradas al dejar de hacer scroll o scroll libre? (en escritorio; en móvil, scroll por paradas) | Coreografía | Fase 1 (probar ambos) | Probar con `?ajuste=1` |
| 8 | Número de puestos: 5 por lado (hipótesis) | Escena | Fase 1 | Validar en la maqueta |
| 9 | Poste de barbero: rojo, blanco y azul clásicos (algo apagados) o versión en negro y latón | Escena | Fase 3 | Clásico, pequeño: es el guiño al oficio |

## Pendientes menores
- *(vacío)*
