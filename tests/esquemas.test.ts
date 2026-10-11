import { describe, expect, it } from 'vitest';
import {
  esquemaBarbero,
  esquemaHuecoGaleria,
  esquemaReservas,
  esquemaServicio,
  esquemaUbicacion,
} from '../src/lib/esquemas';

describe('esquemas de contenido', () => {
  it('acepta un servicio válido y rechaza precios o duraciones imposibles', () => {
    const servicio = {
      nombre: 'Corte clásico',
      categoria: 'corte',
      duracionMinutos: 30,
      precioEuros: 22,
      descripcion: 'Corte a tijera y máquina con acabado a navaja.',
      orden: 1,
    };
    expect(esquemaServicio.safeParse(servicio).success).toBe(true);
    expect(esquemaServicio.safeParse({ ...servicio, precioEuros: 0 }).success).toBe(false);
    expect(esquemaServicio.safeParse({ ...servicio, duracionMinutos: 32 }).success).toBe(false);
    expect(esquemaServicio.safeParse({ ...servicio, categoria: 'tinte' }).success).toBe(false);
  });

  it('exige el texto alternativo del retrato provisional de cada barbero', () => {
    const barbero = { nombre: 'Andrés Lucena', especialidad: 'Afeitado a navaja', aniosOficio: 12, retratoAlt: 'Retrato de Andrés Lucena', orden: 1 };
    expect(esquemaBarbero.safeParse(barbero).success).toBe(true);
    expect(esquemaBarbero.safeParse({ ...barbero, retratoAlt: '' }).success).toBe(false);
  });

  it('valida la categoría y el texto alternativo de cada hueco de la galería', () => {
    const hueco = { categoria: 'degradado', pie: 'Degradado bajo con raya', alt: 'Corte degradado bajo visto de perfil', orden: 1 };
    expect(esquemaHuecoGaleria.safeParse(hueco).success).toBe(true);
    expect(esquemaHuecoGaleria.safeParse({ ...hueco, alt: '' }).success).toBe(false);
    expect(esquemaHuecoGaleria.safeParse({ ...hueco, categoria: 'otro' }).success).toBe(false);
  });

  describe('ubicación', () => {
    const ubicacion = {
      nombre: 'José Vila',
      direccion: { calle: 'Calle Ficticia 1', codigoPostal: '00000', localidad: 'Villaficticia', provincia: 'Ficticia' },
      coordenadas: { lat: 40, lng: -3 },
      telefono: '900 000 000',
      email: 'hola@josevila.example',
      apertura: [
        { dias: ['martes', 'miercoles', 'jueves', 'viernes'], inicio: '10:00', fin: '14:00' },
        { dias: ['martes', 'miercoles', 'jueves', 'viernes'], inicio: '16:30', fin: '20:30' },
        { dias: ['sabado'], inicio: '09:30', fin: '14:30' },
      ],
    };

    it('acepta un horario partido coherente', () => {
      expect(esquemaUbicacion.safeParse(ubicacion).success).toBe(true);
    });

    it('rechaza franjas que acaban antes de empezar o con hora mal escrita', () => {
      const conFranja = (franja: object) => ({ ...ubicacion, apertura: [franja] });
      expect(esquemaUbicacion.safeParse(conFranja({ dias: ['lunes'], inicio: '20:00', fin: '19:00' })).success).toBe(false);
      expect(esquemaUbicacion.safeParse(conFranja({ dias: ['lunes'], inicio: '9:00', fin: '14:00' })).success).toBe(false);
    });

    it('rechaza franjas que se solapan el mismo día, pero no en días distintos', () => {
      const solape = { dias: ['viernes'], inicio: '13:00', fin: '15:00' };
      expect(esquemaUbicacion.safeParse({ ...ubicacion, apertura: [...ubicacion.apertura, solape] }).success).toBe(false);

      const otroDia = { dias: ['lunes'], inicio: '13:00', fin: '15:00' };
      expect(esquemaUbicacion.safeParse({ ...ubicacion, apertura: [...ubicacion.apertura, otroDia] }).success).toBe(true);
    });

    it('rechaza un correo o un código postal mal escritos', () => {
      expect(esquemaUbicacion.safeParse({ ...ubicacion, email: 'no-es-email' }).success).toBe(false);
      expect(esquemaUbicacion.safeParse({ ...ubicacion, direccion: { ...ubicacion.direccion, codigoPostal: '123' } }).success).toBe(false);
    });
  });

  it('valida la configuración de la demo de reservas', () => {
    const reservas = { intervaloMinutos: 15, antelacionMinimaHoras: 2, diasVisibles: 14, ocupacion: 0.6, semilla: 7, festivos: ['2026-12-25'] };
    expect(esquemaReservas.safeParse(reservas).success).toBe(true);
    expect(esquemaReservas.parse({ ...reservas, festivos: undefined }).festivos).toEqual([]);
    expect(esquemaReservas.safeParse({ ...reservas, ocupacion: 1.5 }).success).toBe(false);
    expect(esquemaReservas.safeParse({ ...reservas, festivos: ['25/12/2026'] }).success).toBe(false);
  });
});
