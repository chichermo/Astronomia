'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import satellite from 'satellite.js';

const GlobeGL = dynamic(() => import('react-globe.gl'), { ssr: false });

export default function Globe({ objects }: { objects: any[] }) {
  const [globeEl, setGlobeEl] = useState<any>(null);
  const [points, setPoints] = useState([]);

  useEffect(() => {
    if (!objects || objects.length === 0) return;

    const formatted = objects.map(obj => {
      try {
        // Usar datos TLE para calcular la posición
        const satrec = satellite.twoline2satrec(obj.TLE_LINE1, obj.TLE_LINE2);
        const positionAndVelocity = satellite.propagate(satrec, new Date());
        const positionEci = positionAndVelocity.position;

        if (!positionEci) {
          throw new Error('No se pudo calcular la posición');
        }

        const gmst = satellite.gstime(new Date());
        const positionGd = satellite.eciToGeodetic(positionEci, gmst);

        return {
          lat: satellite.degreesLat(positionGd.latitude),
          lng: satellite.degreesLong(positionGd.longitude),
          size: 0.6,
          color: 'rgba(0,255,255,0.8)',
          name: obj.OBJECT_NAME,
        };
      } catch (error) {
        console.error(`Error calculando posición para ${obj.OBJECT_NAME}:`, error);
        // Posición por defecto si falla el cálculo
        return {
          lat: 0,
          lng: 0,
          size: 0.6,
          color: 'rgba(255,0,0,0.8)', // Color rojo para indicar error
          name: obj.OBJECT_NAME,
        };
      }
    });
    setPoints(formatted);
  }, [objects]);

  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden bg-black/80 border border-gray-700 p-2">
      <GlobeGL
        ref={setGlobeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        pointsData={points}
        pointAltitude="size"
        pointColor="color"
        pointLabel="name"
        width={600}
        height={500}
        atmosphereColor="blue"
        atmosphereAltitude={0.1}
        showAtmosphere={true}
        animateIn={true}
      />
    </div>
  );
}