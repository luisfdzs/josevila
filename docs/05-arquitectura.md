# 05 · Arquitectura

## Stack
El mismo que Billaron y Boxrus (versiones de referencia: las de `C:\Proyectos\boxrus\package.json`; al instalar, la última estable de cada paquete, fijada en `package-lock.json`).

| Pieza | Elección | Motivo |
|---|---|---|
| Framework web | **Astro 7** | Páginas estáticas muy rápidas; el 3D va en una «isla» |
| Contenido | **Colecciones de contenido de Astro** | Servicios, equipo, galería, ubicación y reservas editables sin tocar código |
| 3D | **Three.js** con **React Three Fiber** + **drei** | Composición declarativa, instancias, utilidades probadas |
| Postproceso | **@react-three/postprocessing** + `postprocessing` | SSAO, bloom, AgX, viñeteado, grano, profundidad de campo; **en un trozo diferido** |
| Integración React | **@astrojs/react** | Para la isla 3D |
| Scroll | **GSAP ScrollTrigger** + **Lenis** | Scroll suave y progreso preciso por tramos |
| Tipografías | **Fontsource** (OFL), alojadas en el sitio | Sin CDN externos |
| Tipos | TypeScript estricto + `astro check` (también en un hook de Claude Code) | — |
| Pruebas | **Vitest** | Lógica pura: medidas, recorrido, colisiones, contenido, demo de reservas |
| Capturas | **playwright-core** (dev) con el Chrome del sistema | Capturas deterministas aunque la ventana de Chrome esté oculta (lección de Billaron) |
| Assets | `@gltf-transform/cli` (dev), KTX-Software (`toktx`), Blender 5.2.2 (luz horneada) | Ya instalados en el equipo para Boxrus (`07`) |
| Despliegue | **Vercel**, salida estática | Previsualización por rama, producción desde `prod` |

## Estructura de carpetas (objetivo)
```text
src/
  pages/
    index.astro              # landing: recorrido + secciones HTML superpuestas + cierre
    servicios.astro
    equipo.astro
    galeria.astro
    reservar.astro           # demo sin backend
    ubicacion.astro
  content/                   # contenido editable (ficticio en este proyecto)
    servicios/               # una entrada por servicio: nombre, categoría, duración, precio, descripción
    equipo/                  # una entrada por barbero: nombre ficticio, especialidad, años, retrato (hueco)
    galeria/                 # una entrada por hueco: categoría de corte, pie, texto alternativo
    ubicacion/               # dirección, coordenadas, teléfono, horario de apertura
    reservas/                # configuración de la demo: franjas, antelación, festivos
  content.config.ts          # conecta los esquemas a las colecciones
  layouts/
    Base.astro               # <html lang="es">, metadatos, noindex, fuentes, logotipo
    Pagina.astro             # layout común de las 5 páginas (fase 4)
  components/
    ui/                      # Astro: Logo, MenuParadas (píldora), cabecera, progreso, saltar, pie, Hueco (provisional)
    reservas/                # formulario de la demo (script del navegador, sin React)
    barberia/                # isla React Three Fiber
      Barberia.tsx           # <Canvas>, carga, niveles de calidad, señal data-barberia-lista
      escena/                # Envolvente, Escaparate, Recepcion, Puestos, Sillones, Fondo, Galeria,
                             # SillonProtagonista, Techo (retícula), Suelo, Detalles, materiales.ts
      camara/                # ControladorCamara
      luz/                   # Iluminacion, Entorno, Atmosfera (haces y motas), Postproceso (diferido)
      depuracion/            # Depuracion (trayectoria, ejes, FPS), Exportar (para Blender)
  datos/
    barberia.ts              # medidas y coordenadas de 03-escena.md
    paradas.ts               # planos de 04: cámara, encuadre móvil, textos, enlaces, iconos
    luz.ts                   # valores de luz, materiales y postproceso (fase 3)
    texturas.ts              # parámetros de texturas por código y externas
  lib/
    azar.ts                  # generador con semilla                    ← de Boxrus, tal cual
    progreso.ts              # estado compartido del progreso            ← de Boxrus
    pausas.ts                # reparto del progreso en pausas            ← de Boxrus
    trayectoria.ts           # progreso → posición, mira, campo de visión ← de Boxrus
    scroll.ts                # Lenis + ScrollTrigger → progreso          ← de Boxrus
    paginado.ts              # scroll por paradas, viajes del menú y del logotipo ← de Boxrus
    modo.ts                  # ?parada, ?captura, ?depuracion, ?ajuste, ?paginado, ?exportar ← de Boxrus
    colisiones.ts            # obstáculos del local y prueba de colisiones ← de Boxrus, obstáculos nuevos
    haces.ts                 # haces de luz desde huecos                 ← de Boxrus (fase 3)
    texturas.ts              # píxeles de texturas por código (vetas, listones, láminas, cuero)
    esquemas.ts              # esquemas zod del contenido (los usa content.config.ts; probados con Vitest)
    reservas.ts              # lógica de la demo: disponibilidad determinista, validación, proveedor
    soporte.ts               # WebGL, movimiento reducido, nivel de calidad
  estilos/
    global.css
public/
  basis/                     # transcodificador Basis (copiado de three; nunca CDN)
  texturas/                  # .ktx2
  luz/                       # mapas de luz horneados .ktx2 (fase 3)
  modelos/                   # .glb comprimidos (si hacen falta: sillón protagonista, planta)
  posters/                   # una imagen fija por plano (fase 5)
scripts/
  capturar.mjs               # capturas de los 7 planos con Playwright (← de Billaron, adaptado)
herramientas/
  blender/                   # recibir.mjs, hornear.py, combinar.py (← de Boxrus, fase 3)
tests/                       # Vitest
capturas/                    # salida de scripts/capturar.mjs (ignorada por git)
```

