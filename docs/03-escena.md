# 03 · Escena

Todas las cifras son **hipótesis de partida** que se validan en la fase de maqueta en bloques (`08-hoja-de-ruta.md`, fase 1). Si cambian, se actualiza este documento en el mismo cambio y se anota en `09`. La fuente de verdad en código será `src/datos/barberia.ts`.

## Sistema de coordenadas
- Unidades: **metros**, escala real.
- Eje **Y hacia arriba**. Suelo en `y = 0`.
- Eje **X** de izquierda a derecha visto desde la entrada.
- Eje **Z** hacia el espectador: el escaparate está en `z = 0` y el local se adentra hacia **Z negativo** hasta el patio (`z = −26`).

## Envolvente del local
| Elemento | Valor |
|---|---|
| Ancho interior | 8,4 m (`x` de −4,2 a +4,2) |
| Profundidad | 26 m (`z` de 0 a −26) |
| Altura libre (techo plano) | 4,0 m |
| Paredes y techo | negro mate (`02`) |
| Zonas | entrada y recepción `z` 0 a −4,4 · puestos −4,4 a −16,4 · fondo (galería, lavacabezas, sillón protagonista) −16,4 a −26 |

## Escaparate y entrada (`z = 0`)
| Elemento | Valor |
|---|---|
| Zócalo | negro, `y` 0 a 0,25 |
| Vidrio | `y` 0,25 a 3,2, en todo el ancho; emisivo suave de cielo (`#f2f4f6`), la calle no se modela |
| Carpintería | negra, montantes en `x = ±0,9` (puerta) y `±2,55`; perfil de 0,06 m |
| Puerta | central, dos hojas, 1,8 × 2,6 m |
| Dintel | macizo negro, `y` 3,2 a 4,0, a haces con el muro de entrada (sin fondo hacia dentro) |
| Rótulo | **JOSÉ VILA** en letras de latón de 0,32 m de alto, centrado en el dintel por dentro (`y = 3,6`, `z = −0,05`), legible desde el interior. Geometría propia o `CanvasTexture`, nunca `Text` de drei (`06`) |
| Poste de barbero | de pie, en (−1,5, 0, −0,4): pie de latón de 1,0 m, cilindro luminoso Ø 0,18 × 0,8 m (`y` 1,0 a 1,8) con espiral roja, blanca y azul que gira despacio (quieto en `?captura=1`), remates de latón |
| Mostrador de recepción | caja de 0,6 (x) × 1,05 (alto) × 2,2 (z) centrada en (3,0, 0, −2,6); frente acanalado negro mirando al pasillo, encimera de piedra negra, remate de latón |
| Banco de espera | 0,5 × 0,45 × 1,8 m, centrado en (−3,85, 0, −2,4), cuero negro |
| Planta | maceta negra Ø 0,5 × 0,5 m con planta de 1,4 m, en (−3,7, 0, −3,9) |

## Puestos de trabajo
| Elemento | Valor |
|---|---|
| Número | **5 por lado** (10 en total), ejes en `z = −5,6, −8,0, −10,4, −12,8, −15,2` (paso 2,4 m) |
| Revestimiento de listones | en ambas paredes, de `z = −4,4` a `−16,4`, `y` 0 a 4; listones de 0,06 m con separación de 0,03 m, 0,04 m de grueso |
| Consola | 1,6 (z) × 0,45 (x) × 0,85 m (alto), contra la pared, centrada en `x = ±3,935`; encimera de piedra negra, tirador de latón |
| Espejo | rectangular, vidrio de 0,8 × 1,5 m, `y` 1,05 a 2,55, en `x = ±4,14`; marco de latón de 0,02 m por fuera del vidrio |
| Líneas de luz del espejo | dos verticales por espejo, 0,035 × 1,5 m, a ±0,55 m del eje del puesto |
| Sillón de barbero (moderno) | centrado en `x = ±2,85` (a 1,35 m de la pared), mirando al espejo; huella ~0,65 × 0,8 m con reposapiés, alto 1,1 m; cuero negro, base cromada Ø 0,5 m |
| Pasillo libre | entre respaldos (`x ≈ ±2,45`): ~4,9 m |

## Fondo
| Elemento | Valor |
|---|---|
| Galería | pared izquierda (`x = −4,2`): 6 marcos de latón de 0,6 × 0,8 m (vertical) en 2 filas × 3, columnas en `z = −18,6, −19,6, −20,6`, centros a `y = 1,35` y `2,35`; láminas abstractas en blanco y negro generadas por código con el generador con semilla |
| Lavacabezas | pared derecha: 2, en `z = −18,4` y `−19,8`, `x = 3,75`, con la pila contra la pared y el asiento mirando al pasillo; grifería de latón |
| Estantería de toallas | pared derecha, `z = −21,4`: 0,9 × 0,35 × 1,8 m, 4 baldas, toallas blancas enrolladas |
| Tarima | circular, Ø 2,6 m, alto 0,12 m, centro (0, 0, −22,6); piedra negra con canto de latón |
| Sillón protagonista | clásico, sobre la tarima, mirando a **+Z** (hacia la entrada); huella ~0,75 × 1,0 m, alto 1,15 m; cuero negro capitoné, reposabrazos y reposapiés de latón, base de columna |
| Ventanal al patio | muro del fondo (`z = −26`), `x` de −3,9 a +3,9 (machones de 0,3 m), `y` 0,1 a 3,6; carpintería negra en cuadrícula: 8 paños de ~0,975 m y un travesaño a `y = 2,6`; vidrio emisivo con la silueta de una planta del patio (por código) |
| Lucernario | hueco de 2,4 × 2,4 m en el techo centrado en (0, 4,0, −24,6), con pozo hasta `y = 5,4` (paredes del pozo blanco roto mate, para que brille), vidrio emisivo arriba. Está algo detrás del sillón para que el haz del sol, que llega inclinado desde el patio, caiga **sobre el sillón** |

