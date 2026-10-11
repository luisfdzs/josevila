// Tarima circular y sillón de barbero clásico bajo el lucernario (docs/03, «Fondo»).
// Maqueta en bloques (fase 1): tarima de piedra con canto de latón y sillón de
// principios del XX (columna hidráulica, asiento y respaldo alto de cuero,
// reposacabezas, brazos con voluta y reposapiés de latón). Cinco llamadas de dibujo.
import { useMemo } from 'react';
import { CylinderGeometry, Quaternion, Vector3 } from 'three';
import { SILLON_PROTAGONISTA, TARIMA, type Vec3 } from '../../../datos/barberia';
import { barra, Cajas, type Caja } from './Cajas';
import { MATERIALES } from './materiales';

/** Cilindro unidad con más segmentos que CILINDRO_UNIDAD: la tarima y la columna se ven de cerca. */
const CILINDRO_FINO = new CylinderGeometry(0.5, 0.5, 1, TARIMA.segmentos);
const EJE_X = new Vector3(1, 0, 0);
const EJE_Z = new Vector3(0, 0, 1);
const TUMBADO_X = new Quaternion().setFromAxisAngle(EJE_Z, Math.PI / 2);

const S = SILLON_PROTAGONISTA;
const [cx, cy, cz] = S.centro;
/** Del sistema local del sillón (y desde la tarima, +Z al frente) al mundo. */
const mundo = (x: number, y: number, z: number): Vec3 => [cx + x, cy + y, cz + z];
const deVector = (v: Vector3): Vec3 => mundo(v.x, v.y, v.z);

/** Tarima flotante: piedra retranqueada bajo una banda de latón que forma el canto. */
function tarima() {
  const [tx, ty, tz] = TARIMA.centro;
  const { diametro: d, alto, canto } = TARIMA;
  const piedra: Caja = { posicion: [tx, ty + (alto + 0.001) / 2, tz], tamano: [d - 2 * canto, alto + 0.001, d - 2 * canto] };
  const banda: Caja = { posicion: [tx, ty + alto - canto / 2, tz], tamano: [d, canto, d] };
  return { piedra, banda };
}

