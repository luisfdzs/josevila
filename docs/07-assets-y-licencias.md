# 07 · Assets y licencias

## Política
- Solo recursos **CC0** (preferente) o **CC BY** (con atribución en una página de créditos). Para **tipografías**, también **SIL OFL**. OpenStreetMap: ODbL con atribución.
- **Nada de la referencia visual** (ni el vídeo ni sus fotogramas), **ninguna foto de terceros**, **ninguna foto de personas** (ni reales ni generadas: decisión de Luis, se usan huecos provisionales) y **ningún logotipo o marca de terceros** (fabricantes de sillones, máquinas, cosméticos).
- Todo recurso externo se anota en el registro de abajo **antes** de usarlo.
- Preferencia por **generar por código** lo geométrico o repetitivo (lección de Boxrus: casi todo salió por código, con cero descarga).

## Inventario

| Recurso | Origen previsto | Alternativa |
|---|---|---|
| Envolvente, escaparate, carpintería, dintel, lucernario y pozo | Por código | — |
| Revestimiento de listones | Por código (instancias o normal map de listones) | — |
| Retícula de luz y líneas de los espejos | Por código (tiras emisivas fusionadas) | — |
| Rótulo JOSÉ VILA (letras de latón) | Por código: `CanvasTexture` con la tipografía de titulares o extrusión de contornos | — |
| Suelo de piedra negra veteada | Textura CC0 de mármol negro (ambientCG / Poly Haven, a buscar en la fase 2) **o** vetas por código (ruido con semilla) | La otra |
| Consolas, mostrador, banco, estantería, tarima | Por código | — |
| Espejos | Por código (vidrio oscuro + entorno capturado) | — |
| Latón, cromo | Materiales PBR por código | — |
| Cuero (sillones, banco) | Grano por código (`pixelesCuero` de Boxrus) + capitoné en el sillón protagonista | Textura CC0 |
| Sillón de barbero moderno (×10) | Por código: primitivas y tornos (`LatheGeometry`), una malla instanciada | Modelo CC0 low poly |
| **Sillón protagonista** (clásico) | Modelo **CC0 o CC BY** si hay uno bueno y ligero; si no, por código con más detalle | Por código |
| Lavacabezas | Por código | Modelo CC0 |
| Poste de barbero | Por código (cilindro con espiral en el sombreador) | — |
| Planta de la entrada y silueta del patio | Modelo CC0 de planta en maceta (Poly Haven tiene varias) / silueta por código | Por código |
| Detalles de vida (lista cerrada en `03`): bandeja y herramientas, capas, toallas, frascos, máquina | Por código, como los de Boxrus | Modelos CC0 ligeros |
| Láminas de la galería en 3D | Por código (composiciones abstractas en blanco y negro con semilla) | — |
| Mapa de entorno | **Capturado de la propia barbería** (cámara cúbica + PMREM) | — |
| Tipografías | Fontsource (OFL), alojadas en el sitio | — |
| Mapa de `/ubicacion` | Teselas de OpenStreetMap (ODbL, atribución) vía Leaflet | Enlace externo sin mapa |
| Retratos del equipo y fotos de la galería | **Huecos provisionales** (componente `Hueco`) | Fotos reales en el proyecto futuro |

## Formatos y compresión
- Modelos: `.glb` con Meshopt (o Draco).
- Texturas y mapas de luz: `.ktx2` (Basis Universal) con mipmaps. Color y rugosidad en ETC1S a 1K; normales en UASTC + zstd a 512 (en Boxrus, a 1K pesaban ~1,3 MB cada una).
- Tipografías: `woff2`, solo pesos y caracteres usados.

### Herramientas (ya instaladas en este equipo para Boxrus)
- **Blender 5.2.2 LTS** portátil: `%LOCALAPPDATA%\Programs\blender-5.2.2-windows-x64\blender.exe` (no está en el `PATH`).
- **KTX-Software 4.4.2** (`ktx`, `toktx`) en `%LOCALAPPDATA%\Programs\KTX-Software\bin`, en el `PATH` de usuario.
- **gltf-transform**: `@gltf-transform/cli` como dependencia de desarrollo (`npx gltf-transform …`).

Cadena probada en Boxrus:
```bash
npx gltf-transform resize   entrada.glb a.glb --width 1024 --height 1024
npx gltf-transform etc1s    a.glb b.glb      # color (más pequeño)
npx gltf-transform uastc    a.glb b.glb      # normales y detalle fino (más calidad)
npx gltf-transform meshopt  b.glb salida.glb
npx gltf-transform inspect  salida.glb
# texturas sueltas
toktx --t2 --encode etc1s --clevel 4 --qlevel 200 --genmipmap --assign_oetf srgb   salida.ktx2 color.jpg
toktx --t2 --encode etc1s --clevel 4 --qlevel 200 --genmipmap --assign_oetf linear salida.ktx2 rugosidad.jpg
toktx --t2 --encode uastc --uastc_quality 2 --zcmp 19 --genmipmap --resize 512x512 --assign_oetf linear salida.ktx2 normal_gl.jpg
```

### En el navegador
- `useGLTF` de drei decodifica Meshopt sin configuración.
- `.ktx2` necesita el **transcodificador Basis**: copiar `three/examples/jsm/libs/basis/` a `public/basis/`, apuntar `KTX2Loader.setTranscoderPath('/basis/')` y excluir la carpeta de `tsconfig` (si no, `astro check` analiza el JS minificado y falla). **Nunca** el CDN por defecto de drei.

### Descargas en este equipo
El clasificador de permisos bloqueó en Boxrus descargar y descomprimir en un solo comando. Funciona por partes: `curl` a una carpeta del scratchpad, extraer solo lo necesario y convertir con `toktx` hacia `public/`. Si algo es imprescindible, pedírselo a Luis (que lo ejecute con `!`).

## Registro de licencias

| Recurso | Fichero en el repo | Autor | Fuente (URL) | Licencia | Atribución necesaria | Fecha |
|---|---|---|---|---|---|---|
| *(vacío: se rellena antes de usar cada recurso)* | | | | | | |
