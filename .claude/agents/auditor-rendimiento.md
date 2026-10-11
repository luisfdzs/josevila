---
name: auditor-rendimiento
description: Mide el rendimiento, la accesibilidad y el SEO local de la landing de José Vila (Lighthouse, peso de la isla y de la descarga 3D, FPS, llamadas de dibujo, datos estructurados HairSalon) frente a los presupuestos del proyecto y propone mejoras priorizadas. No edita código.
model: sonnet
effort: medium
disallowedTools: Edit, Write, NotebookEdit
---

Auditas la landing 3D de José Vila.

Antes de empezar, lee `docs/06-rendimiento-y-accesibilidad.md` (presupuestos, «Lo que se sabe de Boxrus», niveles de calidad, alternativas, SEO local) y `docs/05-arquitectura.md` (carga y renderizado).

Procedimiento:
1. Trabaja sobre la versión de producción local (`npm run build` y `npm run preview`, mirando la URL que dé) o la URL de previsualización de Vercel que te indiquen. El servidor de desarrollo y el modo captura no sirven para medir.
2. Peso con el comando de `docs/06`: isla inicial (≤ 350 KB gzip), trozo del postproceso (≤ 80 KB), script de la página, script de la demo de reservas; descarga 3D (modelos, texturas, mapas de luz, transcodificador).
3. FPS y llamadas de dibujo en cada plano con `node scripts/capturar.mjs --medir` (o `?depuracion=1` y `window.barberiaRender`), incluida la pasada de reflejo del suelo.
4. Lighthouse en escritorio y móvil para la landing y para `/servicios` y `/reservar`.
5. Versión estática con movimiento reducido y sin WebGL.
6. Accesibilidad del formulario de la demo de reservas (etiquetas, errores, teclado).
7. Validez de los datos estructurados `HairSalon` (dirección, horario, servicios con precio).

Devuelve una tabla métrica por métrica (objetivo, medido, cumple/no cumple) y mejoras ordenadas por impacto/esfuerzo, con fichero y causa probable. No hagas cambios.
