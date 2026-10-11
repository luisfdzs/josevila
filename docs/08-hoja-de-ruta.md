# 08 · Hoja de ruta

Cada fase termina con **capturas y un resumen para Luis**, que da el visto bueno antes de pasar a la siguiente. Nada de pulir el acabado sin haber aprobado la composición. Cómo se trabaja dentro de cada fase (sesiones, agentes, verificación, cierre): `10-metodologia.md`.

---

## Estado
- ✅ **Fase 0 aprobada por Luis el 2026-10-11.** Publicada en `dev`, `test` (`josevilatest.vercel.app`) y `prod` (`josevila.vercel.app`).
- **Fase 1 (maqueta en bloques) en curso** desde el 2026-10-11; el trabajo a medias se publicó en `dev`, `test` y `prod` a petición de Luis (2026-10-11), sin aprobar aún la fase. Hecho: datos, recorrido de Boxrus con pruebas, local completo en bloques grises, capturas y tres rondas de ajuste (la 3, de cámara, a medias: encuadres hechos, comprobaciones de comportamiento pendientes). Estado detallado y siguientes pasos en la memoria local `estado-fase-1`.

## Fase 0 · Preparación
Punto de partida en una sesión nueva: leer `01`, `05` (stack, carpetas, código que se reutiliza, despliegue), `06` («Lo que se sabe de Boxrus»), `09` (pregunta 3) y `10`, y la memoria local (`arranque-fase-0`, `entorno-local`).