## Techo
- Plano, negro mate, a `y = 4,0`.
- **Retícula de líneas de luz** empotradas (tiras emisivas de 0,05 m, `#eef3f8`):
  - dos **longitudinales** en `x = ±1,4`, de `z = −1,2` a `z = −16,4`;
  - una **transversal** sobre cada pareja de puestos (`z` de los ejes de puesto) y otra en la recepción (`z = −3,2`), de pared a pared;
  - un **marco** cuadrado de 3,4 × 3,4 m alrededor del lucernario.
- **Foco cenital** del sillón protagonista en (0, 3,95, −21,0), apuntando al asiento.

## Suelo
- **Piedra negra veteada** en piezas de 1,2 × 0,6 m (lado largo a lo largo de Z), juntas finas `#0a0b0c`, pulido.
- Variación de veta entre piezas, determinista (con semilla), en coordenadas del mundo para que no se repita pieza a pieza.
- **Reflejo**: ver «Iluminación» (pregunta abierta en `09`).

## Atmósfera
- **Haces de luz** desde el lucernario (hacia el sillón) y desde los paños del ventanal del patio, por geometría aditiva como en Boxrus (`src/lib/haces.ts` reutilizado).
- **Motas** muy escasas, solo dentro de los haces (~300 en nivel alto, 0 en bajo). Nada de polvo por todo el local.
- **Neblina** muy ligera para dar profundidad al pasillo.

## Contenido determinista
- Toda variación (vetas del suelo, láminas de la galería, giro del poste, motas, posición de los detalles) sale del generador con semilla `src/lib/azar.ts`.
- **Detalles de vida** (lista cerrada, **sin saturar**; la barbería debe parecer lista para abrir, no decorada). Como máximo estos seis:
  1. Una **bandeja de latón** con tijeras, navaja, peine y brocha en la consola del puesto de la parada 1.
  2. **Capas blancas** dobladas sobre el reposabrazos de 3 de los 10 sillones.
  3. **Toallas** blancas enrolladas en la estantería del fondo.
  4. **Frascos y botes** sin etiqueta (o con monograma JV) en algunas consolas, 2–3 por consola.
  5. La **planta** de la entrada.
  6. Una **máquina de cortar** colgada de su soporte en un puesto.
  Sin marcas de terceros en ningún objeto. Posiciones en `src/datos/barberia.ts`.

## Iluminación (estrategia)
Como Boxrus, la escena es **estática y cerrada**: luz precalculada muy rentable. La novedad es el **suelo pulido** y los **espejos**.
1. **Sol**: luz direccional desde el patio (desde −Z, ligeramente desde +X), alto (~65° de elevación, hipótesis) para que el haz del lucernario caiga sobre el sillón; una sombra de calidad. La hora del día es la pregunta abierta 4.
2. **Retícula y líneas de los espejos**: caras emisivas en todas + 4–6 `RectAreaLight` representativas sobre el pasillo en nivel alto.
3. **Cielo del escaparate**: vidrio emisivo + una `RectAreaLight` grande y suave mirando hacia dentro.
4. **Foco del sillón**: `SpotLight` sin sombra (como el refuerzo de la jaula de Boxrus), salvo que la sombra aporte.
5. **Entorno**: capturado de la propia barbería (cámara cúbica y PMREM, como `luz/Entorno.tsx` de Boxrus); lo usan latón, cromo, cuero, espejos y suelo.
6. **Luz precalculada en Blender** (pregunta abierta 5, recomendación: sí): suelo, muros, techo y pozo del lucernario, con el proceso de Boxrus (mapas proyectados en coordenadas del mundo, sin segundas UV, dos pasadas: luz artificial y día).
7. **Reflejo del suelo** (pregunta abierta 6): `MeshReflectorMaterial` de drei (reflejo plano real, con desenfoque y rugosidad) en nivel alto; entorno capturado en medio y bajo. Coste: una pasada más de render. Hay que medir en la fase 3.
8. **Espejos**: vidrio oscuro muy brillante con el entorno capturado; **sin reflejo en tiempo real** (salvo, si sobra presupuesto, el espejo del plano 1 en nivel alto).
9. **Postproceso** en un trozo diferido desde el principio (lección de Boxrus): SSAO, bloom por umbral (líneas de luz, ventanales, poste), AgX, viñeteado y grano. Profundidad de campo en planos de detalle (fase 6).
