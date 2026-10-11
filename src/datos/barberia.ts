// Medidas y coordenadas de la barbería (docs/03-escena.md). Metros, Y arriba,
// escaparate en z = 0 y el local hacia Z negativo hasta el patio (z = −26).
// X de izquierda a derecha visto desde la entrada. La escena, la cámara y las
// pruebas leen de aquí; nada de números sueltos en los componentes.

export type Vec3 = readonly [number, number, number];

/** Lado del pasillo: −1 izquierda (galería), +1 derecha (lavacabezas). */
export type Lado = -1 | 1;
export const LADOS: readonly Lado[] = [-1, 1];

export const ENVOLVENTE = {
  xMin: -4.2,
  xMax: 4.2,
  zFrente: 0,
  zFondo: -26,
  alto: 4,
  /** Grosor de muros, techo y suelo en la maqueta (hacia fuera del volumen interior). */
  grosor: 0.2,
} as const;

export const ANCHO = ENVOLVENTE.xMax - ENVOLVENTE.xMin;
export const PROFUNDIDAD = ENVOLVENTE.zFrente - ENVOLVENTE.zFondo;

/** Límites de las tres zonas a lo largo de Z. */
export const ZONAS = {
  /** Entrada y recepción: de z = 0 a −4,4. */
  finEntrada: -4.4,
  /** Puestos: de −4,4 a −16,4; después, el fondo hasta −26. */
  finPuestos: -16.4,
} as const;

// ——— Escaparate y entrada (z = 0) ———

export const ESCAPARATE = {
  /** Zócalo negro bajo el vidrio. */
  zocalo: 0.25,
  /** Borde superior del vidrio; encima, el dintel. */
  vidrioArriba: 3.2,
  /** Montantes de la carpintería (simétricos): jambas de la puerta y divisiones del escaparate. */
  montantesX: [0.9, 2.55],
  perfil: 0.06,
  /** Fondo de la carpintería fija, de z = 0 hacia fuera (el vidrio está en z = +0,05..+0,07). */
  fondoPerfil: 0.06,
  puerta: {
    ancho: 1.8,
    alto: 2.6,
    /** Perfil de las hojas (más ancho que el fijo) y fondo, retranqueado 0,02 m hacia dentro. */
    perfilHoja: 0.09,
    fondoHoja: 0.05,
    retranqueoHoja: 0.02,
    /** Rodapié de cada hoja, a la altura del zócalo del escaparate. */
    rodapieHoja: 0.25,
    /** Tiradores verticales de latón por dentro, junto al encuentro de las hojas. */
    tirador: { largo: 0.7, y: 1.05, seccion: 0.025, separacion: 0.06, distanciaEncuentro: 0.045 },
  },
} as const;

/** Dintel macizo sobre el escaparate, a haces con el muro de entrada (las letras del rótulo sobresalen por dentro). */
export const DINTEL = { y0: 3.2, y1: 4 } as const;

export const ROTULO = {
  texto: 'JOSÉ VILA',
  altoLetra: 0.32,
  y: 3.6,
  /** Por dentro del dintel, legible desde el interior. */
  z: -0.05,
  /** Fase 1: placa provisional de latón del ancho aproximado del texto (el rótulo real llega en la fase 2). */
  anchoProvisional: 2.3,
} as const;

export const POSTE = {
  posicion: [-1.5, 0, -0.4] as Vec3,
  altoPie: 1,
  diametroPie: 0.08,
  diametroBase: 0.3,
  cilindro: { diametro: 0.18, alto: 0.8 },
  remate: { diametro: 0.22, alto: 0.06 },
  altoBase: 0.03,
  /** Giro lento del cilindro (rad/s); el ángulo inicial sale de la semilla. Quieto en ?captura=1. */
  velocidadGiro: 0.5,
  semilla: 1509,
} as const;

