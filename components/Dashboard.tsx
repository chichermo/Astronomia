import { useEffect, useState } from 'react';
import { Loader2, Star, Globe2, SignalHigh } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const SkyMap = dynamic(() => import('./SkyMap'), { ssr: false });
const Globe = dynamic(() => import('./Globe'), { ssr: false });

export default function Dashboard() {
  const [noradObjects, setNoradObjects] = useState([]);
  const [satnogsSignals, setSatnogsSignals] = useState([]);
  const [heavensAbove, setHeavensAbove] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const noradRes = await fetch("https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=json");
      const noradData = await noradRes.json();
      setNoradObjects(noradData);

      const satnogsRes = await fetch("https://db.satnogs.org/api/signals/?status=UNIDENTIFIED&format=json");
      const satnogsData = await satnogsRes.json();
      setSatnogsSignals(satnogsData);

      const heavensRes = await fetch("https://api.heavens-above.com/VisiblePasses/?lat=0&lng=0&alt=0&tz=UTC");
      const heavensData = await heavensRes.json();
      setHeavensAbove(heavensData);

      setLoading(false);
    }
    fetchData();
  }, []);

  const toggleFavorite = (name: string) => {
    setFavorites(prev => prev.includes(name) ? prev.filter(fav => fav !== name) : [...prev, name]);
  };

  const filtered = noradObjects.filter(obj => obj.OBJECT_NAME.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <Globe2 className="text-blue-400" /> Radar de Anomalías Espaciales
        </h1>
        <div className="flex items-center gap-2">
          <input type="text" placeholder="🔍 Buscar objeto..." value={query} onChange={e => setQuery(e.target.value)} className="bg-black border border-gray-600 rounded px-3 py-1 text-sm w-64" />
          {loading && <Loader2 className="animate-spin" />}
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <SkyMap objects={filtered} />
        <Globe objects={filtered} />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">🛰️ Objetos Activos (NORAD)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((obj, idx) => (
            <div key={idx} className="bg-gray-800 p-4 rounded-xl shadow-lg border border-blue-900">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">🛰️ {obj.OBJECT_NAME}</h3>
                <button onClick={() => toggleFavorite(obj.OBJECT_NAME)} title="Favorito" className="text-yellow-400 hover:text-yellow-200">
                  <Star fill={favorites.includes(obj.OBJECT_NAME) ? 'currentColor' : 'none'} />
                </button>
              </div>
              <p className="text-sm text-gray-400">NORAD ID: {obj.NORAD_CAT_ID}</p>
              <p className="text-sm">Tipo: {obj.OBJECT_TYPE}</p>
              <p className="text-sm">Órbita: {obj.MEAN_MOTION} rev/día</p>
              <p className="text-sm">Inclinación: {obj.INCLINATION}°</p>
              <p className="text-sm">Eccentricidad: {obj.ECCENTRICITY}</p>
              <button className="mt-2 w-full bg-blue-700 hover:bg-blue-600 text-white py-1 px-2 rounded">📊 Ver trayectoria</button>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">📡 Señales Anómalas (SatNOGS)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {satnogsSignals.map((signal, idx) => (
            <div key={idx} className="bg-gray-800 p-4 rounded-xl shadow-lg border border-purple-800">
              <div className="flex items-center gap-2 mb-2 text-purple-400">
                <SignalHigh />
                <h3 className="font-semibold">Señal #{signal.id}</h3>
              </div>
              <p className="text-sm">Frecuencia: {signal.freq}</p>
              <p className="text-sm">Estación: {signal.station_id}</p>
              <p className="text-sm">Inicio: {signal.start}</p>
              <p className="text-sm">Duración: {signal.duration}s</p>
              <button className="mt-2 w-full bg-purple-700 hover:bg-purple-600 text-white py-1 px-2 rounded">🔍 Ver análisis</button>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">🌠 Pasos Visibles (Heavens-Above)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {heavensAbove.map((pass, idx) => (
            <div key={idx} className="bg-gray-800 p-4 rounded-xl shadow-lg border border-indigo-800">
              <h3 className="font-semibold text-lg text-indigo-400">🌠 {pass.name}</h3>
              <p className="text-sm">Comienzo: {pass.startUTC}</p>
              <p className="text-sm">Altitud máx: {pass.maxAltitude}</p>
              <p className="text-sm">Magnitud: {pass.magnitude}</p>
              <button className="mt-2 w-full bg-indigo-700 hover:bg-indigo-600 text-white py-1 px-2 rounded">🕒 Ver detalles</button>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-16 text-center text-gray-500 text-sm border-t border-gray-800 pt-6">
        &copy; 2025 Radar Espacial Guillermo. Todos los datos provienen de fuentes abiertas (NORAD, SatNOGS, Heavens-Above).
      </footer>
    </div>
  );
}
