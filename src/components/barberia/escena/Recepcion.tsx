// Mostrador de recepción, poste de barbero, banco de espera y planta (docs/03, «Escaparate y entrada»).
// `animar`: giro del poste (quieto en ?captura=1).
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { IcosahedronGeometry, Euler, Quaternion, type Mesh } from 'three';
import { BANCO, MOSTRADOR, PLANTA, POSTE } from '../../../datos/barberia';
import { crearAzar, entre } from '../../../lib/azar';
import { CILINDRO_UNIDAD, Cajas, type Caja } from './Cajas';
import { MATERIALES } from './materiales';

/** Mata de la copa: icosaedro de diámetro 1, facetado. */
const MATA_UNIDAD = new IcosahedronGeometry(0.5, 1);

/** Caja entre dos esquinas opuestas. */
const caja = (x0: number, y0: number, z0: number, x1: number, y1: number, z1: number): Caja => ({
  posicion: [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2],
  tamano: [Math.abs(x1 - x0), Math.abs(y1 - y0), Math.abs(z1 - z0)],
});

/** Cilindro vertical (para CILINDRO_UNIDAD) entre dos alturas. */
const cilindro = (x: number, z: number, diametro: number, y0: number, y1: number): Caja => ({
  posicion: [x, (y0 + y1) / 2, z],
  tamano: [diametro, y1 - y0, diametro],
});

/** Mostrador: zócalo retranqueado, cuerpo negro con frente acanalado hacia el pasillo, remate de latón y encimera de piedra con vuelo. */
function mostrador() {
  const { centro, tamano, encimera, acanalado, remate, zocalo } = MOSTRADOR;
  const [cx, , cz] = centro;
  const [fondo, alto, largo] = tamano;
  // El frente mira al pasillo (hacia x = 0); la trasera, a la pared.
  const s = -Math.sign(cx);
  const xFrente = cx + (s * fondo) / 2;
  const xTrasera = cx - (s * fondo) / 2;
  const [za, zb] = [cz - largo / 2, cz + largo / 2];
  const yEncimera = alto - encimera.grueso;
  const yRemate = yEncimera - remate.alto;

  const negro: Caja[] = [
    caja(xFrente - s * zocalo.retranqueo, 0, za + zocalo.retranqueo, xTrasera + s * zocalo.retranqueo, zocalo.alto, zb - zocalo.retranqueo),
    caja(xFrente, zocalo.alto, za, xTrasera, yEncimera, zb),
  ];
  const n = Math.floor(largo / acanalado.paso);
  const z0 = za + (largo - n * acanalado.paso) / 2 + acanalado.paso / 2;
  for (let i = 0; i < n; i++) {
    const z = z0 + i * acanalado.paso;
    negro.push(caja(xFrente, zocalo.alto, z - acanalado.ancho / 2, xFrente + s * acanalado.saliente, yRemate, z + acanalado.ancho / 2));
  }
  const laton = [caja(xFrente + s * remate.saliente, yRemate, za - remate.saliente, xTrasera, yEncimera, zb + remate.saliente)];
  const piedra = [caja(xFrente + s * encimera.vuelo, yEncimera, za - encimera.vuelo, xTrasera - s * encimera.vuelo, alto, zb + encimera.vuelo)];
  return { negro, laton, piedra };
}

/** Banco: cojines de cuero sobre un bastidor negro con cuatro patas. */
function banco() {
  const { centro, tamano, cojines, altoCojin, holguraCojines, bastidor, pata, retranqueoPatas: r } = BANCO;
  const [cx, , cz] = centro;
  const [ancho, alto, largo] = tamano;
  const yCojin = alto - altoCojin;
  const yBastidor = yCojin - bastidor;
  const largoCojin = (largo - (cojines - 1) * holguraCojines) / cojines;
  const cuero = Array.from({ length: cojines }, (_, i) => {
    const za = cz - largo / 2 + i * (largoCojin + holguraCojines);
    return caja(cx - ancho / 2, yCojin, za, cx + ancho / 2, alto, za + largoCojin);
  });
  const negro: Caja[] = [caja(cx - ancho / 2, yBastidor, cz - largo / 2, cx + ancho / 2, yCojin, cz + largo / 2)];
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const x = cx + sx * (ancho / 2 - r - pata / 2);
      const z = cz + sz * (largo / 2 - r - pata / 2);
      negro.push(caja(x - pata / 2, 0, z - pata / 2, x + pata / 2, yBastidor, z + pata / 2));
    }
  }
  return { cuero, negro };
}