export const MOSTRADOR = {
  /** Centro en planta (y = 0 es el suelo). */
  centro: [3, 0, -2.6] as Vec3,
  /** x (fondo), y (alto), z (largo). */
  tamano: [0.6, 1.05, 2.2] as Vec3,
  /** Encimera de piedra que vuela sobre el frente acanalado. */
  encimera: { grueso: 0.04, vuelo: 0.03 },
  /** Acanaladuras verticales del frente (cara x = centro − fondo/2): ancho, paso y cuánto sobresalen. */
  acanalado: { ancho: 0.035, paso: 0.06, saliente: 0.015 },
  /** Remate de latón bajo la encimera, en el frente y los costados. */
  remate: { alto: 0.025, saliente: 0.02 },
  /** Zócalo retranqueado bajo el cuerpo. */
  zocalo: { alto: 0.08, retranqueo: 0.03 },
} as const;

export const BANCO = {
  centro: [-3.85, 0, -2.4] as Vec3,
  tamano: [0.5, 0.45, 1.8] as Vec3,
  /** Asiento de cuero en dos cojines sobre un bastidor negro con patas. */
  cojines: 2,
  altoCojin: 0.1,
  holguraCojines: 0.01,
  bastidor: 0.04,
  pata: 0.04,
  retranqueoPatas: 0.05,
} as const;

export const PLANTA = {
  posicion: [-3.7, 0, -3.9] as Vec3,
  maceta: { diametro: 0.5, alto: 0.5 },
  /** Altura total de la planta desde el suelo. */
  alto: 1.4,
  diametroCopa: 0.8,
  /** Copa provisional: matas esféricas repartidas con semilla entre `yCopa` y `alto`. */
  matas: 6,
  yCopa: 0.5,
  radioMata: [0.17, 0.26] as readonly [number, number],
  semilla: 3907,
} as const;

// ——— Puestos de trabajo ———

export const PUESTOS = {
  /** Pregunta 8 de docs/09: 5 por lado (validado en la maqueta). */
  porLado: 5,
  zPrimero: -5.6,
  paso: 2.4,
} as const;

/** Ejes en Z de los puestos de cada lado (los dos lados son simétricos). */
export const puestosZ = (): number[] => Array.from({ length: PUESTOS.porLado }, (_, i) => PUESTOS.zPrimero - i * PUESTOS.paso);

export const LISTONES = {
  z0: ZONAS.finEntrada,
  z1: ZONAS.finPuestos,
  ancho: 0.06,
  separacion: 0.03,
  grueso: 0.04,
} as const;

export const CONSOLA = {
  /** z (largo), x (fondo), y (alto). */
  largo: 1.6,
  fondo: 0.45,
  alto: 0.85,
  /** Centro en |x|: contra los listones. */
  x: 3.935,
  encimera: 0.04,
  /** Retranqueo del cuerpo negro bajo la encimera, por el frente. */
  retranqueo: 0.01,
  /** Zócalo retranqueado que deja una sombra al pie. */
  zocalo: { alto: 0.08, retranqueo: 0.05 },
  /** Tirador de latón horizontal, centrado en el frente. */
  tirador: { largo: 0.42, alto: 0.016, saliente: 0.02, y: 0.7 },
} as const;

export const ESPEJO = {
  ancho: 0.8,
  alto: 1.5,
  y0: 1.05,
  /** Plano del vidrio en |x|. */
  x: 4.14,
  marco: 0.02,
  /** Fondo del vidrio y el marco. */
  grueso: 0.03,
} as const;

export const LINEAS_ESPEJO = {
  ancho: 0.035,
  alto: 1.5,
  /** Distancia de cada línea al eje del puesto. */
  separacion: 0.55,
  /** Fondo de la tira, adosada a la cara de los listones. */
  grueso: 0.015,
} as const;

