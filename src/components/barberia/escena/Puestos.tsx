// Revestimiento de listones, consolas, espejos con marco y líneas de luz de los 10 puestos (docs/03, «Puestos de trabajo»).
// Una llamada de dibujo por material: listones, negro mate, piedra, latón (tiradores y marcos), vidrio y líneas de luz.
import { useMemo } from 'react';
import { CONSOLA, ENVOLVENTE, ESPEJO, LADOS, LINEAS_ESPEJO, LISTONES, puestosZ, type Lado } from '../../../datos/barberia';
import { Cajas, type Caja } from './Cajas';
import { MATERIALES } from './materiales';

/** Cara de los listones hacia el pasillo, en |x|. */
const CARA_LISTONES = ENVOLVENTE.xMax - LISTONES.grueso;

/** Caja de un lado entre dos distancias |x| (a la pared), alturas y extensión en Z. */
function enLado(lado: Lado, xa: number, xb: number, y0: number, y1: number, zc: number, largoZ: number): Caja {
  return {
    posicion: [(lado * (xa + xb)) / 2, (y0 + y1) / 2, zc],
    tamano: [Math.abs(xb - xa), y1 - y0, largoZ],
  };
}

/** Listones verticales de pared a pared de la zona de puestos, centrados en el tramo. */
function listones(): Caja[] {
  const { z0, z1, ancho, separacion } = LISTONES;
  const tramo = z0 - z1;
  const paso = ancho + separacion;
  const n = Math.floor((tramo + separacion) / paso);
  const margen = (tramo - (n * ancho + (n - 1) * separacion)) / 2;
  const lista: Caja[] = [];
  for (const lado of LADOS) {
    for (let i = 0; i < n; i++) {
      const z = z0 - margen - ancho / 2 - i * paso;
      lista.push(enLado(lado, CARA_LISTONES, ENVOLVENTE.xMax, 0, ENVOLVENTE.alto, z, ancho));
    }
  }
  return lista;
}

/** Consolas: cuerpo y zócalo negros, encimera de piedra y tirador de latón. */
function consolas() {
  const { largo, fondo, alto, x, encimera, retranqueo, zocalo, tirador } = CONSOLA;
  const frente = x - fondo / 2;
  const negro: Caja[] = [];
  const piedra: Caja[] = [];
  const laton: Caja[] = [];
  for (const lado of LADOS) {
    for (const z of puestosZ()) {
      piedra.push(enLado(lado, frente, CARA_LISTONES, alto - encimera, alto, z, largo));
      negro.push(enLado(lado, frente + retranqueo, CARA_LISTONES, zocalo.alto, alto - encimera, z, largo - 2 * retranqueo));
      negro.push(enLado(lado, frente + zocalo.retranqueo, CARA_LISTONES, 0, zocalo.alto, z, largo - 2 * zocalo.retranqueo));
      const caraCuerpo = frente + retranqueo;
      laton.push(
        enLado(lado, caraCuerpo - tirador.saliente, caraCuerpo, tirador.y - tirador.alto / 2, tirador.y + tirador.alto / 2, z, tirador.largo),
      );
    }
  }
  return { negro, piedra, laton };
}

/** Espejos: vidrio a ras de `ESPEJO.x` y marco de latón alrededor, algo más saliente que el vidrio. */
function espejos() {
  const { ancho, alto, y0, x, marco, grueso } = ESPEJO;
  const y1 = y0 + alto;
  const frenteMarco = CARA_LISTONES - grueso;
  const vidrio: Caja[] = [];
  const laton: Caja[] = [];
  const lineas: Caja[] = [];
  for (const lado of LADOS) {
    for (const z of puestosZ()) {
      vidrio.push(enLado(lado, x, CARA_LISTONES, y0, y1, z, ancho));
      // Marco: travesaños arriba y abajo de lado a lado, montantes entre ellos.
      laton.push(enLado(lado, frenteMarco, CARA_LISTONES, y0 - marco, y0, z, ancho + 2 * marco));
      laton.push(enLado(lado, frenteMarco, CARA_LISTONES, y1, y1 + marco, z, ancho + 2 * marco));
      for (const s of [-1, 1]) {
        laton.push(enLado(lado, frenteMarco, CARA_LISTONES, y0, y1, z + s * (ancho / 2 + marco / 2), marco));
        // Líneas de luz verticales a ambos lados, centradas en la altura del espejo.
        const ly0 = y0 + (alto - LINEAS_ESPEJO.alto) / 2;
        lineas.push(
          enLado(lado, CARA_LISTONES - LINEAS_ESPEJO.grueso, CARA_LISTONES, ly0, ly0 + LINEAS_ESPEJO.alto, z + s * LINEAS_ESPEJO.separacion, LINEAS_ESPEJO.ancho),
        );
      }
    }
  }
  return { vidrio, laton, lineas };
}

export function Puestos() {
  const piezas = useMemo(() => {
    const c = consolas();
    const e = espejos();
    return { listones: listones(), negro: c.negro, piedra: c.piedra, laton: [...c.laton, ...e.laton], vidrio: e.vidrio, lineas: e.lineas };
  }, []);
  return (
    <group>
      <Cajas cajas={piezas.listones} material={MATERIALES.listones} />
      <Cajas cajas={piezas.negro} material={MATERIALES.negroMate} />
      <Cajas cajas={piezas.piedra} material={MATERIALES.piedra} />
      <Cajas cajas={piezas.laton} material={MATERIALES.laton} />
      <Cajas cajas={piezas.vidrio} material={MATERIALES.espejo} />
      <Cajas cajas={piezas.lineas} material={MATERIALES.lineaLuz} />
    </group>
  );
}
