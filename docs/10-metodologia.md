# 10 · Metodología de trabajo

Cómo se trabaja en José Vila con Claude Code. Está pensado para que **cualquier sesión nueva, sin contexto**, pueda retomar el proyecto leyendo este documento, `.claude/CLAUDE.md` y la memoria local. Es la misma metodología de Billaron y Boxrus, con lo aprendido en ellos.

## 1. Principios
1. **Documentar antes de construir.** El plan vive en `docs/`; el código lo traduce (`src/datos/` es la fuente única de cifras).
2. **Por fases, con aprobación.** Ninguna fase empieza sin que Luis apruebe la anterior. Composición antes que acabado.
3. **Verificar viendo.** Todo cambio visible se comprueba con capturas deterministas y se enseña.
4. **Documentos vivos.** Si una cifra cambia al verla, se actualiza el documento en el mismo cambio y se anota en `09`.
5. **Reutilizar.** Lo que ya funciona en Boxrus se copia y se adapta (`05`, «Código que se reutiliza de Boxrus»).
6. **Preguntar lo que es de Luis.** Las decisiones de producto, marca, contenido y publicación son suyas; las técnicas con criterio claro las toma Claude y las anota en `09`.

## 2. Empezar una sesión nueva
1. **Abrir Claude Code en `C:\Proyectos\JoseVila`** (la raíz del repo). Si se abre en otra carpeta, no se cargan los agentes, la skill ni el hook del proyecto (pasó en Billaron).
2. Se cargan solos: `.claude/CLAUDE.md` (reglas), que importa `.claude/memory/MEMORY.md` (memoria local), y el `CLAUDE.md` de Astro de la raíz (servidor y documentación de Astro).
3. Leer `docs/08-hoja-de-ruta.md` («Estado» y la fase en curso: su «Punto de partida» dice qué más leer) y la memoria `arranque-fase-N` si existe.
4. Pegar el **prompt de arranque** de la fase (en la memoria `arranque-fase-N`; plantilla en el punto 10).
5. Si faltan los agentes del proyecto en la lista de tipos de agente, la sesión no se abrió en la raíz: avisar a Luis y, mientras, lanzar un agente genérico con el mismo `.md` como instrucciones (mismo modelo y sin edición si es de revisión).

## 3. Ciclo de una fase
1. **Arranque:** leer los documentos del «Punto de partida» de la fase en `08`.
2. **Preguntas:** hacer a Luis las preguntas abiertas de `09` que esa fase necesita, con una recomendación en cada una.
3. **Plan breve:** qué se hará, en qué orden, qué hará el hilo principal y qué cada agente. Esperar el visto bueno si el plan cambia algo de lo documentado.
4. **Trabajo** en pasos pequeños, cada uno con sus pruebas (Vitest) y comprobación de tipos (el hook lo hace solo).
5. **Verificación** visual de cada paso con la skill `verificar-visual`; revisión de composición con `revisor-visual` al final de cada ronda.
6. **Cierre de fase:**
   - criterios de aceptación de `08` marcados, con el resultado y las desviaciones;
   - cifras finales en `03`, `04` y una tabla «Estado medido (fase N)» en `06`;
   - decisiones nuevas en `09`;
   - memoria local `arranque-fase-(N+1)` con el estado real, los riesgos, las preguntas pendientes y el **prompt de arranque** de la siguiente fase (y borrar la de la fase cerrada);
   - commit en `dev` y ofrecer subir a `test`;
   - **capturas de los 7 planos y resumen para Luis**, que aprueba.
7. La aprobación de Luis se anota en `08` («✅ Fase N aprobada por Luis el …») y en `09`.

## 4. Hilo principal y agentes
El **hilo principal** coordina, habla con Luis y hace él mismo el trabajo **acoplado** de escena, luz y cámara (en Boxrus, dividirlo entre agentes en paralelo daba conflictos). Los agentes se usan para tareas **acotadas o de revisión**.