export const SILLON = {
  /** Centro en |x|, a 1,35 m de la pared, mirando al espejo. */
  x: 2.85,
  /** Ancho (a lo largo de Z) y fondo con reposapiés (a lo largo de X). */
  ancho: 0.65,
  fondo: 0.8,
  alto: 1.1,
  alturaAsiento: 0.55,
  diametroBase: 0.5,
  /**
   * Piezas del sillón en coordenadas locales: `u` hacia el espejo (desde el
   * centro), `y` desde el suelo y anchos a lo largo de Z. Todo cabe en la caja
   * de arriba (u ±fondo/2, z ±ancho/2, alto), que usa la prueba de colisiones.
   */
  piezas: {
    base: { alto: 0.03 },
    columna: { diametro: 0.11, u: -0.02 },
    /** Bastidor cromado bajo el cojín; su cara superior es el arranque del asiento. */
    chasis: { u0: -0.2, u1: 0.18, y0: 0.38, y1: 0.43, ancho: 0.44 },
    asiento: { u0: -0.25, u1: 0.22, ancho: 0.5 },
    /** `uPie`, `yPie`: centro del canto inferior; inclinado hacia atrás (radianes). */
    respaldo: { uPie: -0.24, yPie: 0.46, alto: 0.44, grueso: 0.1, ancho: 0.48, inclinacion: 0.17 },
    reposacabezas: { holgura: 0.04, alto: 0.16, grueso: 0.09, ancho: 0.28, barras: 0.16, seccionBarra: 0.025 },
    reposabrazos: { u0: -0.22, u1: 0.17, y: 0.7, alto: 0.06, ancho: 0.07 },
    soporteBrazo: { u: 0.08, seccion: 0.03 },
    /** Pletina y brazo del reposapiés; el brazo sale del chasis en `uBrazo`. */
    reposapies: { u0: 0.25, u1: 0.4, y: 0.13, grueso: 0.02, ancho: 0.4, uBrazo: 0.12, seccion: 0.03 },
  },
} as const;

// ——— Fondo ———

export const GALERIA = {
  x: ENVOLVENTE.xMin,
  marco: { ancho: 0.6, alto: 0.8, perfil: 0.03, grueso: 0.03 },
  columnasZ: [-18.6, -19.6, -20.6],
  filasY: [1.35, 2.35],
  /** Lámina dentro del marco, rehundida respecto a su cara (grueso desde la pared). */
  lamina: { grueso: 0.01 },
  semilla: 3107,
} as const;

export const LAVACABEZAS = {
  z: [-18.4, -19.8],
  /** Centro en x; la pila contra la pared derecha y el asiento mirando al pasillo. */
  x: 3.75,
  /** Ancho (z), fondo (x) y alto de la pila. */
  ancho: 0.7,
  fondo: 0.9,
  altoPila: 0.95,
  alturaAsiento: 0.5,
  /** Pila: cubeta de fondo `fondo` (x) contra la pared, de `y0` a altoPila, sobre un pie. */
  pila: { fondo: 0.3, ancho: 0.6, y0: 0.8, pared: 0.03, pie: { fondo: 0.28, ancho: 0.46 } },
  /** Asiento hacia el pasillo: base, cojín, respaldo reclinado hacia la pila y brazos. */
  asiento: { fondo: 0.48, ancho: 0.62, cojin: 0.14, retranqueoPila: 0.12 },
  respaldo: { largo: 0.38, grueso: 0.1, inclinacion: 0.44 },
  brazos: { ancho: 0.06, alto: 0.12, largo: 0.38 },
  /** Grifería de latón en el borde de la pila junto a la pared. */
  grifo: { diametro: 0.03, alto: 0.17, cano: 0.14, mando: 0.035, retranqueo: 0.07 },
} as const;

export const ESTANTERIA = {
  z: -21.4,
  /** Ancho (z), fondo (x) y alto. */
  ancho: 0.9,
  fondo: 0.35,
  alto: 1.8,
  baldas: 4,
  /** Grueso de laterales, baldas y remate; trasera más fina. */
  tablero: 0.025,
  trasera: 0.015,
  /** Toallas enrolladas con el eje hacia el pasillo; filas por balda y huecos al azar. */
  toalla: { diametro: 0.12, largo: 0.3, porFila: 6, probabilidadHueco: 0.12 },
  semilla: 1404,
} as const;