## Código que se reutiliza de Boxrus
Boxrus (`C:\Proyectos\boxrus`) ya resolvió el recorrido por scroll, el móvil, los viajes, el modo de captura, la luz horneada y los haces. **No se reescribe: se copia y se adapta**, con sus pruebas:
- Tal cual o casi: `azar.ts`, `progreso.ts`, `pausas.ts`, `trayectoria.ts`, `scroll.ts`, `paginado.ts`, `modo.ts`, `haces.ts`, `Logo.astro`, `MenuParadas.astro` (iconos nuevos), `ControladorCamara.tsx`, `Entorno.tsx`, `Postproceso.tsx`, `Depuracion.tsx`, `Exportar.tsx`, `herramientas/blender/*`.
- Adaptando el dominio: `colisiones.ts` (obstáculos del local), `esquemas.ts` (colecciones nuevas), `datos/paradas.ts` (planos de `04`), `index.astro` (secciones y cierre).
- De Billaron: `scripts/capturar.mjs` (cambiando la señal a `data-barberia-lista` y la ruta de `window.barberiaRender`).
- Al copiar, renombrar lo que sea del dominio anterior (`nave` → `barberia`, `naveRender` → `barberiaRender`, `data-nave-lista` → `data-barberia-lista`) y **no** traer nada específico (jaula, sacos, marcador, tatami).

## Fuente única de datos
- `datos/barberia.ts` traduce `03-escena.md` a constantes. La escena **nunca** usa números mágicos sueltos.
- `datos/paradas.ts` traduce `04-recorrido-y-paradas.md`. Lo usan la isla 3D (cámara) y los componentes Astro (interfaz).
- El **contenido** vive en `src/content/` y lo leen tanto las paradas de la landing (resúmenes) como las páginas completas. Es la pieza que se sustituirá con los datos de la barbería real.

## Contenido ficticio
- Realista pero inventado: servicios y precios plausibles en euros, barberos con nombres inventados, horario coherente, dirección y teléfono ficticios (ciudad: pregunta abierta 1). Nunca personas, marcas ni negocios reales.
- **Huecos provisionales** (decisión de Luis) para retratos del equipo y fotos de la galería: componente `Hueco` con proporción fija, fondo neutro, un icono discreto y el texto alternativo previsto; así la maquetación ya es la definitiva y basta con poner la foto real.
- Mapa de `/ubicacion`: OpenStreetMap (Leaflet) **cargado bajo demanda** al pulsar, con atribución; enlace «Cómo llegar» a un servicio de mapas.

