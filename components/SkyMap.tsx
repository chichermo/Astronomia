export default function SkyMap({ objects }: { objects: any[] }) {
  return (
    <div className="border p-4 rounded bg-black text-white">
      <h3>🗺️ SkyMap (en construcción)</h3>
      <p>Objetos mostrados: {objects.length}</p>
    </div>
  );
}
