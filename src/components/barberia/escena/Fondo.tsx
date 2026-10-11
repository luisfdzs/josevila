// Carpintería del ventanal del patio, lavacabezas y estantería de toallas (docs/03, «Fondo»).
// Maqueta en bloques (fase 1): cuatro llamadas de dibujo instanciadas por material
// (negro mate, cuero, latón y toallas). El vidrio luminoso es de Envolvente.tsx.
import { useMemo } from 'react';
import { Quaternion, Vector3 } from 'three';
import { ENVOLVENTE, ESTANTERIA, LAVACABEZAS, VENTANAL } from '../../../datos/barberia';
import { crearAzar, entre } from '../../../lib/azar';
import { barra, Cajas, CILINDRO_UNIDAD, type Caja } from './Cajas';
import { MATERIALES } from './materiales';

const PARED = ENVOLVENTE.xMax;
const EJE_Z = new Vector3(0, 0, 1);
/** Cilindro con el eje a lo largo de X. */
const TUMBADO_X = new Quaternion().setFromAxisAngle(EJE_Z, Math.PI / 2);

/** Caja entre dos esquinas opuestas. */
const entre2 = (x0: number, y0: number, z0: number, x1: number, y1: number, z1: number): Caja => ({
  posicion: [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2],
  tamano: [Math.abs(x1 - x0), Math.abs(y1 - y0), Math.abs(z1 - z0)],
});

/** Marco perimetral, montantes de los 8 paños y travesaño, de z = −26 hacia dentro. */
function carpinteria(): Caja[] {
  const { x0, x1, y0, y1, panos, travesanoY, perfil: p, z } = VENTANAL;
  const z0 = z;
  const z1 = z + p;
  const lista: Caja[] = [
    entre2(x0, y0, z0, x1, y0 + p, z1),
    entre2(x0, y1 - p, z0, x1, y1, z1),
    entre2(x0, y0 + p, z0, x0 + p, y1 - p, z1),
    entre2(x1 - p, y0 + p, z0, x1, y1 - p, z1),
    entre2(x0 + p, travesanoY - p / 2, z0, x1 - p, travesanoY + p / 2, z1),
  ];
  const pano = (x1 - x0) / panos;
  for (let i = 1; i < panos; i++) {
    const x = x0 + i * pano;
    lista.push(entre2(x - p / 2, y0 + p, z0, x + p / 2, y1 - p, z1));
  }
  return lista;
}

/** Silueta plana de una planta del patio (provisional): tallos en abanico con una hoja cada uno. */
function silueta(): Caja[] {
  const s = VENTANAL.silueta;
  const azar = crearAzar(s.semilla);
  const lista: Caja[] = [];
  // Tramos solapados de anchura variable: una hoja ovalada y no una tabla.
  const tramos = [0.35, 0.75, 1, 0.9, 0.55, 0.2].map((ancho, i, lista) => ({
    desde: i / lista.length,
    hasta: (i + 1.3) / lista.length,
    ancho,
  }));
  for (let i = 0; i < s.tallos; i++) {
    const a = entre(azar, -s.abertura, s.abertura);
    const base = new Vector3(s.x + entre(azar, -0.12, 0.12), VENTANAL.y0, s.z);
    const largoTallo = (s.alto - s.hoja.largo) * entre(azar, 0.45, 1);
    const punta = base.clone().add(new Vector3(Math.sin(a), Math.cos(a), 0).multiplyScalar(largoTallo));
    lista.push(barra(base.toArray(), punta.toArray(), s.tallo));
    const ah = a + entre(azar, -0.25, 0.25);
    const dir = new Vector3(Math.sin(ah), Math.cos(ah), 0);
    const giro = new Quaternion().setFromAxisAngle(EJE_Z, -ah);
    const largo = s.hoja.largo * entre(azar, 0.7, 1);
    const ancho = s.hoja.ancho * entre(azar, 0.7, 1);
    for (const t of tramos) {
      const centro = punta.clone().addScaledVector(dir, ((t.desde + t.hasta) / 2) * largo);
      lista.push({ posicion: centro.toArray(), tamano: [ancho * t.ancho, (t.hasta - t.desde) * largo, 0.01], rotacion: giro });
    }
  }
  return lista;
}

interface Piezas {
  negro: Caja[];
  cuero: Caja[];
  laton: Caja[];
  toallas: Caja[];
}