## Reservar: demo sin backend
- Página `/reservar` con un formulario en pasos: **servicio → barbero (o «el primero libre») → día → hora → nombre y teléfono → confirmación**.
- Disponibilidad **determinista**: `lib/reservas.ts` genera los huecos libres a partir del horario de `ubicacion`, la duración de cada servicio y el generador con semilla (por día y barbero), así que la demo se ve igual en cada visita y se puede probar.
- Al confirmar: resumen en pantalla y aviso claro de que **es una demostración y no se ha enviado nada**. No se guarda ni se envía ningún dato (ni `localStorage`).
- Diseñada para un servicio real futuro: la página habla con una interfaz `ProveedorReservas` (`disponibilidad`, `reservar`); la demo es una implementación local. Cambiar a un proveedor real será otra implementación, no otra página.
- Script del navegador ligero (TypeScript sin React) que **no** entra en la isla 3D. Accesible: campos etiquetados, errores anunciados, teclado completo.
- La parada 4 de la landing muestra el **próximo hueco libre** calculado con la misma lógica.

## Flujo scroll → cámara → interfaz
1. La landing tiene una **pista** alta (≈ 7 pantallas) con una sección HTML por plano. El canvas va fijo detrás.
2. **Lenis** suaviza el scroll; **ScrollTrigger** convierte la posición en un **progreso global 0–1** y en el plano activo.
3. `lib/progreso.ts` guarda ese estado (sin re-renderizar React en cada scroll; se lee en `useFrame`).
4. El controlador de cámara traduce el progreso a posición y punto de mira, con las zonas de pausa.
5. Las secciones HTML aparecen y desaparecen con ScrollTrigger y CSS.
6. El indicador, la cabecera, la píldora y el logotipo hacen viajes programáticos a cada parada (`crearViajes` de `paginado.ts`).

## Carga y renderizado
- Se muestra de inmediato el **póster** del prólogo (mide el LCP; fase 5).
- La isla 3D se hidrata después (`client:only="react"`) y sustituye al póster con un fundido cuando el primer fotograma está listo.
- Escena y cámara dentro de un `Suspense` que espera a texturas y mapas de luz; la señal `data-barberia-lista` espera además al postproceso.
- Bucle de render detenido sin movimiento, con la pestaña oculta o el canvas fuera de vista.
- Niveles de calidad alto / medio / bajo (`06`).

## Pruebas automáticas
- Las medidas de `datos/barberia.ts` coinciden con `03` (puestos, tarima, lucernario, ventanales).
- La trayectoria no atraviesa ningún obstáculo de `04` y respeta el límite de giro.
- `paradas.ts` tiene los 7 planos con todos los campos (escritorio y móvil).
- Las colecciones validan su esquema; el horario no tiene solapes imposibles.
- La demo de reservas: la disponibilidad es determinista, no ofrece huecos fuera del horario ni solapados, y valida los datos.

## Comandos
- Servidor: `astro dev --background`; `astro dev stop|status|logs`. **La URL real la da `astro dev status`** (en este equipo el 4321 suele estar ocupado).
- Producción local: `npm run build` y `npm run preview`.
- Tipos: `npx astro check`. Pruebas: `npm run test`.
- Capturas: `node scripts/capturar.mjs [planos] [--base=url] [--medir]` (desde la fase 1).

## Despliegue en Vercel
- Salida **estática** de Astro.
- Repositorio: `github.com/luisfdzs/josevila` (**público**). Proyecto de Vercel `josevila` en el equipo `luis-fernandez`, conectado al repositorio. Se crean en la fase 0 con Luis.
- Tres ramas, como Boxrus:

| Rama | Uso | Dónde se ve |
|---|---|---|
| `dev` | Desarrollo diario; rama por defecto | Previsualización con URL propia por cada push (requiere sesión de Vercel) |
| `test` | Versión para revisar, avanzando hasta `dev` | `https://josevilatest.vercel.app` (dominio fijado a la rama) |
| `prod` | Producción; rama de producción de Vercel | `https://josevila.vercel.app` |

- Flujo: `dev` → `test` → `prod` (avance rápido: `git push origin dev:test dev:prod`). Subir a `prod` **publica**: solo con aprobación explícita de Luis en ese momento.
- Salvaguarda (*Ignored Build Step*): se descarta cualquier despliegue de producción que no venga de `prod` (en Boxrus y Billaron el primer push salió como producción). Tras cada push a `test` o `prod`, comprobar el *target* y los alias del despliegue.
- Protección de Vercel activa en previsualizaciones y en `josevilatest`; `josevila.vercel.app`, público.
- `vercel.json`: caché larga para `/_astro/`, `texturas/`, `luz/`, `modelos/`, `basis/`.
- Al ser público, el repo **no** enlaza ni describe la barbería de la referencia (eso vive en la memoria local).
