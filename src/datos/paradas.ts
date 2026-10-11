// Planos del recorrido (docs/04-recorrido-y-paradas.md): cámara, encuadre
// móvil, deriva durante la pausa, puntos de paso de llegada y textos.
// Lo leen la isla 3D (cámara) y los componentes Astro (interfaz).
import type { Vec3 } from './barberia';

export type IdParada = 'P' | '1' | '2' | '3' | '4' | '5' | 'E';

export interface Encuadre {
  posicion: Vec3;
  mira: Vec3;
  /** Focal equivalente en full frame (mm). */
  focal: number;
  /**
   * Desplazamiento vertical del objetivo (descentramiento, como en una cámara
   * técnica), en fracción de la altura del cuadro: con 0,15 el punto de mira
   * sube del 50 % al 35 % de la altura sin inclinar la cámara, así que las
   * verticales siguen paralelas. Se interpola como la focal. Por defecto, 0.
   */
  desplazamientoVertical?: number;
}

export interface PuntoDePaso {
  posicion: Vec3;
  mira: Vec3;
}

export interface Parada {
  id: IdParada;
  nombre: string;
  escritorio: Encuadre;
  /** Encuadre para pantallas verticales: más campo y el protagonista más arriba. */
  movil: Encuadre;
  /** Desplazamiento de cámara y mira a lo largo de la pausa (centrado en el encuadre). */
  deriva: Vec3;
  /** Puntos de paso desde la parada anterior hasta esta. */
  llegada: PuntoDePaso[];
  interfaz: {
    antetitulo?: string;
    titular: string;
    subtitulo?: string;
    texto?: string;
    boton?: { texto: string; href: string };
    /** Texto del botón de ruta («Cómo llegar»); el enlace llegará con el contenido de ubicación (fase 4). */
    botonRuta?: string;
    /** Indicación sin enlace (p. ej. «Desliza para entrar»). */
    indicacion?: string;
    /** Texto del botón que lleva directo al cierre («Saltar recorrido»). */
    saltar?: string;
  };
}

export const RECORRIDO = {
  /** Fracción de cada tramo dedicada a la pausa (docs/04: ~40 %). */
  fraccionPausa: 0.4,
  /** Pantallas de scroll de la pista completa. */
  pantallas: 8,
  /** Distancia mínima de la cámara a cualquier obstáculo (m). */
  margenColision: 0.3,
  /** Peso del giro de la mirada frente al desplazamiento al repartir la velocidad (m por radián). */
  metrosPorRadian: 8,
  /** Límite de giro de la mirada (grados por cada 1 % de progreso), comprobado en pruebas. */
  giroMaximo: 36,
  /** Por debajo de esta relación ancho/alto se usa el encuadre móvil. */
  aspectoMovil: 0.8,
  /**
   * Fracción del último tramo (Ubicación → epílogo) en la que empieza el fundido
   * a blanco; acaba al llegar a la pausa del epílogo, que es el cierre.
   */
  inicioFundidoFinal: 0.5,
  /**
   * Móvil (táctil y vertical): cada gesto lleva a la parada siguiente o anterior,
   * sin posiciones intermedias. El scroll avanza a ritmo constante y la propia
   * trayectoria pone la aceleración y la frenada de cada transición.
   */
  paginadoMovil: {
    segundosPorTransicion: 2.2,
    /**
     * Duración de un salto del menú de píldora. Entre secciones vecinas es el
     * tramo real; si están a más de un paso, se recorre la primera mitad del
     * primer tramo, se funde a negro, se corta a la mitad del último tramo y se
     * funde desde negro hasta el destino: dura lo mismo que un salto vecino.
     */
    segundosPorTramoMenu: 1.5,
    /** Fracción central del salto con fundido y, dentro de ella, la de negro total. */
    corte: { fraccionFundido: 0.4, fraccionNegro: 0.16 },
    /** Desplazamiento mínimo del dedo (px) para contar como gesto. */
    umbralGesto: 30,
  },
} as const;

