# 04 · Recorrido y paradas

El recorrido tiene un **prólogo**, **5 paradas** (una por sección de la web) y un **epílogo**. Cada parada usa un tipo de plano distinto: detalle de un puesto, travelling lateral, frontal a la pared de la galería, contrapicado del sillón protagonista y contraplano hacia el escaparate. El recorrido va de la calle al fondo y vuelve a la calle.

Coordenadas en el sistema de `03-escena.md`. Son **hipótesis de partida**: se ajustan en la fase 1 (maqueta en bloques) y la fuente de verdad pasa a ser `src/datos/paradas.ts`.

> **Fase 1 en curso:** los encuadres ya se han ajustado sobre la maqueta (planos 1–5 y todos los móviles, con desplazamiento vertical del objetivo en móvil). Mientras no se cierre la fase, los valores vigentes son los de `src/datos/paradas.ts`; la tabla se actualizará al cerrarla.

## Resumen

| # | Sección | Elemento | Tipo de plano | Cámara (x, y, z) | Mira a (x, y, z) | Focal aprox. |
|---|---|---|---|---|---|---|
| P | Prólogo: la entrada | Pasillo + sillón protagonista | Simétrico desde el escaparate, cámara baja | (0,0, 1,35, −0,9) | (0,0, 1,1, −22,6) | 28 mm |
| 1 | Servicios | Un puesto: consola con la bandeja de herramientas, espejo, sillón | Detalle en tres cuartos | (−0,9, 1,45, −6,0) | (−3,9, 1,0, −8,3) | 40 mm |
| 2 | Equipo | Fila de sillones de la derecha | Travelling lateral (~2 m hacia −Z) | (1,0, 1,25, −9,0) | (3,0, 0,95, −12,0) | 35 mm |
| 3 | Galería | Pared de la galería | Frontal | (−1,0, 1,7, −19,6) | (−4,2, 1,85, −19,6) | 35 mm |
| 4 | Reservar | Sillón protagonista bajo el haz del lucernario | Contrapicado suave en tres cuartos, contraluz del patio | (2,0, 1,05, −19,4) | (0,0, 0,85, −22,6) | 30 mm |
| 5 | Ubicación | Escaparate, rótulo JOSÉ VILA, poste, mostrador | Contraplano hacia la calle | (0,8, 1,6, −12,0) | (0,0, 1,9, 0,0) | 26 mm |
| E | Epílogo | La puerta | Avance hacia la calle, fundido a blanco | (0,0, 1,5, −1,2) | (0,0, 1,5, 6,0) | 30 mm |

## Detalle de cada plano

### P · Prólogo: la entrada
- **Encuadre:** desde dentro del escaparate, cámara baja (1,35 m), composición simétrica. El pasillo de piedra pulida en el centro reflejando la retícula del techo; las dos filas de puestos con sus líneas de luz verticales en fuga; al fondo, el **sillón protagonista** a contraluz del patio, con el haz del lucernario cayendo sobre él.
- **Movimiento al empezar el scroll:** avance lento por el eje del pasillo.
- **Interfaz:**
  - Titular: «José Vila»
  - Subtítulo: «Barbería.»
  - Texto: «Corte, barba y afeitado clásico, sin prisas.»
  - Indicación: «Desliza para entrar» + botón «Saltar recorrido».

### 1 · Servicios — el puesto
- **Encuadre:** la cámara se acerca al segundo puesto de la izquierda. En primer término, el respaldo del sillón; detrás, la consola con la **bandeja de latón** (tijeras, navaja, peine, brocha) y el espejo enmarcado por sus dos líneas de luz.
- **Idea:** el oficio, herramienta a herramienta.
- **Interfaz:**
  - Antetítulo: «Servicios»
  - Titular: «Tijera, navaja y tiempo.»
  - Contenido: 3–4 servicios destacados con precio y duración.
  - Botón: «Ver servicios y precios» → `/servicios`

### 2 · Equipo — la fila de sillones
- **Encuadre:** la cámara cruza el pasillo y se coloca en paralelo a la fila de la derecha. Durante la pausa avanza despacio a lo largo de la fila: los sillones pasan uno a uno, cada uno con su espejo y su luz.
- **Idea:** cada sillón tiene su barbero.
- **Interfaz:**
  - Antetítulo: «Equipo»
  - Titular: «Cada sillón, unas manos.»
  - Contenido: los barberos (nombre ficticio y especialidad) con **hueco provisional** de retrato.
  - Botón: «Conocer al equipo» → `/equipo`

### 3 · Galería — la pared de los marcos
- **Encuadre:** la cámara sigue hacia el fondo, gira a la izquierda y se planta frente a la pared de la galería: seis marcos de latón con láminas en blanco y negro sobre el negro mate; a la derecha del cuadro asoma la luz del patio.
- **Idea:** lo que sale por esa puerta.
- **Interfaz:**
  - Antetítulo: «Galería»
  - Titular: «Lo que sale por esa puerta.»
  - Contenido: 3 **huecos provisionales** de la galería.
  - Botón: «Ver galería» → `/galeria`

### 4 · Reservar — el sillón protagonista
- **Encuadre:** la cámara baja y rodea la tarima por la derecha hasta un contrapicado suave del sillón protagonista en tres cuartos: el haz del lucernario cae sobre el cuero y el latón, el ventanal del patio lo recorta a contraluz, la tarima con su canto de latón brilla en el suelo pulido.
- **Idea:** tu silla te espera.
- **Interfaz:**
  - Antetítulo: «Reservar»
  - Titular: «Tu silla te espera.»
  - Contenido: el próximo hueco libre (de la demo) y una línea sobre cómo funciona.
  - Botón: «Reservar cita» → `/reservar`

