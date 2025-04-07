import { useEffect, useState } from 'react';
import { Loader2, Star, Globe2, SignalHigh, Menu } from 'lucide-react';
import dynamic from 'next/dynamic';
import useSignalAlerts from '@/hooks/useSignalAlerts';

const SkyMap = dynamic(() => import('./SkyMap'), { ssr: false });
const Globe = dynamic(() => import('./Globe'), { ssr: false });

export default function Dashboard() {
  const [noradObjects, setNoradObjects] = useState([]);
  const [satnogsSignals, setSatnogsSignals] = useState([]);
  const [heavensAbove, setHeavensAbove] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filterType, setFilterType] = useState('ALL');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const noradRes = await fetch("https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=json");
        const noradData = await noradRes.json();
        setNoradObjects(noradData);

        const satnogsRes = await fetch("/api/satnogs");
        const satnogsData = await satnogsRes.json();
        setSatnogsSignals(satnogsData);

        const heavensRes = await fetch("https://api.heavens-above.com/VisiblePasses/?lat=0&lng=0&alt=0&tz=UTC");
        const heavensData = await heavensRes.json();
        setHeavensAbove(heavensData);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useSignalAlerts(satnogsSignals);

  const toggleFavorite = (name: string) => {
    setFavorites(prev => prev.includes(name) ? prev.filter(fav => fav !== name) : [...prev, name]);
  };

  const filtered = noradObjects
    .filter(obj => obj.OBJECT_NAME.toLowerCase().includes(query.toLowerCase()))
    .filter(obj => filterType === 'ALL' || obj.OBJECT_TYPE === filterType);

  return (
    <div className="min-h-screen bg-[url('/stars.jpg')] bg-cover bg-fixed text-white flex">
      <aside className="w-64 bg-black/60 backdrop-blur-sm border-r border-gray-800 min-h-screen p-4 hidden md:block">
        <div className="text-xl font-bold mb-6 flex items-center gap-2">
          <Menu className="text-blue-300" /> Navegación
        </div>
        <nav className="space-y-2 text-sm">
          <button className="w-full text-left text-blue-100 hover:text-white" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>🌌 Mapa Estelar</button>
          <button className="w-full text-left text-blue-100 hover:text-white" onClick={() => document.getElementById('norad')?.scrollIntoView({ behavior: 'smooth' })}>🛰️ Objetos NORAD</button>
          <button className="w-full text-left text-blue-100 hover:text-white" onClick={() => document.getElementById('satnogs')?.scrollIntoView({ behavior: 'smooth' })}>📡 Señales Anómalas</button>
          <button className="w-full text-left text-blue-100 hover:text-white" onClick={() => document.getElementById('heavens')?.scrollIntoView({ behavior: 'smooth' })}>🌠 Pasos Visibles</button>
        </nav>
        <hr className="my-6 border-gray-700" />
        <div className="text-sm text-gray-300">Filtrar por tipo:</div>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="bg-black border border-gray-600 rounded px-2 py-1 text-sm mt-2 w-full text-white">
          <option value="ALL">Todos</option>
          <option value="PAYLOAD">Satélites</option>
          <option value="ROCKET BODY">Etapas de Cohete</option>
          <option value="DEBRIS">Basura Espacial</option>
        </select>
      </aside>

      <main className="flex-1 p-6">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2 text-blue-300">
            <Globe2 /> Radar de Anomalías Espaciales
          </h1>
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <input type="text" placeholder="🔍 Buscar objeto..." value={query} onChange={e => setQuery(e.target.value)} className="bg-black/70 border border-gray-500 rounded px-3 py-1 text-sm w-64" />
            {loading && <Loader2 className="animate-spin text-white" />}
          </div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <SkyMap objects={filtered} />
          <Globe objects={filtered} />
        </section>

        <footer className="mt-16 text-center text-gray-400 text-xs border-t border-gray-700 pt-6">
          &copy; 2025 Radar Espacial Guillermo | Datos: NORAD, SatNOGS, Heavens-Above
        </footer>
      </main>
    </div>
  );
}