Tareas:
1. **Proyecto Astro.** La carpeta no está vacía (`docs/`, `.claude/`, `.gitignore`): crear el starter `basics` de Astro en una carpeta del scratchpad y copiar a la raíz **sin sobrescribir** `docs/`, `.claude/` ni `.gitignore` (fusionar el `.gitignore` del starter con el nuestro). Comprobar que quedan `CLAUDE.md` y `AGENTS.md` de Astro en la raíz.
2. **Git:** `git init` con rama `dev`; primer commit con el starter y segundo con docs y configuración de Claude Code (mensajes breves en inglés, sin atribución).
3. **Dependencias** del stack (`05`): `@astrojs/react`, `react`, `react-dom`, `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `postprocessing`, `gsap`, `lenis`, Fontsource (tipografías según la pregunta 3); de desarrollo, `@astrojs/check`, `typescript`, `vitest`, `@types/three`, `@types/node`, `playwright-core`, `@gltf-transform/cli`. Script `test` (`vitest run`) y `check`.
4. **Limpiar el starter**; `astro.config.mjs` con React y `devToolbar: { enabled: false }` (la barra se cuela en las capturas).
5. **`Base.astro`**: `lang="es"`, metadatos, `noindex, nofollow`, fuentes, estilos globales y **logotipo JOSÉ VILA** provisional (texto en la tipografía de titulares, arriba y centrado).
6. **Contenido:** esquemas zod de las 5 colecciones (`servicios`, `equipo`, `galeria`, `ubicacion`, `reservas`) en `src/lib/esquemas.ts`, con pruebas, conectados en `content.config.ts`. Colecciones vacías hasta la fase 4.
7. **Código base de Boxrus:** copiar `src/lib/azar.ts` con su prueba (el resto, en la fase 1).
8. **Repositorio y Vercel (con Luis):** repo público `luisfdzs/josevila` con `gh` (cuenta `luisfdzs`); proyecto `josevila` en el equipo `luis-fernandez`; ramas `dev` (por defecto), `test` y `prod`; rama de producción `prod`; dominio `josevilatest.vercel.app` fijado a `test`; *Ignored Build Step* que descarta producción fuera de `prod`; protección en previsualizaciones; `vercel.json` con cachés. Comprobar el *target* del primer despliegue. Anotar los IDs en la memoria local (`vercel-josevila`).
9. Comprobar que el hook de tipos funciona (`.claude/settings.json`; se salta solo si aún no hay `node_modules/astro`).

**Criterios de aceptación:**
- [x] `npm run build`, `npx astro check` y `npm run test` pasan (11 pruebas: `azar` y esquemas de las 5 colecciones). El hook de tipos detectó los errores reales del starter al limpiarlo.
- [x] Previsualización de `dev` y `josevilatest.vercel.app` funcionando (protegidas); producción solo desde `prod` (`josevila.vercel.app`, pública). En el primer push, `dev` y `test` salieron como producción pese a tener `prod` como rama de producción: la salvaguarda los canceló y se relanzaron como previsualización por la API.
- [x] Pregunta 3 (tipografía) respondida: Bodoni Moda.

Desviaciones: el repo `luisfdzs/JoseVila` ya existía (esqueleto Next.js antiguo); se renombró a `josevila-next-archivo` (`09`). Luis aprobó subir a `test` y `prod` el 2026-10-11.

## Fase 1 · Maqueta en bloques
Punto de partida: leer `02`, `03`, `04`, `05` («Código que se reutiliza de Boxrus»), `06` y `09` (preguntas 7 y 8).

- Local en geometría gris a escala real: envolvente, escaparate con carpintería y dintel, recepción, listones, 10 puestos (consola, espejo, líneas de luz, sillón), galería, lavacabezas, estantería, tarima, sillón protagonista, ventanal del patio, lucernario con pozo, retícula del techo, poste.
- `datos/barberia.ts` y `datos/paradas.ts` a partir de `03` y `04`. Instancias y mallas fusionadas desde el principio.
- Copiar y adaptar de Boxrus: `progreso`, `pausas`, `trayectoria`, `scroll`, `paginado`, `modo`, `colisiones`, `ControladorCamara`, `Depuracion`, `Logo`, `MenuParadas` (iconos nuevos), con sus pruebas.
- Trayectoria completa de los 7 planos, media vuelta de 4 a 5 dentro del límite de giro; scroll con Lenis + ScrollTrigger; scroll por paradas, píldora, viajes del logotipo y deslizamiento horizontal en móvil; final en una sola transición.
- Modos `?parada`, `?captura`, `?depuracion`, `?ajuste`, `?paginado`; señal `data-barberia-lista`; prueba automática de colisiones.
- `scripts/capturar.mjs` adaptado de Billaron.
- Secciones HTML provisionales con los textos de `04`; encuadres móviles iniciales.
- Agentes: `escena-3d` (bloques acotados), `coreografia-camara`; `revisor-visual` al final de cada ronda.

**Criterios de aceptación:**
- [ ] Capturas de los 7 planos en escritorio (1440 × 900) y móvil (390 × 844) **aprobadas por Luis**.
- [ ] Recorrido fluido y reversible; prueba de colisiones y límite de giro en verde.
- [ ] Coordenadas definitivas actualizadas en `03` y `04`.

## Fase 2 · Assets
Punto de partida: leer `07` (inventario, herramientas, registro), `03` (detalles de vida), `06` (peso) y `02`.

- Agente `buscador-assets`: sillón protagonista, planta, mármol negro (si no se hace por código); licencias verificadas en la página original.
- Texturas por código: vetas del suelo, listones, cuero (de Boxrus), láminas de la galería, espiral del poste.
- Detalles de vida de la lista cerrada de `03`, por código salvo que un modelo CC0 ligero lo mejore mucho.
- Rótulo JOSÉ VILA (`CanvasTexture` o geometría, nunca `Text` de drei).
- Compresión a `.glb`/`.ktx2`; transcodificador Basis en `public/basis/`.

**Criterios de aceptación:**
- [ ] Registro de licencias completo (`07`).
- [ ] Peso dentro del presupuesto de `06` (tabla «Estado medido (fase 2)»).
- [ ] **Aprobación de Luis** de los recursos externos.

## Fase 3 · Ambiente
Punto de partida: leer `02` (paleta, luz, «Evitar», lista de comprobación), `03` («Atmósfera» e «Iluminación»), `06` (peso y niveles), `09` (preguntas 4, 5 y 6) y, de Boxrus, `docs/03-escena.md` («Luz precalculada (Blender)») y `src/datos/luz.ts`.

- Materiales: piedra pulida, negro mate, listones, latón, cromo, cuero, vidrio de espejos, capas.
- Sol por el lucernario y el patio, cielo del escaparate, retícula, líneas de espejos, foco del sillón; entorno capturado; AgX.
- Reflejo del suelo según la pregunta 6, medido.
- Luz precalculada en Blender según la pregunta 5 (proceso de Boxrus en `herramientas/blender/`), documentada en `03`.
- Haces del lucernario y del patio, motas escasas, neblina ligera; postproceso en trozo diferido.
- Agentes: `luz-y-materiales` (con el hilo principal), `revisor-visual` en cada iteración.

**Criterios de aceptación:**
- [ ] Lista de comprobación de `02` cumplida en todos los planos.
- [ ] **Aprobación de Luis** sobre capturas de los 7 planos.
- [ ] FPS y llamadas de dibujo medidos en producción (tabla en `06`).

## Fase 4 · Interfaz y contenido
Punto de partida: leer `01`, `02` («Tipografía e interfaz»), `04`, `05` (contenido ficticio, huecos, demo de reservas), `06` (accesibilidad, SEO, peso), `07` (Leaflet y OpenStreetMap se registran antes de usarlos) y `09` (preguntas 1 y 2).

1. Preguntas a Luis antes de escribir contenido: 1 (ciudad ficticia) y 2 (tono).
2. Contenido ficticio en `src/content/`: 10–14 servicios con precio y duración, 5 barberos, 12 huecos de galería, ubicación y horario, configuración de reservas.
3. Componente `Hueco` y layout `Pagina.astro`.
4. Páginas `/servicios` (precios accesibles), `/equipo`, `/galeria` (visor accesible), `/reservar` (demo, `05`), `/ubicacion` (mapa bajo demanda).
5. Landing: resúmenes del contenido en las paradas (incluido el próximo hueco libre en la parada 4), cabecera de escritorio con «Reservar» fijo, «Saltar recorrido», indicador «01 / 05», cierre y pie.
- Agente: `interfaz` (no toca la isla 3D).

**Criterios de aceptación:**
- [ ] Cambiar un dato en `src/content/` actualiza landing y página sin tocar código.
- [ ] Demo de reservas completa, determinista, accesible y con el aviso de demostración; pruebas en verde.
- [ ] Navegación completa con teclado.
- [ ] **Aprobación de Luis** de textos y diseño.

## Fase 5 · Rendimiento, accesibilidad y alternativas
- Niveles de calidad y ajuste automático.
- Pósters de los 7 planos y versión estática.
- Datos estructurados `HairSalon`, Open Graph, sitemap, robots.
- Agente: `auditor-rendimiento`.

**Criterios de aceptación:**
- [ ] Presupuestos de `06` cumplidos (o desviaciones aprobadas y anotadas en `09`).
- [ ] Versión estática revisada con movimiento reducido y sin WebGL.

## Fase 6 · Pulido y publicación
- Ajuste fino de curvas, tiempos, haces, reflejos, bloom, grano y profundidad de campo.
- Revisión de código completa (`/code-review`).
- Página de créditos (OpenStreetMap y recursos CC BY).
- Prueba en teléfonos reales (sobre todo iPhone/Safari): gestos, píldora, viajes, demo de reservas.
- Despliegue a producción **con aprobación explícita**.

**Criterios de aceptación:**
- [ ] Revisión visual final aprobada por Luis.
- [ ] Producción comprobada en escritorio y móvil reales.

## Después: paso a una barbería real
Lo que cambiaría (proyecto futuro): contenido de `src/content/`, fotos reales en los huecos, marca y paleta de la barbería, ajuste del local a su espacio real (o mantener el ficticio), proveedor de reservas real (otra implementación de `ProveedorReservas`), quitar `noindex`, dominio propio.
