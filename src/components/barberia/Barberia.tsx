import { Canvas } from '@react-three/fiber';
import { Suspense, lazy, useCallback, useRef } from 'react';
import { AgXToneMapping } from 'three';
import { LUZ } from '../../datos/luz';
import { leerModo } from '../../lib/modo';
import { ControladorCamara } from './camara/ControladorCamara';
import { Envolvente } from './escena/Envolvente';
import { Escaparate } from './escena/Escaparate';
import { Fondo } from './escena/Fondo';
import { Galeria } from './escena/Galeria';
import { Puestos } from './escena/Puestos';
import { Recepcion } from './escena/Recepcion';
import { SillonProtagonista } from './escena/SillonProtagonista';
import { Sillones } from './escena/Sillones';
import { Techo } from './escena/Techo';
import { IluminacionMaqueta } from './luz/IluminacionMaqueta';

const Depuracion = lazy(() => import('./depuracion/Depuracion').then((m) => ({ default: m.Depuracion })));

/** Isla 3D: la barbería, su luz y la cámara del recorrido. */
export default function Barberia() {
  const modo = leerModo();
  // Señal para las capturas: la cámara ya está colocada y hay fotogramas pintados.
  // (En la fase 3 esperará también al postproceso, que llegará en su trozo diferido.)
  const pendientes = useRef(new Set(['camara']));
  const marcar = useCallback((pieza: string) => {
    pendientes.current.delete(pieza);
    if (!pendientes.current.size) document.documentElement.dataset.barberiaLista = 'si';
  }, []);
  const camaraLista = useCallback(() => marcar('camara'), [marcar]);

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ near: 0.05, far: 80, fov: 50 }}
      gl={{ antialias: true, preserveDrawingBuffer: modo.captura, toneMapping: AgXToneMapping, toneMappingExposure: LUZ.exposicion }}
      aria-hidden="true"
    >
      <color attach="background" args={[LUZ.fondo]} />
      <Suspense fallback={null}>
        <IluminacionMaqueta />
        <Envolvente />
        <Techo />
        <Escaparate />
        <Recepcion animar={!modo.captura} />
        <Puestos />
        <Sillones />
        <Fondo />
        <Galeria />
        <SillonProtagonista />
        <ControladorCamara alPrimerFotograma={camaraLista} />
      </Suspense>
      {modo.depuracion && (
        <Suspense fallback={null}>
          <Depuracion />
        </Suspense>
      )}
    </Canvas>
  );
}