/** Lavacabezas: pila sobre un pie contra la pared y asiento hacia el pasillo, reclinado hacia la pila. */
function lavacabezas(piezas: Piezas) {
  const L = LAVACABEZAS;
  const { pila, asiento, respaldo, brazos, grifo } = L;
  const xPila = PARED - pila.fondo;
  const xAsiento1 = xPila - asiento.retranqueoPila;
  const xAsiento0 = xAsiento1 - asiento.fondo;
  const yCojin = L.alturaAsiento - asiento.cojin;
  const anchoCojin = asiento.ancho - 2 * brazos.ancho;
  // El respaldo gira sobre su arista delantera inferior, con la parte alta hacia la pila (+X).
  const giro = new Quaternion().setFromAxisAngle(EJE_Z, -respaldo.inclinacion);
  const pivote = new Vector3(xAsiento1 - respaldo.grueso, L.alturaAsiento - 0.02, 0);
  const centroRespaldo = pivote.clone().add(new Vector3(respaldo.grueso / 2, respaldo.largo / 2, 0).applyQuaternion(giro));

  for (const z of L.z) {
    const m = pila.ancho / 2;
    const e = pila.pared;
    piezas.negro.push(
      // Pie y cubeta abierta (fondo y cuatro paredes).
      entre2(PARED - pila.pie.fondo, 0, z - pila.pie.ancho / 2, PARED, pila.y0, z + pila.pie.ancho / 2),
      entre2(xPila, pila.y0, z - m, PARED, pila.y0 + e, z + m),
      entre2(xPila, pila.y0, z - m, xPila + e, L.altoPila, z + m),
      entre2(PARED - e, pila.y0, z - m, PARED, L.altoPila, z + m),
      entre2(xPila, pila.y0, z - m, PARED, L.altoPila, z - m + e),
      entre2(xPila, pila.y0, z + m - e, PARED, L.altoPila, z + m),
      // Base del asiento, hasta el pie de la pila.
      entre2(xAsiento0, 0, z - anchoCojin / 2, PARED - pila.pie.fondo, yCojin, z + anchoCojin / 2),
    );
    piezas.cuero.push(
      entre2(xAsiento0, yCojin, z - anchoCojin / 2, xAsiento1, L.alturaAsiento, z + anchoCojin / 2),
      { posicion: [centroRespaldo.x, centroRespaldo.y, z], tamano: [respaldo.grueso, respaldo.largo, anchoCojin], rotacion: giro },
      ...[-1, 1].map((s) => {
        const zb = z + s * (asiento.ancho / 2 - brazos.ancho / 2);
        return entre2(xAsiento0, 0, zb - brazos.ancho / 2, xAsiento0 + brazos.largo, L.alturaAsiento + brazos.alto, zb + brazos.ancho / 2);
      }),
    );
    // Grifería sobre una repisa al fondo de la cubeta: columna, caño hacia el asiento y dos mandos.
    const xg = PARED - grifo.retranqueo;
    piezas.negro.push(entre2(xg - 2 * grifo.diametro, L.altoPila - e, z - m, PARED, L.altoPila, z + m));
    const yCano = L.altoPila + grifo.alto - grifo.diametro / 2;
    piezas.laton.push(
      { posicion: [xg, L.altoPila + grifo.alto / 2, z], tamano: [grifo.diametro, grifo.alto, grifo.diametro] },
      { posicion: [xg - grifo.cano / 2, yCano, z], tamano: [grifo.diametro, grifo.cano, grifo.diametro], rotacion: TUMBADO_X },
      ...[-1, 1].map(
        (s): Caja => ({
          posicion: [xg, L.altoPila + grifo.mando / 2, z + s * (m - 2 * grifo.mando)],
          tamano: [grifo.mando, grifo.mando, grifo.mando],
        }),
      ),
    );
  }
}

/** Estantería contra la pared derecha con toallas enrolladas (eje hacia el pasillo) en cada balda. */
function estanteria(piezas: Piezas) {
  const E = ESTANTERIA;
  const { tablero: t, trasera, toalla } = E;
  const azar = crearAzar(E.semilla);
  const x0 = PARED - E.fondo;
  const xt = PARED - trasera;
  const [z0, z1] = [E.z - E.ancho / 2, E.z + E.ancho / 2];
  piezas.negro.push(
    entre2(xt, 0, z0, PARED, E.alto, z1),
    entre2(x0, 0, z0, xt, E.alto, z0 + t),
    entre2(x0, 0, z1 - t, xt, E.alto, z1),
    entre2(x0, E.alto - t, z0 + t, xt, E.alto, z1 - t),
  );
  const paso = E.alto / E.baldas;
  const interior = E.ancho - 2 * t;
  const hueco = interior / toalla.porFila;
  const d = toalla.diametro;
  const xToalla = xt - toalla.largo / 2 - (E.fondo - trasera - toalla.largo) / 2;
  for (let i = 0; i < E.baldas; i++) {
    const y = i * paso;
    piezas.negro.push(entre2(x0, y, z0 + t, xt, y + t, z1 - t));
    const toallaEn = (z: number, yc: number) => {
      if (azar() < toalla.probabilidadHueco) return;
      piezas.toallas.push({ posicion: [xToalla + entre(azar, -0.015, 0.015), yc, z], tamano: [d, toalla.largo, d], rotacion: TUMBADO_X });
    };
    for (let k = 0; k < toalla.porFila; k++) toallaEn(z0 + t + hueco * (k + 0.5), y + t + d / 2);
    // Segunda capa encajada entre las de abajo en baldas alternas.
    if (i % 2 === 0) for (let k = 0; k < toalla.porFila - 1; k++) toallaEn(z0 + t + hueco * (k + 1), y + t + d / 2 + d * 0.85);
  }
}

export function Fondo() {
  const piezas = useMemo(() => {
    const p: Piezas = { negro: [...carpinteria(), ...silueta()], cuero: [], laton: [], toallas: [] };
    lavacabezas(p);
    estanteria(p);
    return p;
  }, []);
  return (
    <group>
      <Cajas cajas={piezas.negro} material={MATERIALES.negroMate} />
      <Cajas cajas={piezas.cuero} material={MATERIALES.cuero} />
      <Cajas cajas={piezas.laton} material={MATERIALES.laton} geometria={CILINDRO_UNIDAD} />
      <Cajas cajas={piezas.toallas} material={MATERIALES.blancoRoto} geometria={CILINDRO_UNIDAD} />
    </group>
  );
}
