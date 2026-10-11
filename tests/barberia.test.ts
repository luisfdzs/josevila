import { describe, expect, it } from 'vitest';
import {
  CONSOLA,
  ENVOLVENTE,
  ESPEJO,
  LISTONES,
  LUCERNARIO,
  PUESTOS,
  SILLON,
  SILLON_PROTAGONISTA,
  TARIMA,
  VENTANAL,
  ZONAS,
  puestosZ,
  reticulaTransversalesZ,
} from '../src/datos/barberia';
import { crearObstaculos } from '../src/lib/colisiones';

describe('datos de la barbería (docs/03)', () => {
  it('local de 8,4 × 26 m y 4 m de alto, con el escaparate en z = 0', () => {
    expect(ENVOLVENTE.xMax - ENVOLVENTE.xMin).toBeCloseTo(8.4, 10);
    expect(ENVOLVENTE.zFrente - ENVOLVENTE.zFondo).toBe(26);
    expect(ENVOLVENTE.alto).toBe(4);
    expect([ZONAS.finEntrada, ZONAS.finPuestos]).toEqual([-4.4, -16.4]);
  });

  it('5 puestos por lado cada 2,4 m, dentro de la zona de puestos', () => {
    expect(PUESTOS.porLado).toBe(5);
    const z = puestosZ();
    z.forEach((zi, i) => expect(zi).toBeCloseTo([-5.6, -8, -10.4, -12.8, -15.2][i], 10));
    expect(Math.max(...z) + CONSOLA.largo / 2).toBeLessThanOrEqual(LISTONES.z0);
    expect(Math.min(...z) - CONSOLA.largo / 2).toBeGreaterThanOrEqual(LISTONES.z1);
    expect(reticulaTransversalesZ()).toHaveLength(6);
  });

  it('consola contra los listones, espejo sobre la consola y pasillo de ~4,9 m', () => {
    expect(CONSOLA.x + CONSOLA.fondo / 2).toBeCloseTo(ENVOLVENTE.xMax - LISTONES.grueso, 3);
    expect(ESPEJO.y0).toBeGreaterThan(CONSOLA.alto);
    expect(2 * (SILLON.x - SILLON.fondo / 2)).toBeCloseTo(4.9, 1);
    expect(SILLON.x + SILLON.fondo / 2).toBeLessThan(CONSOLA.x - CONSOLA.fondo / 2);
  });

  it('fondo: sillón protagonista sobre la tarima, bajo el lucernario y ante el ventanal', () => {
    expect(SILLON_PROTAGONISTA.centro[1]).toBe(TARIMA.alto);
    expect(SILLON_PROTAGONISTA.centro[2]).toBe(TARIMA.centro[2]);
    expect(Math.hypot(SILLON_PROTAGONISTA.ancho, SILLON_PROTAGONISTA.fondo) / 2).toBeLessThan(TARIMA.diametro / 2);
    // El lucernario cae algo detrás del sillón (el sol llega inclinado desde el patio).
    expect(LUCERNARIO.centro[2]).toBeLessThan(SILLON_PROTAGONISTA.centro[2]);
    expect(LUCERNARIO.centro[2] - LUCERNARIO.lado / 2).toBeGreaterThan(ENVOLVENTE.zFondo);
    expect((VENTANAL.x1 - VENTANAL.x0) / VENTANAL.panos).toBeCloseTo(0.975, 3);
  });

  it('los obstáculos de la prueba de colisiones quedan dentro del local', () => {
    const centro = { x: 0, y: 1.5, z: -13 };
    for (const o of crearObstaculos()) expect(o.distancia(centro), o.nombre).toBeGreaterThan(0);
  });
});
