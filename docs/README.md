# Plan de José Vila — landing 3D «La barbería»

Índice de la documentación del proyecto. Cada documento es **vivo**: las cifras (coordenadas, encuadres, presupuestos) son hipótesis de partida y se ajustan al verlas renderizadas. Cuando algo cambie, se actualiza el documento en el mismo cambio y se anota en `09-decisiones-y-preguntas-abiertas.md`.

| Documento | Contenido |
|---|---|
| [01-vision.md](01-vision.md) | Qué es José Vila, objetivo de la landing, alcance y sensación buscada |
| [02-direccion-de-arte.md](02-direccion-de-arte.md) | La barbería descrita con palabras: concepto, paleta, elementos, luz, lista de comprobación |
| [03-escena.md](03-escena.md) | El local: medidas, coordenadas, puestos, sillón protagonista, techo, luz natural |
| [04-recorrido-y-paradas.md](04-recorrido-y-paradas.md) | Ruta de cámara, las 5 paradas, encuadres, textos y reglas de coreografía |
| [05-arquitectura.md](05-arquitectura.md) | Stack, carpetas, contenido editable, código que se reutiliza de Boxrus, flujo scroll → cámara → interfaz, despliegue |
| [06-rendimiento-y-accesibilidad.md](06-rendimiento-y-accesibilidad.md) | Presupuestos medibles, niveles de calidad, alternativas, accesibilidad, SEO |
| [07-assets-y-licencias.md](07-assets-y-licencias.md) | Qué recursos hacen falta, de dónde salen, herramientas y registro de licencias |
| [08-hoja-de-ruta.md](08-hoja-de-ruta.md) | Fases con tareas, criterios de aceptación, puntos de aprobación y punto de partida de cada una |
| [09-decisiones-y-preguntas-abiertas.md](09-decisiones-y-preguntas-abiertas.md) | Registro de decisiones y lo que falta por decidir |
| [10-metodologia.md](10-metodologia.md) | Cómo se trabaja: sesiones, fases, agentes y su configuración, verificación, ramas, memoria |

Configuración de Claude Code del proyecto: `.claude/CLAUDE.md` (reglas), `.claude/agents/` (7 agentes), `.claude/skills/verificar-visual/` (comprobación visual de los planos), `.claude/hooks/` (comprobación de tipos) y `.claude/memory/` (memoria local, no versionada).

Proyectos hermanos con la misma metodología: **Billaron** (`C:\Proyectos\billaron\billaron`, el primero) y **Boxrus** (`C:\Proyectos\boxrus`, la plantilla más cercana y de la que se reutiliza código).
