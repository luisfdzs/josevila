// Seis marcos de latón con láminas en la pared izquierda del fondo (docs/03, «Fondo»).
// Maqueta en bloques (fase 1): marcos de cuatro listones y una lámina lisa rehundida,
// dos llamadas de dibujo. Las láminas abstractas por código (con GALERIA.semilla) son de la fase 2.
import { useMemo } from 'react';
import { GALERIA } from '../../../datos/barberia';
import { Cajas, type Caja } from './Cajas';
import { MATERIALES } from './materiales';

function piezas() {
  const { x, marco, lamina, columnasZ, filasY } = GALERIA;
  const { ancho, alto, perfil: p, grueso } = marco;
  const xm = x + grueso / 2;
  const marcos: Caja[] = [];
  const laminas: Caja[] = [];
  for (const z of columnasZ)
    for (const y of filasY) {
      marcos.push(
        { posicion: [xm, y + alto / 2 - p / 2, z], tamano: [grueso, p, ancho] },
        { posicion: [xm, y - alto / 2 + p / 2, z], tamano: [grueso, p, ancho] },
        { posicion: [xm, y, z + ancho / 2 - p / 2], tamano: [grueso, alto - 2 * p, p] },
        { posicion: [xm, y, z - ancho / 2 + p / 2], tamano: [grueso, alto - 2 * p, p] },
      );
      laminas.push({ posicion: [x + lamina.grueso / 2, y, z], tamano: [lamina.grueso, alto - 2 * p, ancho - 2 * p] });
    }
  return { marcos, laminas };
}

export function Galeria() {
  const { marcos, laminas } = useMemo(piezas, []);
  return (
    <group>
      <Cajas cajas={marcos} material={MATERIALES.laton} />
      <Cajas cajas={laminas} material={MATERIALES.blancoRoto} />
    </group>
  );
}
