import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import {
  esquemaBarbero,
  esquemaHuecoGaleria,
  esquemaReservas,
  esquemaServicio,
  esquemaUbicacion,
} from './lib/esquemas';

// Colecciones vacías hasta la fase 4 (contenido ficticio, docs/05).
const servicios = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/servicios' }),
  schema: esquemaServicio,
});

const equipo = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/equipo' }),
  schema: esquemaBarbero,
});

const galeria = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml,json}', base: './src/content/galeria' }),
  schema: esquemaHuecoGaleria,
});

const ubicacion = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/ubicacion' }),
  schema: esquemaUbicacion,
});

const reservas = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/reservas' }),
  schema: esquemaReservas,
});

export const collections = { servicios, equipo, galeria, ubicacion, reservas };
