
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import GlobeGL from 'react-globe.gl';

export default function Globe({ objects }: { objects: any[] }) {
  const [globeEl, setGlobeEl] = useState<any>(null);
  const [points, setPoints] = useState([]);

  useEffect(() => {
    if (!objects || objects.length === 0) return;
    const formatted = objects.map(obj => ({
      lat: Math.random() * 180 - 90,
      lng: Math.random() * 360 - 180,
      size: 0.6,
      color: 'rgba(0,255,255,0.8)',
      name: obj.OBJECT_NAME
    }));
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