Hay **7 agentes** en `.claude/agents/`:

| Agente | Modelo | Esfuerzo | Edita | Herramientas vetadas | Cuándo | Fases |
|---|---|---|---|---|---|---|
| `escena-3d` | opus | high | Sí | — | Construir o modificar la geometría y disposición de un bloque concreto del local (puestos, fondo, recepción…) | 1, 2 |
| `coreografia-camara` | opus | high | Sí | — | Trayectorias, pausas, media vuelta, encuadres móviles, colisiones, enlace con el scroll | 1 (y ajustes en 3–6) |
| `luz-y-materiales` | opus | xhigh | Sí | — | Materiales, luces, reflejos, haces, motas, neblina, luz horneada y postproceso sobre el local ya maquetado | 3 (y 6) |
| `interfaz` | sonnet | medium | Sí | — | Componentes Astro, colecciones, páginas, demo de reservas, responsive y accesibilidad. **No toca la isla 3D** | 4 (y 1 para lo provisional) |
| `buscador-assets` | sonnet | low | No | Edit, Write, NotebookEdit | Buscar recursos con licencia libre y verificarla en la página original | 2 |
| `auditor-rendimiento` | sonnet | medium | No | Edit, Write, NotebookEdit | Medir Lighthouse, peso, FPS y llamadas de dibujo frente a `06` | 2, 3, 5 |
| `revisor-visual` | opus | high | No | Edit, Write, NotebookEdit | Comparar capturas con `02` y `04`; desviaciones priorizadas y valoración honesta | Todas las que cambian lo visible |

Cada `.md` de agente define: qué documentos leer antes de empezar, reglas propias, qué no debe tocar y qué debe devolver al terminar. **Al empezar cada fase** se actualiza la sección «Estado del código al empezar» del agente que vaya a trabajar en ella (como se hizo en Boxrus), para que no tenga que redescubrirlo.

### Reglas de coordinación
- **Nunca dos agentes editando los mismos ficheros a la vez.** En paralelo, solo agentes de lectura (buscador, auditor, revisor) o agentes de edición sobre carpetas disjuntas.
- El hilo principal **revisa el diff** de cada agente que edita antes de dar el paso por bueno.
- Al lanzar un agente, darle: el objetivo concreto, los ficheros o el bloque afectado, las cifras de partida y el criterio de «terminado». No asumir que sabe lo hablado con Luis.
- Los agentes **no hacen push** ni tocan `test` o `prod`; commits solo si se les pide, en `dev`.
- Los resultados de los agentes no los ve Luis: el hilo principal le resume lo importante.

## 5. Verificación
- **Pruebas:** `npm run test` (Vitest) en cada paso con lógica: medidas, recorrido, colisiones, giro, contenido, reservas.
- **Tipos:** el hook `.claude/hooks/comprobar-tipos.mjs` ejecuta `astro check` tras cada edición de `.ts`, `.tsx` o `.astro` y devuelve los errores.
- **Visual:** skill `verificar-visual`. Método principal desde la fase 1: `node scripts/capturar.mjs` (Playwright con el Chrome del sistema y la GPU real, tamaños exactos 1440 × 900 y 390 × 844, espera a `data-barberia-lista`). Respaldo: Claude in Chrome con un iframe del tamaño exacto.
- **Peso y FPS:** tras `npm run build`, el comando de `06`; FPS y llamadas de dibujo con `capturar.mjs --medir` sobre `npm run preview`.
- **Antes de dar algo por hecho:** pruebas en verde, tipos en verde, capturas vistas. Si algo falla o se salta, se dice.

## 6. Documentación y decisiones
- `docs/` es la fuente de verdad del plan; `src/datos/`, la de las cifras en código. Deben coincidir (hay pruebas que lo comprueban).
- Toda decisión (de Luis o de Claude) va a la tabla de `09` con fecha y motivo. Las de Claude por criterio delegado se marcan como tales y revisables.
- Las preguntas abiertas llevan número fijo (no se renumeran al cerrarse) y recomendación.

