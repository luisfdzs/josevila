// Esquemas puros de las colecciones de contenido (docs/05-arquitectura.md).
// Viven fuera de content.config.ts para poder probarlos con Vitest.
import { z } from 'astro/zod';

export const DIAS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'] as const;
export const CATEGORIAS_SERVICIO = ['corte', 'barba', 'afeitado', 'combinado', 'cuidado'] as const;
export const CATEGORIAS_GALERIA = ['clasico', 'degradado', 'texturizado', 'largo', 'barba'] as const;

const hora = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Formato HH:MM');
const fecha = z.iso.date();

export const aMinutos = (hhmm: string): number => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

export const franjaHoraria = <T extends z.ZodRawShape>(forma: T) =>
  z
    .object({ inicio: hora, fin: hora, ...forma })
    // El genérico T impide a TypeScript ver inicio/fin; el objeto los incluye siempre.
    .refine((f) => {
      const { inicio, fin } = f as { inicio: string; fin: string };
      return aMinutos(fin) > aMinutos(inicio);
    }, {
      message: 'La hora de fin debe ser posterior a la de inicio',
      path: ['fin'],
    });

export const esquemaServicio = z.object({
  nombre: z.string().min(1),
  categoria: z.enum(CATEGORIAS_SERVICIO),
  duracionMinutos: z.number().int().positive().multipleOf(5),
  precioEuros: z.number().positive(),
  descripcion: z.string().min(1),
  orden: z.number().int(),
});

// Los retratos son huecos provisionales (docs/09): solo el texto alternativo previsto.
export const esquemaBarbero = z.object({
  nombre: z.string().min(1),
  especialidad: z.string().min(1),
  aniosOficio: z.number().int().min(0).max(60),
  retratoAlt: z.string().min(1),
  orden: z.number().int(),
});

// Cada entrada es un hueco de la galería, a la espera de la foto real.
export const esquemaHuecoGaleria = z.object({
  categoria: z.enum(CATEGORIAS_GALERIA),
  pie: z.string().min(1),
  alt: z.string().min(1),
  orden: z.number().int(),
});

const franjaApertura = franjaHoraria({ dias: z.array(z.enum(DIAS)).min(1) });

const sinSolapes = (franjas: { dias: string[]; inicio: string; fin: string }[]) =>
  DIAS.every((dia) => {
    const delDia = franjas
      .filter((f) => f.dias.includes(dia))
      .map((f) => [aMinutos(f.inicio), aMinutos(f.fin)] as const)
      .sort((a, b) => a[0] - b[0]);
    return delDia.every(([inicio], i) => i === 0 || inicio >= delDia[i - 1][1]);
  });

export const esquemaUbicacion = z.object({
  nombre: z.string().min(1),
  direccion: z.object({
    calle: z.string().min(1),
    codigoPostal: z.string().regex(/^\d{5}$/),
    localidad: z.string().min(1),
    provincia: z.string().min(1),
  }),
  coordenadas: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
  telefono: z.string().min(1),
  email: z.email(),
  apertura: z
    .array(franjaApertura)
    .min(1)
    .refine(sinSolapes, { message: 'Hay franjas de apertura que se solapan el mismo día' }),
});

// Configuración de la demo de reservas (sin backend; docs/05, «Reservar: demo sin backend»).
// `ocupacion` es la fracción de huecos que el generador con semilla marca como ya reservados.
export const esquemaReservas = z.object({
  intervaloMinutos: z.number().int().positive().multipleOf(5),
  antelacionMinimaHoras: z.number().int().min(0),
  diasVisibles: z.number().int().min(1).max(60),
  ocupacion: z.number().min(0).max(1),
  semilla: z.number().int(),
  festivos: z.array(fecha).default([]),
});
