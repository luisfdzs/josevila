// Carpintería del escaparate y la puerta, rótulo JOSÉ VILA en el dintel (docs/03, «Escaparate y entrada»).
// El vidrio luminoso, el zócalo y el dintel los pinta Envolvente; aquí solo los perfiles negros y el latón.
import { useMemo } from 'react';
import { ENVOLVENTE, ESCAPARATE, ROTULO } from '../../../datos/barberia';
import { Cajas, type Caja } from './Cajas';
import { MATERIALES } from './materiales';

const { xMin, xMax, zFrente } = ENVOLVENTE;
const { zocalo, vidrioArriba, montantesX, perfil: p, fondoPerfil, puerta } = ESCAPARATE;

/** Caja entre dos esquinas opuestas. */
const caja = (x0: number, y0: number, z0: number, x1: number, y1: number, z1: number): Caja => ({
  posicion: [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2],
  tamano: [Math.abs(x1 - x0), Math.abs(y1 - y0), Math.abs(z1 - z0)],
});

/** Carpintería fija: marco perimetral, montantes, travesaño sobre la puerta. Cara interior en z = 0. */
function carpinteria(): Caja[] {
  const z0 = zFrente;
  const z1 = zFrente + fondoPerfil;
  const [xPuerta, xDivision] = montantesX;
  const lista: Caja[] = [
    // Travesaño superior, bajo el dintel, en todo el ancho.
    caja(xMin, vidrioArriba - p, z0, xMax, vidrioArriba, z1),
    // Jambas contra los muros laterales.
    caja(xMin, zocalo, z0, xMin + p, vidrioArriba - p, z1),
    caja(xMax - p, zocalo, z0, xMax, vidrioArriba - p, z1),
    // Travesaño sobre la puerta (montante fijo de vidrio encima).
    caja(-xPuerta, puerta.alto, z0, xPuerta, puerta.alto + p, z1),
  ];
  for (const s of [-1, 1]) {
    // Jamba de la puerta: por fuera del hueco de 1,8 m, desde el zócalo.
    lista.push(caja(s * xPuerta, zocalo, z0, s * (xPuerta + p), vidrioArriba - p, z1));
    // División del escaparate, centrada en su eje.
    lista.push(caja(s * (xDivision - p / 2), zocalo, z0, s * (xDivision + p / 2), vidrioArriba - p, z1));
    // Perfil inferior de los paños fijos, sobre el zócalo (la puerta llega al suelo).
    lista.push(caja(s * (xPuerta + p), zocalo, z0, s * (xMax - p), zocalo + p, z1));
  }
  return lista;
}

/** Dos hojas de 0,9 m: montantes, travesaño, rodapié; algo retranqueadas hacia dentro para leerse aparte. */
function hojas(): Caja[] {
  const { ancho, alto, perfilHoja: ph, fondoHoja, retranqueoHoja, rodapieHoja } = puerta;
  const z0 = zFrente - retranqueoHoja;
  const z1 = z0 + fondoHoja;
  const media = ancho / 2;
  const lista: Caja[] = [];
  for (const s of [-1, 1]) {
    const [xa, xb] = s < 0 ? [-media, 0] : [0, media];
    lista.push(
      caja(xa, 0, z0, xa + ph, alto, z1),
      caja(xb - ph, 0, z0, xb, alto, z1),
      caja(xa + ph, alto - ph, z0, xb - ph, alto, z1),
      caja(xa + ph, 0, z0, xb - ph, rodapieHoja, z1),
    );
  }
  return lista;
}

/** Tiradores verticales por dentro, sobre los montantes de encuentro, con sus soportes; y la placa provisional del rótulo. */
function laton(): Caja[] {
  const { tirador: t, retranqueoHoja } = puerta;
  const zHoja = zFrente - retranqueoHoja;
  const zBarra = zHoja - t.separacion;
  const lista: Caja[] = [];
  for (const s of [-1, 1]) {
    const x = s * t.distanciaEncuentro;
    lista.push({ posicion: [x, t.y, zBarra], tamano: [t.seccion, t.largo, t.seccion] });
    for (const dy of [-1, 1]) {
      const y = t.y + dy * (t.largo / 2 - 2 * t.seccion);
      lista.push(caja(x - t.seccion / 3, y - t.seccion / 3, zBarra, x + t.seccion / 3, y + t.seccion / 3, zHoja));
    }
  }
  // Fase 1: bloque de latón del tamaño aproximado del texto, pegado al dintel por dentro.
  lista.push(caja(-ROTULO.anchoProvisional / 2, ROTULO.y - ROTULO.altoLetra / 2, ROTULO.z, ROTULO.anchoProvisional / 2, ROTULO.y + ROTULO.altoLetra / 2, zFrente));
  return lista;
}

export function Escaparate() {
  const { negro, dorado } = useMemo(() => ({ negro: [...carpinteria(), ...hojas()], dorado: laton() }), []);
  return (
    <group>
      <Cajas cajas={negro} material={MATERIALES.negroMate} />
      <Cajas cajas={dorado} material={MATERIALES.laton} />
    </group>
  );
}
