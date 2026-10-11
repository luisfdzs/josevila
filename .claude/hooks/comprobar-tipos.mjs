// Hook PostToolUse: tras editar .ts/.tsx/.astro ejecuta `astro check` y,
// si hay errores, se los devuelve a Claude (código de salida 2).
// Hasta que la fase 0 instale Astro, no hace nada.
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

let entrada = '';
process.stdin.on('data', (trozo) => (entrada += trozo));
process.stdin.on('end', () => {
  const fichero = JSON.parse(entrada).tool_input?.file_path ?? '';
  if (!/\.(ts|tsx|astro)$/.test(fichero)) process.exit(0);

  const raiz = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
  if (!existsSync(join(raiz, 'node_modules', 'astro'))) process.exit(0);

  try {
    execSync('npx astro check', { stdio: 'pipe', cwd: raiz });
  } catch (error) {
    const salida = `${error.stdout ?? ''}${error.stderr ?? ''}`;
    process.stderr.write(`astro check ha fallado:\n${salida.slice(-4000)}`);
    process.exit(2);
  }
});
