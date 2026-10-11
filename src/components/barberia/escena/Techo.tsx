import { useMemo } from 'react';
import { ENVOLVENTE, LUCERNARIO, RETICULA, reticulaTransversalesZ } from '../../../datos/barberia';
import { Cajas, type Caja } from './Cajas';
import { MATERIALES } from './materiales';

/** Grosor de las tiras emisivas bajo el plano del techo. */
const GROSOR = 0.01;
const Y = ENVOLVENTE.alto - GROSOR / 2;

/**
 * Retícula de líneas de luz empotradas en el techo (docs/03): dos longitudinales
 * sobre el pasillo, una transversal por pareja de puestos y otra en la
 * recepción, de pared a pared, y un marco alrededor del lucernario.
 */
function tiras(): Caja[] {
  const { ancho, z0, z1, marcoLucernario: m } = RETICULA;
  const anchoLocal = ENVOLVENTE.xMax - ENVOLVENTE.xMin;
  const [cx, , cz] = LUCERNARIO.centro;
  const lista: Caja[] = [
    ...RETICULA.longitudinalesX.map((x): Caja => ({ posicion: [x, Y, (z0 + z1) / 2], tamano: [ancho, GROSOR, z0 - z1] })),
    ...reticulaTransversalesZ().map((z): Caja => ({ posicion: [0, Y, z], tamano: [anchoLocal, GROSOR, ancho] })),
  ];
  // Marco del lucernario: dos lados a lo largo de X y dos a lo largo de Z.
  for (const s of [-1, 1]) {
    lista.push({ posicion: [cx, Y, cz + (s * m) / 2], tamano: [m + ancho, GROSOR, ancho] });
    lista.push({ posicion: [cx + (s * m) / 2, Y, cz], tamano: [ancho, GROSOR, m + ancho] });
  }
  return lista;
}

export function Techo() {
  const cajas = useMemo(tiras, []);
  return <Cajas cajas={cajas} material={MATERIALES.lineaLuz} />;
}