export const TARIMA = {
  centro: [0, 0, -22.6] as Vec3,
  diametro: 2.6,
  alto: 0.12,
  /** Banda de latón en el borde superior (alto y ancho); bajo ella, la piedra se retranquea lo mismo. */
  canto: 0.03,
  /** Segmentos de los cilindros de la tarima y del sillón (de cerca se nota el polígono). */
  segmentos: 64,
} as const;

export const SILLON_PROTAGONISTA = {
  /** Sobre la tarima, mirando a +Z (hacia la entrada). */
  centro: [0, TARIMA.alto, -22.6] as Vec3,
  ancho: 0.75,
  fondo: 1,
  alto: 1.15,
  alturaAsiento: 0.6,
  diametroBase: 0.55,
  /** Piezas en coordenadas locales: y desde la tarima, z positivo hacia el frente. */
  placa: 0.04,
  columna: { diametro: 0.16, collar: 0.24 },
  chasis: { ancho: 0.6, fondo: 0.55, alto: 0.08 },
  asiento: { ancho: 0.58, fondo: 0.56, grueso: 0.13 },
  /** Respaldo reclinado (rad) desde el borde trasero del asiento (z = pivoteZ). */
  respaldo: { ancho: 0.58, alto: 0.46, grueso: 0.12, inclinacion: 0.21, pivoteZ: -0.22, carcasa: 0.03 },
  reposacabezas: { ancho: 0.3, alto: 0.1, grueso: 0.09, separacion: 0.035 },
  brazos: { x: 0.325, sobreAsiento: 0.2, ancho: 0.09, grueso: 0.05, largo: 0.5, voluta: 0.07 },
  reposapies: { ancho: 0.48, largo: 0.17, y: 0.2, z: 0.415, labio: 0.05 },
  /** Palanca de la bomba hidráulica: de la columna al pedal (punto local) y tamaño del pedal. */
  bomba: { pedal: [0.3, 0.06, 0.2] as Vec3, tamano: [0.08, 0.015, 0.06] as Vec3 },
  /** Varilla de latón (brazos, reposapiés, bomba). */
  varilla: 0.025,
} as const;

export const VENTANAL = {
  z: ENVOLVENTE.zFondo,
  x0: -3.9,
  x1: 3.9,
  y0: 0.1,
  y1: 3.6,
  panos: 8,
  travesanoY: 2.6,
  /** Ancho del perfil y fondo de la carpintería (de z = −26 hacia dentro). */
  perfil: 0.06,
  /**
   * Silueta provisional de una planta del patio (fase 1): tallos y hojas planos y oscuros
   * entre el vidrio (z ≈ −26,05) y la carpintería, abiertos en abanico desde `x`.
   */
  silueta: { x: 2.6, z: -26.03, tallos: 7, alto: 2.3, abertura: 0.55, tallo: 0.03, hoja: { largo: 0.8, ancho: 0.34 }, semilla: 2607 },
} as const;

export const LUCERNARIO = {
  centro: [0, ENVOLVENTE.alto, -24.6] as Vec3,
  lado: 2.4,
  /** Altura del vidrio, arriba del pozo. */
  yPozo: 5.4,
} as const;

// ——— Techo y suelo ———

export const RETICULA = {
  ancho: 0.05,
  longitudinalesX: [-1.4, 1.4],
  z0: -1.2,
  z1: ZONAS.finPuestos,
  /** Transversal de la recepción (además de una por pareja de puestos). */
  zRecepcion: -3.2,
  /** Marco cuadrado alrededor del lucernario. */
  marcoLucernario: 3.4,
} as const;

/** Ejes Z de las líneas transversales de la retícula: recepción y una por pareja de puestos. */
export const reticulaTransversalesZ = (): number[] => [RETICULA.zRecepcion, ...puestosZ()];

export const FOCO_SILLON = { posicion: [0, 3.95, -21] as Vec3 } as const;

export const SUELO = {
  /** Piezas de 1,2 × 0,6 m con el lado largo a lo largo de Z. */
  pieza: { x: 0.6, z: 1.2 },
  junta: 0.004,
  /** Variación de tono entre piezas en la maqueta (fracción del gris base). */
  variacionTono: 0.12,
  semilla: 2611,
} as const;