function sillon() {
  const { placa, columna, chasis, asiento, respaldo: r, reposacabezas: rc, brazos: b, reposapies: rp, bomba, varilla } = S;
  const cilindros: Caja[] = [];
  const latones: Caja[] = [];
  const cuero: Caja[] = [];
  const negro: Caja[] = [];

  // Base de columna: placa, columna hidráulica y collar bajo el chasis.
  const yChasis = S.alturaAsiento - asiento.grueso - chasis.alto;
  cilindros.push(
    { posicion: mundo(0, placa / 2, 0), tamano: [S.diametroBase, placa, S.diametroBase] },
    { posicion: mundo(0, (placa + yChasis) / 2, 0), tamano: [columna.diametro, yChasis - placa, columna.diametro] },
    { posicion: mundo(0, yChasis - chasis.alto / 4, 0), tamano: [columna.collar, chasis.alto / 2, columna.collar] },
  );
  negro.push({ posicion: mundo(0, yChasis + chasis.alto / 2, 0), tamano: [chasis.ancho, chasis.alto, chasis.fondo] });

  // Asiento: su borde trasero entra bajo el respaldo.
  const zAsiento = r.pivoteZ - r.grueso / 2 + asiento.fondo / 2;
  cuero.push({ posicion: mundo(0, S.alturaAsiento - asiento.grueso / 2, zAsiento), tamano: [asiento.ancho, asiento.grueso, asiento.fondo] });

  // Respaldo reclinado hacia atrás desde su arista delantera inferior, con carcasa negra y reposacabezas.
  const giro = new Quaternion().setFromAxisAngle(EJE_X, -r.inclinacion);
  const pivote = new Vector3(0, S.alturaAsiento - asiento.grueso / 2, r.pivoteZ);
  const local = (x: number, y: number, z: number) => deVector(new Vector3(x, y, z).applyQuaternion(giro).add(pivote));
  cuero.push({ posicion: local(0, r.alto / 2, -r.grueso / 2), tamano: [r.ancho, r.alto, r.grueso], rotacion: giro });
  negro.push({
    posicion: local(0, r.alto / 2, -r.grueso - r.carcasa / 2),
    tamano: [r.ancho + 2 * r.carcasa, r.alto + r.carcasa, r.carcasa],
    rotacion: giro,
  });
  const yCabeza = r.alto + rc.separacion + rc.alto / 2;
  cuero.push({ posicion: local(0, yCabeza, -rc.grueso / 2), tamano: [rc.ancho, rc.alto, rc.grueso], rotacion: giro });
  for (const s of [-1, 1]) {
    const x = (s * rc.ancho) / 4;
    latones.push(barra(local(x, r.alto - varilla, -r.grueso / 2), local(x, yCabeza, -rc.grueso / 2), varilla));
  }

  // Brazos: almohadilla de cuero sobre un riel de latón, dos montantes y voluta delantera.
  const yBrazo = S.alturaAsiento + b.sobreAsiento;
  // Los montantes arrancan a media altura del chasis, unidos por un travesaño que lo atraviesa.
  const yBase = yChasis + chasis.alto / 2;
  for (const s of [-1, 1]) {
    const x = s * b.x;
    cuero.push({ posicion: mundo(x, yBrazo + b.grueso / 2, 0), tamano: [b.ancho, b.grueso, b.largo] });
    latones.push(
      { posicion: mundo(x, yBrazo - varilla / 2, 0), tamano: [b.ancho * 0.6, varilla, b.largo] },
      barra(mundo(x, yBase, b.largo / 2 - 2 * varilla), mundo(x, yBrazo, b.largo / 2 - 2 * varilla), varilla),
      barra(mundo(x, yBase, -b.largo / 2 + 2 * varilla), mundo(x, yBrazo, -b.largo / 2 + 2 * varilla), varilla),
    );
    cilindros.push({ posicion: mundo(x, yBrazo + b.grueso / 2, b.largo / 2), tamano: [b.voluta, b.ancho + 2 * (S.ancho / 2 - b.x - b.ancho / 2), b.voluta], rotacion: TUMBADO_X });
  }
  for (const z of [-1, 1].map((s) => s * (b.largo / 2 - 2 * varilla))) latones.push(barra(mundo(-b.x, yBase, z), mundo(b.x, yBase, z), varilla));

  // Reposapiés: placa con labio, colgada del frente del chasis por dos varillas.
  const zFrenteChasis = chasis.fondo / 2;
  for (const s of [-1, 1]) {
    const x = (s * rp.ancho) / 2.5;
    latones.push(barra(mundo(x, yChasis + chasis.alto / 2, zFrenteChasis), mundo(x, rp.y, rp.z - rp.largo / 2), varilla));
  }
  latones.push(
    { posicion: mundo(0, rp.y, rp.z), tamano: [rp.ancho, varilla, rp.largo] },
    { posicion: mundo(0, rp.y + rp.labio / 2 - varilla / 2, rp.z + rp.largo / 2), tamano: [rp.ancho, rp.labio, varilla] },
  );

  // Palanca de la bomba hidráulica con su pedal, a un lado de la columna.
  const [px, py, pz] = bomba.pedal;
  latones.push(barra(mundo(columna.diametro / 2, placa + 2 * varilla, 0), mundo(px, py, pz), varilla), {
    posicion: mundo(px, py, pz),
    tamano: bomba.tamano,
  });

  return { cilindros, latones, cuero, negro };
}

export function SillonProtagonista() {
  const { piedra, banda, cilindros, latones, cuero, negro } = useMemo(() => ({ ...tarima(), ...sillon() }), []);
  const cilindrosLaton = useMemo(() => [banda, ...cilindros], [banda, cilindros]);
  const piedras = useMemo(() => [piedra], [piedra]);
  return (
    <group>
      <Cajas cajas={piedras} material={MATERIALES.piedra} geometria={CILINDRO_FINO} />
      <Cajas cajas={cilindrosLaton} material={MATERIALES.laton} geometria={CILINDRO_FINO} />
      <Cajas cajas={latones} material={MATERIALES.laton} />
      <Cajas cajas={cuero} material={MATERIALES.cuero} />
      <Cajas cajas={negro} material={MATERIALES.negroMate} />
    </group>
  );
}
