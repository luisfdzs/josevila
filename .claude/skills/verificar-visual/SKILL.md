---
name: verificar-visual
description: Captura los 7 planos del recorrido 3D de José Vila (prólogo, 5 paradas, epílogo) en escritorio y móvil con el modo de captura determinista y los compara con la dirección de arte. Úsala tras cualquier cambio en la escena, la cámara, la luz o la interfaz, o cuando pidan «enséñame cómo queda».
---

# Verificar visualmente el recorrido

Requiere la fase 1 (escena, `?parada`, `?captura` y la señal `data-barberia-lista`). Antes de eso no hay nada que capturar: dilo.

## 1. Preparar
1. `astro dev status`; si no está en marcha, `astro dev --background`. **Usa la URL que devuelva** (en este equipo el 4321 suele estar ocupado y sale 4322). O la URL de Vercel si te la indican.
   - Si `--background` falla («failed to start within 30s»), lanza `npx astro dev` como tarea en segundo plano de Claude Code y lee la URL de su salida. Al terminar, para la tarea **y comprueba que nadie siga escuchando en el puerto** (`Get-NetTCPConnection -LocalPort <puerto> -State Listen`; cerrar con `Stop-Process`).
2. Para medir FPS, usa la compilación de producción (`npm run build` y `npm run preview`), no el servidor de desarrollo.

## 2. Capturar

### Método principal: Playwright (`scripts/capturar.mjs`)
```bash
node scripts/capturar.mjs                      # los 7 planos, escritorio y móvil, en capturas/
node scripts/capturar.mjs P,4 --base=http://localhost:4322
node scripts/capturar.mjs --salida=capturas/fase1-ronda2
node scripts/capturar.mjs --medir              # además FPS y llamadas de dibujo por plano
```
Usa Chrome del sistema sin interfaz con la GPU real, tamaños exactos (escritorio 1440 × 900; móvil 390 × 844 con DPR 2, táctil) y espera a `html[data-barberia-lista]`. Funciona aunque la ventana de Chrome esté oculta. Recoge los errores y avisos de consola. Las capturas quedan en `capturas/` (ignorada por git); usa una subcarpeta por ronda para comparar antes/después.

Para verlas, lee los PNG con la herramienta de lectura de ficheros.

### Respaldo: Claude in Chrome con un iframe
Solo si el script no está disponible o hace falta interactuar (gestos, menú):
- Invoca la skill `claude-in-chrome` y abre una pestaña nueva (no reutilices las de Luis).
- La ventana no se deja redimensionar (viewport ~1920 × 855, Chrome al 75 % de zoom): carga la página **dentro de un iframe** del tamaño exacto, escalado con CSS para que quepa.
- **Un solo lienzo WebGL a la vez**: reutiliza un único iframe. La recarga de Vite borra los auxiliares de `javascript_tool`: defínelos en la misma llamada que los usa. Las llamadas cortan a los 45 s: lanza lo largo en segundo plano (`window.resultado`) y léelo después.
- Si `document.visibilityState === 'hidden'`, no hay fotogramas y la señal no llega nunca, sin errores: no depures el código; pide a Luis que restaure la ventana o usa el método principal.
- La salida de `javascript_tool` se bloquea si contiene una URL con consulta (`?parada=…`): devuelve solo la ruta.
- Auxiliar (definirlo y usarlo en la misma llamada):
```js
window.uno = async (parada, w, h, extra = '') => {
  document.documentElement.innerHTML = '<body style="margin:0;background:#333"></body>';
  scrollTo(0, 0);
  const k = Math.min(1, (innerHeight - 10) / h, (innerWidth - 10) / w);
  const f = document.createElement('iframe');
  f.style.cssText = `width:${w}px;height:${h}px;border:0;display:block;transform-origin:0 0;transform:scale(${k})`;
  f.src = `/?parada=${parada}&captura=1${extra}`;
  document.body.appendChild(f);
  for (let i = 0; i < 75; i++) { await new Promise(r => setTimeout(r, 200)); try { if (f.contentDocument.documentElement.dataset.barberiaLista !== undefined) break; } catch {} }
  await new Promise(r => setTimeout(r, 600));
  return { w: w * k, h: h * k };
};
await uno('P', 1440, 900)
```
  Después, `computer → zoom` sobre la región del iframe con `save_to_disk: true` (las coordenadas van en el marco de la captura de pantalla, que puede estar reducido respecto a los px CSS).
- Para probar gestos del móvil: `?parada=N&paginado=1` **sin** `captura` (el modo captura desactiva el scroll por paradas), en un iframe de 390 × 844, con `TouchEvent` simulados.

Si `?parada` o `?captura` no funcionan, dilo en el informe en lugar de capturar a mano con scroll: sin ellos las capturas no son comparables.

## 3. Comparar
Con `docs/02-direccion-de-arte.md` (lista de comprobación y «Evitar») y `docs/04-recorrido-y-paradas.md` (qué debe verse en cada plano):
- ¿El encuadre muestra lo previsto?
- Lista de comprobación punto por punto (atención especial: solo la marca JOSÉ VILA, ninguna persona, nada copiado de la referencia, luz natural presente, suelo con vetas).
- ¿La interfaz superpuesta (tarjeta, logotipo, píldora en móvil) es legible y no tapa el elemento protagonista?
- Consola: errores o avisos de WebGL. El aviso `THREE.Clock: This module has been deprecated` viene de React Three Fiber y es inofensivo.

Para una revisión de composición más a fondo, pasa las rutas de las capturas al agente `revisor-visual`.

## 4. Informar
- Tabla: plano × (encuadre, lista de comprobación, interfaz, consola) con cumple / no cumple.
- Desviaciones concretas ordenadas por gravedad, con la causa probable.
- Las capturas (rutas en disco) para que Luis las vea y decida.
- Si usaste Chrome, cierra la pestaña que abriste; si arrancaste un servidor, déjalo como estaba.
