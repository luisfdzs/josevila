# José Vila — reglas del proyecto

José Vila es una barbería ficticia. Este repo es un **proyecto de práctica**: su **landing 3D «La barbería»**, un recorrido por scroll por un local alargado y vacío, del escaparate al sillón protagonista del fondo y de vuelta a la calle, con 5 paradas (Servicios, Equipo, Galería, Reservar, Ubicación). Servirá de base para la futura web de una barbería real. Misma metodología y stack que Billaron y Boxrus (`C:\Proyectos\boxrus` es la plantilla y la fuente de código reutilizable). El `CLAUDE.md` de la raíz (generado por Astro) sigue vigente para el servidor de desarrollo y la documentación de Astro.

@memory/MEMORY.md

## Documentación: léela antes de trabajar
El plan completo está en `docs/` (índice en `docs/README.md`). **Cómo se trabaja** (sesiones, fases, agentes, verificación, ramas, memoria): `docs/10-metodologia.md`. Según la tarea:
- Qué toca ahora y qué leer para ello → `docs/08-hoja-de-ruta.md` («Estado» y «Punto de partida» de la fase)
- Escena 3D → `docs/02-direccion-de-arte.md` y `docs/03-escena.md`
- Cámara y scroll → `docs/04-recorrido-y-paradas.md`
- Código, estructura, contenido, reservas y despliegue → `docs/05-arquitectura.md`
- Rendimiento, accesibilidad, SEO → `docs/06-rendimiento-y-accesibilidad.md`
- Recursos externos → `docs/07-assets-y-licencias.md`
- Decisiones y preguntas abiertas → `docs/09-decisiones-y-preguntas-abiertas.md`

Los documentos son **vivos**: si una cifra cambia al verla renderizada, actualiza el documento en el mismo cambio y anota la decisión en `docs/09`.

## Reglas
- **Idioma:** todo el contenido visible, en español. Identificadores de dominio en español (`puesto`, `sillon`, `espejo`, `parada`), siguiendo `docs/05-arquitectura.md`.
- **Fuente única de datos:** medidas y planos en `src/datos/`; contenido de la barbería en `src/content/`. Nada de números mágicos ni textos duplicados en componentes.
- **Contenido ficticio:** realista pero inventado. Nunca personas, negocios ni marcas reales.
- **Personas:** ninguna en la escena; retratos y fotos de cortes son **huecos provisionales** (ni fotos de terceros ni generadas).
- **Reservar es una demo sin backend:** no se envía ni se guarda ningún dato, y se dice claramente.
- **Determinismo:** toda aleatoriedad con el generador con semilla de `src/lib/azar.ts`.
- **Referencia visual:** inspiración libre. Nada del vídeo se descarga al repo ni se usa como textura o calco; su marca, hexágonos, arcos y televisiones quedan fuera. El repo es **público**: no enlaces ni describas la barbería de la referencia fuera de la memoria local. La fuente de verdad visual es `docs/02-direccion-de-arte.md`.
- **Marcas:** solo JOSÉ VILA. Ningún logotipo de terceros en sillones, máquinas, frascos ni rótulos.
- **Licencias:** ningún recurso externo sin anotarlo antes en `docs/07`. Solo CC0 o CC BY; SIL OFL para tipografías; ODbL para OpenStreetMap, con atribución.
- **Peso:** la isla 3D inicial tiene 350 KB (gzip) y el margen es pequeño. Postproceso en trozo diferido; nada de `Text` de drei; Basis desde `public/basis/`; Leaflet y la demo de reservas, fuera de la isla.
- **Por fases:** sigue `docs/08-hoja-de-ruta.md`. No pases de fase sin la aprobación de Luis; no pulas acabados antes de aprobar la composición.
- **Verificación visual:** tras cambios en escena, cámara o interfaz, usa la skill `verificar-visual` y enseña las capturas.
- **Ramas y despliegue:** se trabaja en `dev` (previsualizaciones). Subir a `test` (`josevilatest.vercel.app`) cuando Luis lo pida. Subir a `prod` (`josevila.vercel.app`) es producción: **solo con aprobación explícita**. Sin petición de Luis, no hagas commit: pregunta.
- **Commits:** mensajes breves en inglés, sin atribución a Claude ni `Co-Authored-By`.

## Agentes (`.claude/agents/`)
El **hilo principal** coordina, habla con Luis y hace él mismo el trabajo acoplado de escena, luz y cámara. Los agentes se usan para tareas **acotadas o de revisión**, sin editar en paralelo los mismos ficheros. Configuración y reglas de coordinación: `docs/10-metodologia.md`, punto 4.

| Agente | Cuándo usarlo |
|---|---|
| `escena-3d` | Construir o modificar geometría y disposición de un bloque concreto del local |
| `coreografia-camara` | Trayectorias, pausas, media vuelta, encuadres móviles, colisiones |
| `luz-y-materiales` | Materiales, luces, reflejos, haces, motas, neblina, luz horneada y postproceso sobre el local ya maquetado |
| `interfaz` | Componentes Astro, colecciones, páginas, demo de reservas, responsive (no toca la isla 3D) |
| `buscador-assets` | Buscar recursos con licencia libre y verificar licencias (no edita código) |
| `auditor-rendimiento` | Medir Lighthouse, peso, FPS y llamadas de dibujo frente a los presupuestos (no edita código) |
| `revisor-visual` | Comparar capturas con la dirección de arte y la lista de comprobación (no edita código) |

## Comandos
- Servidor: `astro dev --background`; `astro dev stop|status|logs`. La URL real la da `astro dev status` (el puerto puede no ser 4321).
- Producción local: `npm run build` y `npm run preview`.
- Tipos: `npx astro check` (también lo lanza un hook tras cada edición de `.ts`, `.tsx` o `.astro`). Pruebas: `npm run test`.
- Capturas: `node scripts/capturar.mjs [planos] [--base=url] [--medir]` (desde la fase 1).
- Assets: `npx gltf-transform …` y `toktx` (ver `docs/07`, «Herramientas»).
