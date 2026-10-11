import { useFrame, useThree } from '@react-three/fiber';
import { useMemo } from 'react';
import { PerspectiveCamera, Vector3 } from 'three';
import { RECORRIDO } from '../../../datos/paradas';
import { leerModo } from '../../../lib/modo';
import { progreso } from '../../../lib/progreso';
import { crearTrayectoria, focalAFov, type Pose, type Variante } from '../../../lib/trayectoria';

export const varianteParaAspecto = (aspecto: number): Variante => (aspecto < RECORRIDO.aspectoMovil ? 'movil' : 'escritorio');

/**
 * Descentramiento vertical del objetivo: desplaza la ventana de proyección una
 * fracción `d` de la altura del cuadro (la imagen sube con `d` > 0) sin girar la
 * cámara. En unidades relativas (cuadro de `aspect` × 1, porque `setViewOffset`
 * fija el aspecto a ancho/alto) no depende del tamaño del lienzo, y Three.js lo
 * conserva cuando React Three Fiber recalcula el aspecto al redimensionar.
 */
function fijarDesplazamiento(camara: PerspectiveCamera, d: number) {
  if (Math.abs(d) < 1e-4) {
    if (camara.view?.enabled) camara.clearViewOffset();
  } else camara.setViewOffset(camara.aspect, 1, 0, d, camara.aspect, 1);
}

/** Coloca la cámara según el progreso del scroll, leído en cada fotograma. */
export function ControladorCamara({ alPrimerFotograma }: { alPrimerFotograma?: () => void }) {
  const camara = useThree((s) => s.camera) as PerspectiveCamera;
  const aspecto = useThree((s) => s.size.width / s.size.height);
  const variante = varianteParaAspecto(aspecto);
  const trayectoria = useMemo(() => crearTrayectoria(variante), [variante]);
  const pose = useMemo<Pose>(() => ({ posicion: new Vector3(), mira: new Vector3(), fov: 50, desplazamiento: 0 }), []);
  const estado = useMemo(() => ({ fotogramas: 0, desplazamiento: 0 }), []);
  // ?camara=…: encuadre fijo (para ajustar planos) en lugar del recorrido.
  const fija = useMemo(() => leerModo().camara, []);

  useFrame(() => {
    if (fija) {
      pose.posicion.set(...fija.posicion);
      pose.mira.set(...fija.mira);
      pose.fov = focalAFov(fija.focal);
      pose.desplazamiento = 0;
    } else trayectoria.evaluar(progreso.valor, pose);
    camara.position.copy(pose.posicion);
    camara.lookAt(pose.mira);
    const cambiaFov = Math.abs(camara.fov - pose.fov) > 1e-3;
    const cambiaDesplazamiento = Math.abs(estado.desplazamiento - pose.desplazamiento) > 1e-4;
    if (cambiaFov || cambiaDesplazamiento) {
      camara.fov = pose.fov;
      estado.desplazamiento = pose.desplazamiento;
      fijarDesplazamiento(camara, pose.desplazamiento);
      camara.updateProjectionMatrix();
    }
    if (++estado.fotogramas === 3) alPrimerFotograma?.();
  });

  return null;
}
