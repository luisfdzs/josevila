import { describe, expect, it } from 'vitest';
import { PARADAS, RECORRIDO } from '../src/datos/paradas';
import { comprobarColisiones, crearObstaculos } from '../src/lib/colisiones';
import { calcularPausas, crearTrayectoria, progresoDeParada, type Variante } from '../src/lib/trayectoria';

const VARIANTES: Variante[] = ['escritorio', 'movil'];

describe('paradas (docs/04)', () => {
  it('7 planos en orden, con encuadres y textos completos', () => {
    expect(PARADAS.map((p) => p.id)).toEqual(['P', '1', '2', '3', '4', '5', 'E']);
    for (const p of PARADAS) {
      for (const v of VARIANTES) {
        expect(p[v].posicion).toHaveLength(3);
        expect(p[v].mira).toHaveLength(3);
        expect(p[v].focal).toBeGreaterThan(0);
      }
      expect(p.interfaz.titular.length).toBeGreaterThan(0);
    }
  });

  it('desplazamiento vertical del objetivo acotado; en móvil, el punto de mira de P, 3, 4 y 5 entre el 30 % y el 40 % de la altura', () => {
    for (const p of PARADAS)
      for (const v of VARIANTES) {
        const d = p[v].desplazamientoVertical ?? 0;
        expect(d).toBeGreaterThanOrEqual(0);
        expect(d).toBeLessThanOrEqual(0.25);
      }
    for (const id of ['P', '3', '4', '5']) {
      const d = PARADAS.find((p) => p.id === id)!.movil.desplazamientoVertical ?? 0;
      // El punto de mira queda a (0,5 − d) de la altura, contando desde arriba.
      expect(0.5 - d).toBeGreaterThanOrEqual(0.3);
      expect(0.5 - d).toBeLessThanOrEqual(0.4);
    }
  });

  it('la prueba de colisiones cubre todos los obstáculos de docs/04', () => {
    const nombres = new Set(crearObstaculos().map((o) => o.nombre));
    for (const n of ['sillón de barbero', 'consola', 'espejo', 'mostrador', 'banco de espera', 'poste de barbero', 'planta', 'lavacabezas', 'estantería', 'tarima', 'sillón protagonista', 'marco de la galería', 'revestimiento de listones', 'envolvente'])
      expect(nombres).toContain(n);
  });

  it('pausas ordenadas que cubren de 0 a 1', () => {
    const pausas = calcularPausas();
    expect(pausas[0].inicio).toBe(0);
    expect(pausas.at(-1)!.fin).toBeCloseTo(1, 10);
    pausas.slice(1).forEach((p, i) => expect(p.inicio).toBeGreaterThan(pausas[i].fin));
  });
});

describe.each(VARIANTES)('trayectoria (%s)', (variante) => {
  const trayectoria = crearTrayectoria(variante);

  it('en el centro de cada pausa la cámara está en el encuadre de la parada', () => {
    for (const parada of PARADAS) {
      const pose = trayectoria.evaluar(progresoDeParada(parada.id)!);
      const [x, y, z] = parada[variante].posicion;
      expect(pose.posicion.distanceTo({ x, y, z } as never)).toBeLessThan(0.02);
    }
  });

  it('en el centro de cada pausa el objetivo tiene el desplazamiento del encuadre', () => {
    for (const parada of PARADAS)
      expect(trayectoria.evaluar(progresoDeParada(parada.id)!).desplazamiento).toBeCloseTo(parada[variante].desplazamientoVertical ?? 0, 6);
  });

  it('es reversible: el mismo progreso da la misma pose', () => {
    const a = trayectoria.evaluar(0.4321);
    trayectoria.evaluar(0.9);
    const b = trayectoria.evaluar(0.4321);
    expect(a.posicion.toArray()).toEqual(b.posicion.toArray());
    expect(a.mira.toArray()).toEqual(b.mira.toArray());
    expect(a.fov).toBe(b.fov);
    expect(a.desplazamiento).toBe(b.desplazamiento);
  });

  it('no atraviesa ningún obstáculo', () => {
    const colisiones = comprobarColisiones((p) => trayectoria.evaluar(p).posicion, RECORRIDO.margenColision);
    const resumen = [...new Map(colisiones.map((c) => [c.obstaculo, c])).values()].map(
      (c) => `${c.obstaculo} @${c.progreso.toFixed(3)} d=${c.distancia.toFixed(2)} (${c.punto.x.toFixed(2)}, ${c.punto.y.toFixed(2)}, ${c.punto.z.toFixed(2)})`,
    );
    expect(resumen).toEqual([]);
  });

  it('limita la velocidad angular de la mirada', () => {
    let maximo = 0;
    let anterior = trayectoria.evaluar(0);
    let dirAnterior = anterior.mira.clone().sub(anterior.posicion).normalize();
    for (let i = 1; i <= 4000; i++) {
      const pose = trayectoria.evaluar(i / 4000);
      const dir = pose.mira.clone().sub(pose.posicion).normalize();
      maximo = Math.max(maximo, dir.angleTo(dirAnterior));
      dirAnterior = dir;
    }
    // Grados por cada 1 % de progreso (el tramo crítico es la media vuelta de 4 a 5).
    expect((maximo * 4000 * 0.01 * 180) / Math.PI).toBeLessThan(RECORRIDO.giroMaximo);
  });

  it('media vuelta de 4 a 5: giro amplio mientras avanza, nunca sobre sí misma', () => {
    const k = PARADAS.findIndex((p) => p.id === '5');
    const { pausas } = trayectoria;
    const [desde, hasta] = [pausas[k - 1].fin, pausas[k].inicio];
    const direccion = (p: number) => {
      const pose = trayectoria.evaluar(p);
      return { posicion: pose.posicion.clone(), dir: pose.mira.clone().sub(pose.posicion).normalize() };
    };
    const inicio = direccion(desde);
    const fin = direccion(hasta);
    expect((inicio.dir.angleTo(fin.dir) * 180) / Math.PI).toBeGreaterThan(120);
    // En cualquier ventana de 1 % de progreso con giro apreciable, la cámara se desplaza:
    // como mucho 60° de giro por metro recorrido (girar sobre sí misma sería infinito).
    const n = 400;
    const ventana = 0.01;
    let peor = 0;
    for (let i = 0; i <= n; i++) {
      const p = desde + ((hasta - desde - ventana) * i) / n;
      const a = direccion(p);
      const b = direccion(p + ventana);
      const giro = (a.dir.angleTo(b.dir) * 180) / Math.PI;
      if (giro > 5) peor = Math.max(peor, giro / a.posicion.distanceTo(b.posicion));
    }
    expect(peor).toBeLessThan(60);
  });
});
