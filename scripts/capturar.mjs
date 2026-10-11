// Capturas deterministas de los planos (skill verificar-visual) con Playwright sin interfaz y el
// Chrome del sistema, que usa la GPU real. Funciona aunque la ventana de Chrome esté oculta.
// (De Billaron, adaptado: señal `data-barberia-lista` y `window.barberiaRender`.)
//
// Uso: node scripts/capturar.mjs [planos] [--salida=carpeta] [--base=url] [--medir]
//   planos   P,1,2,3,4,5,E por defecto
//   --salida capturas/ por defecto (ignorada por git)
//   --base   http://localhost:4321 por defecto (la URL real la da `astro dev status`)
//   --medir  además, FPS y llamadas de dibujo por plano con ?depuracion=1 (docs/06), mejor sobre
//            `npm run preview`. La depuración añade unas 10 llamadas propias (trayectoria, esferas, ejes).
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright-core';

const CHROME = process.env.CHROME ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const ESPERA_PINTADO = 1500;
const ESPERA_MEDIDA = 3000;
const SEGUNDOS_FPS = 2;

const args = process.argv.slice(2);
const opcion = (nombre, defecto) => args.find((a) => a.startsWith(`--${nombre}=`))?.split('=')[1] ?? defecto;
const planos = (args.find((a) => !a.startsWith('--')) ?? 'P,1,2,3,4,5,E').split(',');
const salida = opcion('salida', 'capturas');
const base = opcion('base', 'http://localhost:4321');
const medir = args.includes('--medir');

const formatos = {
  escritorio: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  movil: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
};

mkdirSync(salida, { recursive: true });
const navegador = await chromium.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'],
});
const consola = new Set();
const medidas = [];

for (const [nombre, opciones] of Object.entries(formatos)) {
  const ctx = await navegador.newContext(opciones);
  const pagina = await ctx.newPage();
  pagina.on('console', (m) => {
    if (['error', 'warning'].includes(m.type())) consola.add(`[${nombre}] ${m.type()}: ${m.text()}`);
  });
  pagina.on('pageerror', (e) => consola.add(`[${nombre}] error: ${e.message}`));
  for (const p of planos) {
    await pagina.goto(`${base}/?parada=${p}&captura=1`, { waitUntil: 'load' });
    await pagina.waitForSelector('html[data-barberia-lista]', { state: 'attached', timeout: 60000 });
    await pagina.waitForTimeout(ESPERA_PINTADO);
    await pagina.screenshot({ path: `${salida}/${nombre}-${p}.png` });
    if (medir) {
      await pagina.goto(`${base}/?parada=${p}&depuracion=1`, { waitUntil: 'load' });
      await pagina.waitForSelector('html[data-barberia-lista]', { state: 'attached', timeout: 60000 });
      await pagina.waitForTimeout(ESPERA_MEDIDA);
      const medida = await pagina.evaluate(async (segundos) => {
        let fotogramas = 0;
        const fin = performance.now() + segundos * 1000;
        await new Promise((listo) => {
          const contar = () => (++fotogramas, performance.now() < fin ? requestAnimationFrame(contar) : listo());
          requestAnimationFrame(contar);
        });
        const { calls, triangles } = window.barberiaRender ?? {};
        return { fps: Math.round(fotogramas / segundos), llamadas: calls, triangulos: triangles };
      }, SEGUNDOS_FPS);
      medidas.push({ formato: nombre, plano: p, ...medida });
    }
  }
  const gpu = await pagina.evaluate(() => {
    const gl = document.createElement('canvas').getContext('webgl2');
    const ext = gl?.getExtension('WEBGL_debug_renderer_info');
    return ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : 'desconocida';
  });
  console.log(`${nombre}: GPU ${gpu}`);
  await ctx.close();
}
await navegador.close();

console.log(`Capturas en ${salida}/`);
if (medir) console.table(medidas);
console.log([...consola].join('\n') || 'Consola sin errores ni avisos');