/** Pie del poste: base, columna y remates de latón (el cilindro luminoso va aparte para poder girar). */
function poste(): Caja[] {
  const { posicion, altoPie, diametroPie, diametroBase, altoBase, cilindro: c, remate } = POSTE;
  const [x, , z] = posicion;
  return [
    cilindro(x, z, diametroBase, 0, altoBase),
    cilindro(x, z, diametroPie, altoBase, altoPie - remate.alto),
    cilindro(x, z, remate.diametro, altoPie - remate.alto, altoPie),
    cilindro(x, z, remate.diametro, altoPie + c.alto, altoPie + c.alto + remate.alto),
  ];
}

/** Planta: maceta negra y una copa provisional de matas facetadas, con semilla, que llega a `alto`. */
function planta() {
  const { posicion, maceta, alto, diametroCopa, matas, yCopa, radioMata, semilla } = PLANTA;
  const [x, , z] = posicion;
  const azar = crearAzar(semilla);
  const hojas: Caja[] = [];
  for (let i = 0; i < matas; i++) {
    const r = entre(azar, radioMata[0], radioMata[1]);
    // La primera mata, centrada y arriba, marca la altura total; las demás se abren hacia arriba.
    const y = i === 0 ? alto - r : entre(azar, yCopa + r, alto - 1.5 * r);
    const t = (y - yCopa) / (alto - yCopa);
    const d = i === 0 ? 0 : entre(azar, 0.4, 1) * t * Math.max(0, diametroCopa / 2 - r);
    const a = (2 * Math.PI * i) / (matas - 1) + entre(azar, -0.4, 0.4);
    hojas.push({
      posicion: [x + d * Math.cos(a), y, z + d * Math.sin(a)],
      tamano: [2 * r, 2 * r * entre(azar, 0.85, 1.1), 2 * r],
      rotacion: new Quaternion().setFromEuler(new Euler(entre(azar, 0, Math.PI), entre(azar, 0, Math.PI), 0)),
    });
  }
  return { maceta: [cilindro(x, z, maceta.diametro, 0, maceta.alto)], hojas };
}

/** Cilindro luminoso del poste: gira despacio sobre su eje si `animar`; ángulo inicial con semilla. */
function CilindroPoste({ animar }: { animar: boolean }) {
  const ref = useRef<Mesh>(null);
  const { posicion, altoPie, cilindro: c, velocidadGiro, semilla } = POSTE;
  const angulo = useMemo(() => entre(crearAzar(semilla), 0, 2 * Math.PI), [semilla]);
  useFrame((_, dt) => {
    if (animar && ref.current) ref.current.rotation.y += velocidadGiro * dt;
  });
  return (
    <mesh
      ref={ref}
      geometry={CILINDRO_UNIDAD}
      material={MATERIALES.poste}
      position={[posicion[0], altoPie + c.alto / 2, posicion[2]]}
      rotation={[0, angulo, 0]}
      scale={[c.diametro, c.alto, c.diametro]}
    />
  );
}

export function Recepcion({ animar }: { animar: boolean }) {
  const piezas = useMemo(() => {
    const m = mostrador();
    const b = banco();
    const p = planta();
    return {
      negro: [...m.negro, ...b.negro],
      latonCajas: m.laton,
      piedra: m.piedra,
      cuero: b.cuero,
      latonCilindros: poste(),
      maceta: p.maceta,
      hojas: p.hojas,
    };
  }, []);
  return (
    <group>
      <Cajas cajas={piezas.negro} material={MATERIALES.negroMate} />
      <Cajas cajas={piezas.latonCajas} material={MATERIALES.laton} />
      <Cajas cajas={piezas.piedra} material={MATERIALES.piedra} />
      <Cajas cajas={piezas.cuero} material={MATERIALES.cuero} />
      <Cajas cajas={piezas.latonCilindros} material={MATERIALES.laton} geometria={CILINDRO_UNIDAD} />
      <Cajas cajas={piezas.maceta} material={MATERIALES.negroMate} geometria={CILINDRO_UNIDAD} />
      <Cajas cajas={piezas.hojas} material={MATERIALES.planta} geometria={MATA_UNIDAD} />
      <CilindroPoste animar={animar} />
    </group>
  );
}
