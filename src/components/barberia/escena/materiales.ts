// Materiales de la maqueta en bloques (fase 1): grises que distinguen los
// volúmenes y emisivos para las fuentes de luz (retícula, líneas de los
// espejos, escaparate, patio y lucernario). Los materiales definitivos de
// docs/02 (piedra pulida, listones, latón, cromo, cuero, espejos) llegan en la
// fase 3; los nombres ya son los de la paleta para sustituirlos sin tocar la escena.
import { Color, DoubleSide, MeshBasicMaterial, MeshStandardMaterial } from 'three';

const gris = (color: string, extra: ConstructorParameters<typeof MeshStandardMaterial>[0] = {}) =>
  new MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, ...extra });

/** Emisivo puro: no recibe luz y el bloom (fase 3) lo hará brillar. */
const emisivo = (color: string, intensidad = 1) =>
  new MeshBasicMaterial({ color: new Color(color).multiplyScalar(intensidad), toneMapped: false });

export const MATERIALES = {
  // Envolvente.
  muro: gris('#3b3c3f'),
  techo: gris('#323336'),
  /** Piezas del suelo (el tono varía por instancia). */
  suelo: gris('#ffffff', { roughness: 0.8 }),
  junta: gris('#121314'),
  /** Paredes del pozo del lucernario: blanco roto mate, para que brille. */
  pozo: gris('#bdbcb8', { side: DoubleSide }),

  // Mobiliario y carpintería.
  negroMate: gris('#2c2d30'),
  listones: gris('#333438'),
  piedra: gris('#25262a', { roughness: 0.5 }),
  laton: gris('#8f7e5e', { roughness: 0.5 }),
  cromo: gris('#77797d', { roughness: 0.4 }),
  cuero: gris('#38383c', { roughness: 0.7 }),
  blancoRoto: gris('#d6d5d1'),
  /** Vidrio de los espejos: oscuro y algo brillante. */
  espejo: gris('#1d2024', { roughness: 0.15 }),
  planta: gris('#4a5141'),

  // Fuentes de luz.
  lineaLuz: emisivo('#eef3f8', 1.6),
  cielo: emisivo('#f2f4f6', 1.1),
  patio: emisivo('#ffe9c9', 1.25),
  lucernario: emisivo('#ffe9c9', 1.6),
  poste: emisivo('#e8e2dc', 0.9),
} as const;
