import { useMemo } from 'react';
import { Color } from 'three';
import { DINTEL, ENVOLVENTE, ESCAPARATE, LUCERNARIO, SUELO, VENTANAL } from '../../../datos/barberia';
import { crearAzar, entre } from '../../../lib/azar';
import { Cajas, type Caja } from './Cajas';
import { MATERIALES } from './materiales';

const { xMin, xMax, zFrente, zFondo, alto, grosor: g } = ENVOLVENTE;
/** Media anchura del hueco de la puerta. */
const puerta = ESCAPARATE.puerta.ancho / 2;

/** Caja entre dos esquinas opuestas. */
const entre2 = (x0: number, y0: number, z0: number, x1: number, y1: number, z1: number): Caja => ({
  posicion: [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2],
  tamano: [Math.abs(x1 - x0), Math.abs(y1 - y0), Math.abs(z1 - z0)],
});

/** Muros, dintel y techo por fuera del volumen interior, con los huecos del escaparate, el ventanal y el lucernario. */
function muros(): Caja[] {
  const { centro, lado } = LUCERNARIO;
  const [lx0, lx1] = [centro[0] - lado / 2, centro[0] + lado / 2];
  const [lz0, lz1] = [centro[2] - lado / 2, centro[2] + lado / 2];
  return [
    // Laterales.
    entre2(xMin - g, 0, zFondo - g, xMin, alto, zFrente + g),
    entre2(xMax, 0, zFondo - g, xMax + g, alto, zFrente + g),
    // Entrada: zócalo bajo el vidrio (abierto en el hueco de la puerta) y dintel macizo encima.
    entre2(xMin, 0, zFrente, -puerta, ESCAPARATE.zocalo, zFrente + g),
    entre2(puerta, 0, zFrente, xMax, ESCAPARATE.zocalo, zFrente + g),
    entre2(xMin, DINTEL.y0, zFrente, xMax, DINTEL.y1, zFrente + g),
    // Fondo: antepecho, franja alta y machones alrededor del ventanal.
    entre2(xMin, 0, zFondo - g, xMax, VENTANAL.y0, zFondo),
    entre2(xMin, VENTANAL.y1, zFondo - g, xMax, alto, zFondo),
    entre2(xMin, VENTANAL.y0, zFondo - g, VENTANAL.x0, VENTANAL.y1, zFondo),
    entre2(VENTANAL.x1, VENTANAL.y0, zFondo - g, xMax, VENTANAL.y1, zFondo),
    // Techo con el hueco del lucernario.
    entre2(xMin, alto, lz1, xMax, alto + g, zFrente),
    entre2(xMin, alto, zFondo, xMax, alto + g, lz0),
    entre2(xMin, alto, lz0, lx0, alto + g, lz1),
    entre2(lx1, alto, lz0, xMax, alto + g, lz1),
  ];
}

/**
 * Paredes del pozo del lucernario, del techo al vidrio. Van por dentro del hueco
 * (`e` hacia el centro) para no compartir plano con el canto del techo, que parpadeaba.
 */
function pozo(): Caja[] {
  const { centro, lado, yPozo } = LUCERNARIO;
  const [cx, , cz] = centro;
  const m = lado / 2;
  const e = 0.02;
  return [
    entre2(cx - m, alto, cz - m, cx - m + e, yPozo, cz + m),
    entre2(cx + m - e, alto, cz - m, cx + m, yPozo, cz + m),
    entre2(cx - m + e, alto, cz - m, cx + m - e, yPozo, cz - m + e),
    entre2(cx - m + e, alto, cz + m - e, cx + m - e, yPozo, cz + m),
  ];
}

/** Vidrios luminosos: escaparate (cielo), ventanal del patio y lucernario. La carpintería va aparte. */
function vidrios() {
  const { centro, lado, yPozo } = LUCERNARIO;
  return {
    // En el hueco de la puerta, el cielo llega hasta el suelo.
    cielo: [
      entre2(xMin, ESCAPARATE.zocalo, zFrente + 0.05, xMax, ESCAPARATE.vidrioArriba, zFrente + 0.07),
      entre2(-puerta, 0, zFrente + 0.05, puerta, ESCAPARATE.zocalo, zFrente + 0.07),
    ],
    patio: [entre2(VENTANAL.x0, VENTANAL.y0, zFondo - 0.07, VENTANAL.x1, VENTANAL.y1, zFondo - 0.05)],
    lucernario: [entre2(centro[0] - lado / 2, yPozo, centro[2] - lado / 2, centro[0] + lado / 2, yPozo + 0.02, centro[2] + lado / 2)],
  };
}

/** Piezas de piedra de 0,6 × 1,2 m con juntas finas y tono variable (con semilla). */
function piezasSuelo(): Caja[] {
  const azar = crearAzar(SUELO.semilla);
  const { pieza, junta, variacionTono } = SUELO;
  const base = new Color('#2a2b2e');
  const piezas: Caja[] = [];
  for (let z0 = zFrente; z0 > zFondo + 1e-6; z0 -= pieza.z) {
    const l = Math.min(pieza.z, z0 - zFondo);
    for (let x0 = xMin; x0 < xMax - 1e-6; x0 += pieza.x) {
      const a = Math.min(pieza.x, xMax - x0);
      piezas.push({
        posicion: [x0 + a / 2, -0.005, z0 - l / 2],
        tamano: [a - junta, 0.01, l - junta],
        color: base.clone().multiplyScalar(1 + entre(azar, -variacionTono, variacionTono)),
      });
    }
  }
  return piezas;
}

export function Envolvente() {
  const { cajasMuros, cajasPozo, cajasVidrio, cajasSuelo } = useMemo(
    () => ({ cajasMuros: muros(), cajasPozo: pozo(), cajasVidrio: vidrios(), cajasSuelo: piezasSuelo() }),
    [],
  );
  return (
    <group>
      <Cajas cajas={cajasMuros} material={MATERIALES.muro} />
      <Cajas cajas={cajasPozo} material={MATERIALES.pozo} />
      <Cajas cajas={cajasVidrio.cielo} material={MATERIALES.cielo} />
      <Cajas cajas={cajasVidrio.patio} material={MATERIALES.patio} />
      <Cajas cajas={cajasVidrio.lucernario} material={MATERIALES.lucernario} />
      {/* Base oscura bajo las piezas: se ve en las juntas. */}
      <Cajas cajas={[entre2(xMin, -0.02, zFondo, xMax, -0.01, zFrente)]} material={MATERIALES.junta} />
      <Cajas cajas={cajasSuelo} material={MATERIALES.suelo} />
    </group>
  );
}