## 7. Memoria local
- Vive en `.claude/memory/` (no versionada: está en `.gitignore`), un fichero por hecho y el índice `MEMORY.md`, que `.claude/CLAUDE.md` importa.
- Qué se guarda: estado y arranque de la fase en curso, particularidades del equipo (`entorno-local`), forma de trabajar de Luis, IDs de Vercel y del repositorio, la referencia visual. Qué **no**: lo que ya está en `docs/` o en el historial de git.
- Se actualiza al cerrar cada fase y cuando Luis corrige o confirma una forma de trabajar.

## 8. Git y despliegue
- Se trabaja en **`dev`**. Commits **breves, en inglés, sin atribución a Claude** (ni `Co-Authored-By`).
- Sin petición expresa de Luis no se hace commit: se deja el cambio y se le pregunta. Cuando dice «súbelo a test», avance rápido de `test` hasta `dev`; «sube a test y prod» / «a todas las ramas»: `git push origin dev dev:test dev:prod`.
- **Producción (`prod`) solo con aprobación explícita de Luis en ese momento.** Tras cada push a `test` o `prod`, comprobar el *target* y los alias del despliegue.

## 9. Comunicación con Luis
- En español, conciso; tablas y listas para estados.
- **Alcance acotado:** si pide «solo eso», se cambia solo eso (más pruebas y documentos que lo describen).
- **«Solo información» / «no hagas nada»:** responder con datos, sin ejecutar acciones que modifiquen nada.
- Ante una dirección o un gesto dudoso (sentidos de deslizamiento, duraciones), preguntar antes de implementar.
- Las preguntas, con opciones y una recomendación; no preguntar lo que tiene un criterio claro o se puede comprobar.

## 10. Plantilla del prompt de arranque de fase
```
Empezamos la fase N (<nombre>) de José Vila. <Estado en una línea: qué se aprobó y qué hay publicado>.

Antes de nada, lee docs/08 (fase N: punto de partida), <documentos del punto de partida>,
docs/10 (metodología) y la memoria local del proyecto (arranque-fase-N y entorno-local).

Quiero que:
1. Me hagas primero las preguntas <números> de docs/09 y me presentes un plan breve de la
   fase: qué harás tú y qué cada agente.
2. <Trabajo de la fase, en pasos>.
3. Me enseñes capturas de escritorio y móvil con verificar-visual tras cada cambio visible.

Trabaja en dev; nada a test ni a prod salvo que te lo pida. No pases a la fase N+1 sin mi aprobación.
```

## 11. Trampas conocidas (de Billaron y Boxrus)
- **Ventana de Chrome oculta** (`document.visibilityState === 'hidden'`): no hay fotogramas y la señal de «lista» no llega, sin errores. Usar `scripts/capturar.mjs` o pedir a Luis que restaure la ventana.
- **Un solo lienzo WebGL por pestaña**; la recarga de Vite borra los auxiliares de `javascript_tool`.
- **Puerto variable**: mirar siempre `astro dev status`. `astro dev --background` a veces falla: lanzar `npx astro dev` como tarea en segundo plano y, al terminar, cerrar el proceso que siga escuchando.
- **Peso de la isla**: el margen es pequeño (~45 KB para la escena); medir tras cada dependencia nueva.
- **`Text` de drei**, CDN de drei para Basis o fuentes, HDRI genéricos: evitarlos.
- **NaN en sombreadores aditivos** se extiende con el bloom a toda la imagen: proteger los haces.
- **Moiré** en texturas repetidas finas (listones, juntas): mipmaps propios o relieve que se apaga a distancia.
- **Primer despliegue de Vercel** como producción: salvaguarda *Ignored Build Step* y comprobar el *target*.
- **Git Bash** convierte rutas que empiezan por `/` (`MSYS_NO_PATHCONV=1`); los heredoc largos con comillas fallan: escribir el script en el scratchpad.