### 5 · Ubicación — de vuelta a la calle
- **Encuadre:** la cámara da media vuelta en el pasillo (giro amplio mientras avanza, nunca sobre sí misma) y mira hacia la entrada: el escaparate luminoso, el rótulo **JOSÉ VILA** en el dintel, el poste de barbero girando junto a la puerta, el mostrador y la retícula fugando hacia la calle, todo reflejado en el suelo.
- **Idea:** dónde estamos.
- **Interfaz:**
  - Antetítulo: «Ubicación»
  - Titular: «A pie de calle.»
  - Contenido: dirección, teléfono y horario de apertura.
  - Botones: «Cómo llegar» (abre la ruta en un servicio de mapas) y «Ver ubicación» → `/ubicacion`

### E · Epílogo
- **Movimiento:** una sola transición desde Ubicación, igual que las demás: la cámara avanza hacia la puerta y funde a blanco en la segunda mitad del tramo, como si saliera a la calle. La pausa del epílogo es el cierre en blanco; no hay scroll posterior (lección de Boxrus: dos transiciones finales se hacían largas).
- **Interfaz:** «José Vila. Te esperamos.» + botón «Reservar cita» + accesos a las 5 secciones.

Todos los textos son **borradores ficticios**; el tono definitivo es la pregunta abierta 2 de `09`.

## Reglas de coreografía
Heredadas de Boxrus (probadas y aprobadas por Luis allí; revisables):
- **Tramos:** 7 (P, 1–5, E). Cada parada tiene una **zona de pausa** (~40 % del tramo) con deriva lenta de cámara y la interfaz visible; el resto es transición.
- **Trayectoria:** curvas suaves para posición y punto de mira, independientes, con puntos de paso por transición en `paradas.ts`.
- **Velocidad:** ritmo uniforme sobre una «longitud» que suma desplazamiento y giro de la mirada (8 m por radián), con aceleración y frenada suaves; límite de **36° de giro por cada 1 % de progreso**, comprobado en pruebas. El tramo crítico aquí es la media vuelta de 4 a 5.
- **Colisiones:** la cámara nunca atraviesa sillones, consolas, espejos, mostrador, banco, poste, planta, lavacabezas, estantería, tarima ni sillón protagonista. Prueba automática obligatoria.
- **Reversible:** subir el scroll deshace exactamente el recorrido.
- **Ajuste a paradas (escritorio):** desactivado por defecto; se prueba con `?ajuste=1` (pregunta abierta 7).
- **Scroll por paradas (móvil):** en pantalla táctil y vertical (ancho/alto < 0,8), cada gesto lleva a la parada siguiente o anterior, sin posiciones intermedias, a ritmo constante (2,2 s por transición). Los gestos durante la animación se ignoran. Deslizar **hacia la izquierda avanza** y **hacia la derecha retrocede**, solo entre el prólogo y Ubicación; la salida al cierre y la vuelta, solo en vertical. Forzable en escritorio con `?paginado=1`.
- **Menú de píldora (móvil):** abajo y centrado: Inicio (casa), Servicios (tijeras), Equipo (sillón), Galería (marco), Reservar (calendario), Ubicación (chincheta). Iconos SVG propios. **Todos los saltos duran 1,5 s**: tramo real si la sección es vecina; si no, medio tramo de salida, fundido a negro, corte y medio tramo de llegada.
- **Logotipo JOSÉ VILA (arriba):** en la landing vuelve al prólogo con un viaje igual que los del menú, sin recargar; en las demás páginas lleva a `/`.
- **Reservar siempre a mano:** botón «Reservar» fijo en la cabecera de escritorio y en las páginas (en móvil lo cubre el icono de la píldora).
- **Indicador de progreso (escritorio):** «01 / 05» con el nombre de la sección y puntos clicables.

## Encuadres en móvil (vertical)
Cada parada define un **encuadre alternativo** para pantalla vertical (relación ancho/alto < 0,8): más campo de visión o más distancia y el protagonista desplazado hacia arriba para dejar la interfaz abajo. Se fijan en la fase 1 a 390 × 844, en `src/datos/paradas.ts` (`movil`). En un local estrecho y largo, el vertical favorece el prólogo (el pasillo en fuga) y complica los planos laterales (1, 2 y 3): ahí se prioriza el elemento protagonista.

## Modos de URL (necesarios para verificar)
- `/?parada=N` (N = `P`, `1`…`5`, `E`) coloca la cámara directamente en esa parada.
- `/?captura=1` desactiva animaciones, deriva, giro del poste, motas, grano y toda aleatoriedad no sembrada.
- `/?depuracion=1` muestra la trayectoria, los ejes, el FPS y los avisos de colisión, y expone `window.barberiaRender` con llamadas de dibujo y triángulos.
- `/?ajuste=1` activa el ajuste a paradas; `/?paginado=1` fuerza el scroll por paradas del móvil.
- `/?parada=P&captura=1&exportar=1` exporta la geometría para hornear la luz en Blender (fase 3).
- Cuando la cámara está colocada y hay fotogramas pintados (con texturas y postproceso), `<html>` recibe **`data-barberia-lista`**: es la señal para capturar.
