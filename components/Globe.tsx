export default function Globe({ objects }: { objects: any[] }) {
  return (
    <div className="border p-4 rounded bg-gray-800 text-white">
      <h3>🌍 Visualización en Globo (en construcción)</h3>
      <p>Objetos mostrados: {objects.length}</p>
    </div>
  );
}