export const PARADAS: Parada[] = [
  {
    id: 'P',
    nombre: 'La entrada',
    // Simétrico desde el escaparate, cámara baja: el pasillo en fuga y el sillón al fondo.
    escritorio: { posicion: [0, 1.35, -0.9], mira: [0, 1.1, -22.6], focal: 28 },
    movil: { posicion: [0, 1.35, -0.7], mira: [0, 1.2, -22.6], focal: 16, desplazamientoVertical: 0.16 },
    deriva: [0, 0, -0.6],
    llegada: [],
    interfaz: {
      titular: 'José Vila',
      subtitulo: 'Barbería.',
      texto: 'Corte, barba y afeitado clásico, sin prisas.',
      indicacion: 'Desliza para entrar',
      saltar: 'Saltar recorrido',
    },
  },
  {
    id: '1',
    nombre: 'Servicios',
    // Detalle en tres cuartos del segundo puesto de la izquierda (z = −8): el espejo entero y
    // la consola; el espejo siguiente asoma apenas por la derecha. Se reajusta con la bandeja (fase 2).
    escritorio: { posicion: [-0.9, 1.45, -6.4], mira: [-3.9, 1.55, -7.5], focal: 31 },
    movil: { posicion: [-0.7, 1.5, -5.8], mira: [-3.9, 1.4, -7.9], focal: 20, desplazamientoVertical: 0.12 },
    deriva: [-0.1, 0, -0.15],
    llegada: [{ posicion: [-0.3, 1.4, -3.4], mira: [-2.4, 1.2, -9] }],
    interfaz: {
      antetitulo: 'Servicios',
      titular: 'Tijera, navaja y tiempo.',
      boton: { texto: 'Ver servicios y precios', href: '/servicios' },
    },
  },
  {
    id: '2',
    nombre: 'Equipo',
    // Travelling lateral a lo largo de la fila de la derecha (~2 m hacia −Z en la pausa), desde el
    // eje del pasillo y mirando 45° hacia la fila: el ventanal del fondo queda fuera del cuadro.
    escritorio: { posicion: [0.1, 1.35, -9], mira: [2.93, 1.3, -11.83], focal: 33 },
    movil: { posicion: [0.2, 1.4, -8.6], mira: [2.88, 1.35, -11.57], focal: 20, desplazamientoVertical: 0.12 },
    deriva: [0, 0, -2],
    llegada: [],
    interfaz: {
      antetitulo: 'Equipo',
      titular: 'Cada sillón, unas manos.',
      boton: { texto: 'Conocer al equipo', href: '/equipo' },
    },
  },
  {
    id: '3',
    nombre: 'Galería',
    // Escritorio: la pared de la galería girada 31° hacia el fondo, con la cuadrícula en el
    // centro (libre de la tarjeta) y, a la derecha del cuadro, el ventanal del patio. Una
    // frontal estricta no deja ver el ventanal (queda a ~60° del eje). Móvil: frontal, la
    // cuadrícula entera por encima de la tarjeta. Deriva hacia el fondo, como la llegada.
    escritorio: { posicion: [-0.4, 1.6, -17.5], mira: [-3.83, 1.65, -19.56], focal: 22 },
    movil: { posicion: [1, 1.8, -19.6], mira: [-4.2, 1.85, -19.6], focal: 18, desplazamientoVertical: 0.15 },
    deriva: [0, 0, -0.3],
    llegada: [{ posicion: [0.4, 1.5, -14.5], mira: [-1.2, 1.6, -21] }],
    interfaz: {
      antetitulo: 'Galería',
      titular: 'Lo que sale por esa puerta.',
      boton: { texto: 'Ver galería', href: '/galeria' },
    },
  },
  {
    id: '4',
    nombre: 'Reservar',
    // Contrapicado suave en tres cuartos del sillón protagonista (cámara a 0,6 m), rodeando la
    // tarima por la derecha, recortado contra el ventanal del patio.
    escritorio: { posicion: [2.1, 0.6, -19.3], mira: [-0.3, 1, -22.6], focal: 32 },
    movil: { posicion: [1.9, 0.6, -19.2], mira: [0, 0.9, -22.6], focal: 20, desplazamientoVertical: 0.18 },
    deriva: [-0.15, 0.05, 0.2],
    llegada: [],
    interfaz: {
      antetitulo: 'Reservar',
      titular: 'Tu silla te espera.',
      boton: { texto: 'Reservar cita', href: '/reservar' },
    },
  },
  {
    id: '5',
    nombre: 'Ubicación',
    // Media vuelta amplia mientras avanza (la mirada pasa por la galería), nunca sobre sí misma.
    escritorio: { posicion: [0.6, 1.6, -10.5], mira: [0, 1.5, 0], focal: 26 },
    movil: { posicion: [0.4, 1.55, -9.5], mira: [0, 1.55, 0], focal: 16, desplazamientoVertical: 0.12 },
    deriva: [0, 0, 0.5],
    llegada: [
      { posicion: [1.2, 1.3, -18], mira: [-3, 1.4, -18.6] },
      { posicion: [0.6, 1.5, -15.2], mira: [-1.6, 1.7, -6] },
    ],
    interfaz: {
      antetitulo: 'Ubicación',
      titular: 'A pie de calle.',
      boton: { texto: 'Ver ubicación', href: '/ubicacion' },
      botonRuta: 'Cómo llegar',
    },
  },
  {
    id: 'E',
    nombre: 'Epílogo',
    // Una sola transición desde Ubicación: avance hacia la puerta con fundido a blanco.
    escritorio: { posicion: [0, 1.5, -1.2], mira: [0, 1.5, 6], focal: 30 },
    movil: { posicion: [0, 1.5, -1.2], mira: [0, 1.3, 6], focal: 18 },
    deriva: [0, 0, 0],
    llegada: [],
    interfaz: {
      titular: 'José Vila. Te esperamos.',
      boton: { texto: 'Reservar cita', href: '/reservar' },
    },
  },
];
