// Sillones de barbero modernos de los 10 puestos, mirando al espejo (docs/03, «Puestos de trabajo»).
// Piezas en coordenadas locales (`u` hacia el espejo) y agrupadas por material y geometría:
// cuero (asiento, respaldo, reposacabezas, reposabrazos), cromo en cajas (chasis, soportes,
// reposapiés) y cromo en cilindros (base y columna). Tres llamadas de dibujo para los 10 sillones.
import { useMemo } from 'react';
import { Quaternion, Vector3 } from 'three';
import { LADOS, SILLON, puestosZ, type Lado, type Vec3 } from '../../../datos/barberia';
import { CILINDRO_UNIDAD, Cajas, barra, type Caja } from './Cajas';
import { MATERIALES } from './materiales';

const EJE_Z = new Vector3(0, 0, 1);

/** Pasa de coordenadas locales del sillón (u hacia el espejo, y, z) al mundo. */
const mundo = (lado: Lado, zEje: number, u: number, y: number, z: number): Vec3 => [lado * (SILLON.x + u), y, zEje + z];

/** Caja alineada con los ejes entre u0 y u1, y0 e y1, de ancho dado a lo largo de Z. */
function cajaLocal(lado: Lado, zEje: number, u0: number, u1: number, y0: number, y1: number, zc: number, ancho: number): Caja {
  return { posicion: mundo(lado, zEje, (u0 + u1) / 2, (y0 + y1) / 2, zc), tamano: [u1 - u0, y1 - y0, ancho] };
}

function sillon(lado: Lado, zEje: number) {
  const { alturaAsiento, diametroBase, ancho: anchoTotal } = SILLON;
  const { base, columna, chasis, asiento, respaldo, reposacabezas: rc, reposabrazos: rb, soporteBrazo, reposapies: rp } = SILLON.piezas;
  const cuero: Caja[] = [];
  const cromo: Caja[] = [];
  const cilindros: Caja[] = [];

  // Base circular y columna.
  cilindros.push({ posicion: mundo(lado, zEje, columna.u, base.alto / 2, 0), tamano: [diametroBase, base.alto, diametroBase] });
  cilindros.push({
    posicion: mundo(lado, zEje, columna.u, (base.alto + chasis.y0) / 2, 0),
    tamano: [columna.diametro, chasis.y0 - base.alto, columna.diametro],
  });

  // Chasis y cojín del asiento.
  cromo.push(cajaLocal(lado, zEje, chasis.u0, chasis.u1, chasis.y0, chasis.y1, 0, chasis.ancho));
  cuero.push(cajaLocal(lado, zEje, asiento.u0, asiento.u1, chasis.y1, alturaAsiento, 0, asiento.ancho));

  // Respaldo y reposacabezas, inclinados hacia atrás (hacia el pasillo) alrededor de Z.
  const giro = new Quaternion().setFromAxisAngle(EJE_Z, lado * respaldo.inclinacion);
  const sen = Math.sin(respaldo.inclinacion);
  const cos = Math.cos(respaldo.inclinacion);
  /** Punto del eje del respaldo a la distancia `s` de su canto inferior. */
  const enEje = (s: number, z = 0) => mundo(lado, zEje, respaldo.uPie - s * sen, respaldo.yPie + s * cos, z);
  cuero.push({ posicion: enEje(respaldo.alto / 2), tamano: [respaldo.grueso, respaldo.alto, respaldo.ancho], rotacion: giro });
  const sCabeza = respaldo.alto + rc.holgura;
  cuero.push({ posicion: enEje(sCabeza + rc.alto / 2), tamano: [rc.grueso, rc.alto, rc.ancho], rotacion: giro });
  for (const s of [-1, 1]) {
    const z = (s * rc.barras) / 2;
    cromo.push(barra(enEje(respaldo.alto - rc.holgura, z), enEje(sCabeza + rc.holgura, z), rc.seccionBarra));
  }

  // Reposabrazos de cuero sobre soportes cromados en L.
  const zBrazo = anchoTotal / 2 - rb.ancho / 2;
  const yBajoBrazo = rb.y - rb.alto / 2;
  const yTravesano = chasis.y1 - soporteBrazo.seccion / 2;
  for (const s of [-1, 1]) {
    cuero.push(cajaLocal(lado, zEje, rb.u0, rb.u1, yBajoBrazo, rb.y + rb.alto / 2, s * zBrazo, rb.ancho));
    cromo.push(barra(mundo(lado, zEje, soporteBrazo.u, yTravesano, s * zBrazo), mundo(lado, zEje, soporteBrazo.u, yBajoBrazo, s * zBrazo), soporteBrazo.seccion));
  }
  cromo.push(barra(mundo(lado, zEje, soporteBrazo.u, yTravesano, -zBrazo), mundo(lado, zEje, soporteBrazo.u, yTravesano, zBrazo), soporteBrazo.seccion));

  // Reposapiés: brazo desde el chasis y pletina delante, hacia el espejo.
  cromo.push(barra(mundo(lado, zEje, rp.uBrazo, chasis.y0, 0), mundo(lado, zEje, rp.u0 + rp.seccion / 2, rp.y, 0), rp.seccion));
  cromo.push(cajaLocal(lado, zEje, rp.u0, rp.u1, rp.y - rp.grueso / 2, rp.y + rp.grueso / 2, 0, rp.ancho));

  return { cuero, cromo, cilindros };
}

export function Sillones() {
  const piezas = useMemo(() => {
    const cuero: Caja[] = [];
    const cromo: Caja[] = [];
    const cilindros: Caja[] = [];
    for (const lado of LADOS) {
      for (const z of puestosZ()) {
        const s = sillon(lado, z);
        cuero.push(...s.cuero);
        cromo.push(...s.cromo);
        cilindros.push(...s.cilindros);
      }
    }
    return { cuero, cromo, cilindros };
  }, []);
  return (
    <group>
      <Cajas cajas={piezas.cuero} material={MATERIALES.cuero} />
      <Cajas cajas={piezas.cromo} material={MATERIALES.cromo} />
      <Cajas cajas={piezas.cilindros} material={MATERIALES.cromo} geometria={CILINDRO_UNIDAD} />
    </group>
  );
}
