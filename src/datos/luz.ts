// Valores de luz. Fase 1: iluminación neutra de la maqueta en bloques, solo para
// leer volúmenes y encuadres. La luz definitiva (sol, cielo, retícula, foco del
// sillón, entorno capturado, luz horneada y postproceso) llega en la fase 3.
import type { Vec3 } from './barberia';

export const LUZ = {
  exposicion: 1,
  fondo: '#0c0d0f',
  maqueta: {
    ambiente: 0.35,
    hemisferio: { cielo: '#e6ebf0', suelo: '#1a1b1d', intensidad: 0.45 },
    /** Puntos sobre el pasillo que imitan la retícula del techo (y algo más abajo). */
    puntos: {
      y: 3.5,
      z: [-2, -7, -12, -17, -22],
      color: '#eef3f8',
      intensidad: 9,
      alcance: 14,
    },
    /** Luz cálida desde el patio y el lucernario, de atrás arriba. */
    patio: { posicion: [1.5, 14, -30] as Vec3, color: '#ffe9c9', intensidad: 0.5 },
  },
} as const;
