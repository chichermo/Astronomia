export default function SkyMap({ objects }: { objects: any[] }) {
  return (
    <div className="bg-black text-white p-4 rounded shadow">
      <h2>🗺️ SkyMap</h2>
      <p>{objects.length} objetos en el mapa</p>
    </div>
  );
}
