# 01 · Visión

## Qué es José Vila
José Vila es una **barbería ficticia** de corte, barba y afeitado clásico, en un local alargado a pie de calle. Este proyecto es **de práctica**, como Boxrus: sirve para dominar la técnica antes de hacer, en el futuro, la web de una barbería real. Por eso:
- el contenido (servicios, precios, equipo, horario, dirección) es **ficticio** pero realista;
- la estructura se diseña para que, con una barbería real, baste con **cambiar el contenido**, no el código.

## Objetivo de la landing
Que la primera visita sea una **experiencia cinematográfica**: al hacer scroll, la cámara recorre la barbería vacía y se detiene en 5 puntos. Cada punto es una sección de la web:

1. Servicios (y precios)
2. Equipo (los barberos)
3. Galería (de cortes)
4. Reservar (cita)
5. Ubicación (y horario)

El recorrido es el menú.

## Sensación buscada
- **Lujo urbano y preciso**: negro mate, luz blanca limpia, suelo de piedra negra pulida que lo refleja todo, detalles en latón. Una barbería cuidada al milímetro, no un decorado.
- **Luz protagonista, también la natural**: la retícula de luz del techo marca el ritmo de los puestos, y la luz del día entra por el escaparate y, sobre todo, por el patio y el lucernario del fondo, con haces que cruzan el aire y caen sobre el sillón protagonista.
- **Oficio**: guiños clásicos (el poste de barbero, el sillón de toda la vida, la navaja y la brocha) dentro de un espacio moderno.
- **Calma antes de abrir**: la barbería vacía, ordenada, a punto de recibir al primer cliente.
- Agradable de usar: fluida, reversible, sin mareos ni esperas.

## Principios de experiencia
- **Salida siempre visible**: accesos directos a las 5 secciones y botón «Saltar recorrido» desde el primer segundo.
- **El contenido importante vive en HTML real**, no dentro del canvas (SEO y accesibilidad). Para una barbería es crítico: servicios, precios, horario, dirección y teléfono deben poder encontrarse en Google y leerse en cualquier dispositivo.
- **Funciona sin 3D**: versión estática equivalente si no hay WebGL, el dispositivo es modesto o el usuario prefiere menos movimiento.
- **Reservar está a un toque** en todo momento: es la acción principal del negocio.

## Alcance
**Dentro:**
- Landing 3D en tiempo real con recorrido por scroll: prólogo, 5 paradas y epílogo.
- Interfaz superpuesta de cada parada, navegación (cabecera en escritorio, píldora en móvil), indicador de progreso.
- Páginas de las 5 secciones (`/servicios`, `/equipo`, `/galeria`, `/reservar`, `/ubicacion`) con **contenido ficticio editable** (colecciones de contenido de Astro).
- **Reservar como demo sin backend**: elegir servicio, barbero, día y hora, con confirmación simulada en el navegador. No se envía ni se guarda nada. Preparada para conectar más adelante un servicio de reservas real.
- **Huecos provisionales** para todo lo que serían fotos de personas (retratos del equipo, cortes de la galería), a la espera de fotos reales de una barbería futura.
- Versión estática alternativa, rendimiento, accesibilidad, SEO local y despliegue en Vercel.

**Fuera:**
- Reservas reales, pagos, cuentas de cliente, formularios con backend, avisos por correo o SMS.
- Fotos de personas (reales o generadas) y contenido real de una barbería (llegará en el proyecto futuro).

## Restricciones fijadas
- Idioma: **solo español**.
- Alojamiento: **Vercel**. Repositorio **público** en GitHub.
- Marca: **José Vila** (solo el nombre; «barbería» como descriptor en textos y SEO).
- Técnica: **escena 3D en tiempo real** con el mismo stack que Billaron y Boxrus.
- **Barbería vacía**: sin personas en la escena.
- La referencia visual (un vídeo de una barbería real) es **inspiración libre**: identidad propia, con cambios notables (ver `02`).
