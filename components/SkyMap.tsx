'use client';
import { useEffect } from 'react';

export default function SkyMap({ objects }: { objects: any[] }) {
  useEffect(() => {
    const canvas = document.getElementById('skyCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fondo negro
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar objetos como "estrellas"
    objects.forEach(obj => {
      const x = Math.random() * canvas.width; // Sustituir por posición real si tienes datos
      const y = Math.random() * canvas.height;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
      // Etiqueta con el nombre del objeto
      ctx.font = '10px Arial';
      ctx.fillText(obj.OBJECT_NAME, x + 15, y);
    });
  }, [objects]);

  return (
    <div className="bg-black text-white p-4 rounded shadow">
      <h2>🗺️ SkyMap</h2>
      <canvas
        id="skyCanvas"
        width="600"
        height="400"
        className="border border-gray-700"
      />
      <p>{objects.length} objetos en el mapa</p>
    </div>
  );
}