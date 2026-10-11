// Obstáculos de la barbería para la prueba de colisiones de la cámara
// (docs/04: la cámara nunca atraviesa sillones, consolas, espejos, mostrador,
// banco, poste, planta, lavacabezas, estantería, tarima ni sillón protagonista).
// Cada obstáculo da la distancia aproximada (m) de un punto a su superficie.
import {
  BANCO,
  CONSOLA,
  ENVOLVENTE,
  ESPEJO,
  ESTANTERIA,
  GALERIA,
  LADOS,
  LAVACABEZAS,
  LISTONES,
  MOSTRADOR,
  PLANTA,
  POSTE,
  SILLON,
  SILLON_PROTAGONISTA,
  TARIMA,
  puestosZ,
  type Vec3,
} from '../datos/barberia';

type Punto = { x: number; y: number; z: number };

export interface Obstaculo {
  nombre: string;
  distancia: (p: Punto) => number;
}

const fueraDeRango = (y: number, y0: number, y1: number) => Math.max(y0 - y, 0, y - y1);

const caja = (nombre: string, min: Vec3, max: Vec3): Obstaculo => ({
  nombre,
  distancia: ({ x, y, z }) => {
    const dx = Math.max(min[0] - x, 0, x - max[0]);
    const dy = Math.max(min[1] - y, 0, y - max[1]);
    const dz = Math.max(min[2] - z, 0, z - max[2]);
    return Math.hypot(dx, dy, dz);
  },
});

/** Caja apoyada en el suelo a partir de su centro en planta y su tamaño (x, alto, z). */
const cajaEnSuelo = (nombre: string, centro: Vec3, [tx, ty, tz]: Vec3): Obstaculo =>
  caja(nombre, [centro[0] - tx / 2, centro[1], centro[2] - tz / 2], [centro[0] + tx / 2, centro[1] + ty, centro[2] + tz / 2]);

const cilindro = (nombre: string, cx: number, cz: number, radio: number, y0: number, y1: number): Obstaculo => ({
  nombre,
  distancia: ({ x, y, z }) => Math.hypot(Math.max(Math.hypot(x - cx, z - cz) - radio, 0), fueraDeRango(y, y0, y1)),
});

function obstaculosEntrada(): Obstaculo[] {
  const [px, , pz] = POSTE.posicion;
  const altoPoste = POSTE.altoPie + POSTE.cilindro.alto + POSTE.remate.alto;
  const [plx, , plz] = PLANTA.posicion;
  return [
    cilindro('poste de barbero', px, pz, POSTE.diametroBase / 2, 0, altoPoste),
    cajaEnSuelo('mostrador', MOSTRADOR.centro, MOSTRADOR.tamano),
    cajaEnSuelo('banco de espera', BANCO.centro, BANCO.tamano),
    cilindro('planta', plx, plz, PLANTA.diametroCopa / 2, 0, PLANTA.alto),
  ];
}

function obstaculosPuestos(): Obstaculo[] {
  const lista: Obstaculo[] = [];
  for (const lado of LADOS) {
    const pared = lado * ENVOLVENTE.xMax;
    const caraListones = pared - lado * LISTONES.grueso;
    lista.push(
      caja(
        'revestimiento de listones',
        [Math.min(pared, caraListones), 0, LISTONES.z1],
        [Math.max(pared, caraListones), ENVOLVENTE.alto, LISTONES.z0],
      ),
    );
    for (const z of puestosZ()) {
      lista.push(cajaEnSuelo('consola', [lado * CONSOLA.x, 0, z], [CONSOLA.fondo, CONSOLA.alto, CONSOLA.largo]));
      const xEspejo = lado * ESPEJO.x;
      lista.push(
        caja(
          'espejo',
          [Math.min(xEspejo, pared), ESPEJO.y0 - ESPEJO.marco, z - ESPEJO.ancho / 2 - ESPEJO.marco],
          [Math.max(xEspejo, pared), ESPEJO.y0 + ESPEJO.alto + ESPEJO.marco, z + ESPEJO.ancho / 2 + ESPEJO.marco],
        ),
      );
      lista.push(cajaEnSuelo('sillón de barbero', [lado * SILLON.x, 0, z], [SILLON.fondo, SILLON.alto, SILLON.ancho]));
    }
  }
  return lista;
}

function obstaculosFondo(): Obstaculo[] {
  const lista: Obstaculo[] = [];
  const { marco } = GALERIA;
  for (const z of GALERIA.columnasZ)
    for (const y of GALERIA.filasY)
      lista.push(caja('marco de la galería', [GALERIA.x, y - marco.alto / 2, z - marco.ancho / 2], [GALERIA.x + marco.grueso, y + marco.alto / 2, z + marco.ancho / 2]));
  for (const z of LAVACABEZAS.z)
    lista.push(cajaEnSuelo('lavacabezas', [LAVACABEZAS.x, 0, z], [LAVACABEZAS.fondo, LAVACABEZAS.altoPila, LAVACABEZAS.ancho]));
  lista.push(cajaEnSuelo('estantería', [ENVOLVENTE.xMax - ESTANTERIA.fondo / 2, 0, ESTANTERIA.z], [ESTANTERIA.fondo, ESTANTERIA.alto, ESTANTERIA.ancho]));
  const [tx, , tz] = TARIMA.centro;
  lista.push(cilindro('tarima', tx, tz, TARIMA.diametro / 2, 0, TARIMA.alto));
  const s = SILLON_PROTAGONISTA;
  lista.push(cajaEnSuelo('sillón protagonista', s.centro, [s.ancho, s.alto, s.fondo]));
  return lista;
}

/** Interior del local: muros, escaparate y dintel, ventanal del patio, suelo y techo (el pozo del lucernario no cuenta). */
const envolvente: Obstaculo = {
  nombre: 'envolvente',
  distancia: ({ x, y, z }) =>
    Math.max(0, Math.min(x - ENVOLVENTE.xMin, ENVOLVENTE.xMax - x, z - ENVOLVENTE.zFondo, ENVOLVENTE.zFrente - z, y, ENVOLVENTE.alto - y)),
};

export const crearObstaculos = (): Obstaculo[] => [envolvente, ...obstaculosEntrada(), ...obstaculosPuestos(), ...obstaculosFondo()];

export interface Colision {
  progreso: number;
  punto: Punto;
  obstaculo: string;
  distancia: number;
}

/** Recorre el progreso en `muestras` pasos y devuelve los puntos más cerca que `margen` de algún obstáculo. */
export function comprobarColisiones(
  posicionEn: (progreso: number) => Punto,
  margen: number,
  muestras = 2000,
  obstaculos = crearObstaculos(),
): Colision[] {
  const colisiones: Colision[] = [];
  for (let i = 0; i <= muestras; i++) {
    const progreso = i / muestras;
    const punto = posicionEn(progreso);
    for (const o of obstaculos) {
      const distancia = o.distancia(punto);
      if (distancia < margen) colisiones.push({ progreso, punto: { ...punto }, obstaculo: o.nombre, distancia });
    }
  }
  return colisiones;
}
