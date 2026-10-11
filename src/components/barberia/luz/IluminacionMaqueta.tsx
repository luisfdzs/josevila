import { LUZ } from '../../../datos/luz';

/** Luz neutra de la maqueta en bloques (fase 1): solo para leer volúmenes y encuadres. */
export function IluminacionMaqueta() {
  const { ambiente, hemisferio, puntos, patio } = LUZ.maqueta;
  return (
    <>
      <ambientLight intensity={ambiente} />
      <hemisphereLight args={[hemisferio.cielo, hemisferio.suelo, hemisferio.intensidad]} />
      {puntos.z.map((z) => (
        <pointLight key={z} position={[0, puntos.y, z]} color={puntos.color} intensity={puntos.intensidad} distance={puntos.alcance} />
      ))}
      <directionalLight position={patio.posicion} color={patio.color} intensity={patio.intensidad} />
    </>
  );
}
