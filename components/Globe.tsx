export default function Globe({ objects }: { objects: any[] }) {
  return (
    <div className="bg-gray-800 text-white p-4 rounded shadow">
      <h2>🌍 Visualización en Globo</h2>
      <p>{objects.length} objetos cargados</p>
    </div>
  );
}
