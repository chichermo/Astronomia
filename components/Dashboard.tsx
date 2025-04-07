'use client';
import { useEffect, useState } from 'react';
import { Loader2, Star, Globe2, SignalHigh, Menu } from 'lucide-react';
import dynamic from 'next/dynamic';
import useSWR from 'swr';
import useSignalAlerts from '@/hooks/useSignalAlerts';

const SkyMap = dynamic(() => import('./SkyMap'), { ssr: false });
const Globe = dynamic(() => import('./Globe'), { ssr: false });

const fetcher = (url: string) => fetch(url).then(res => res.json());

function Dashboard() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  // Cargar datos con SWR
  const { data: noradObjects, error: noradError } = useSWR(
    'https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=json',
    fetcher,
    { refreshInterval: 60000 }
  );
  const { data: satnogsSignals, error: satnogsError } = useSWR(
    '/api/satnogs',
    fetcher,
    { refreshInterval: 60000 }
  );
  const { data: heavensAbove, error: heavensError } = useSWR(
    'https://api.heavens-above.com/VisiblePasses/?lat=0&lng=0&alt=0&tz=UTC',
    fetcher,
    { refreshInterval: 60000 }
  );

  // Persistencia de favoritos
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Detectar anomalías en señales (frecuencia fuera de rango 100-1000 MHz)
  const anomalies = satnogsSignals?.filter(
    (signal: any) => signal.frequency < 100 || signal.frequency > 1000
  ) || [];

  useSignalAlerts(satnogsSignals || []);

  const toggleFavorite = (name: string) => {
    setFavorites(prev =>
      prev.includes(name) ? prev.filter(fav => fav !== name) : [...prev, name]
    );
  };

  // Filtrar objetos NORAD
  const filtered = (noradObjects || [])
    .filter((obj: any) =>
      obj.OBJECT_NAME.toLowerCase().includes(query.toLowerCase())
    )
    .filter(
      (obj: any) => filterType === 'ALL' || obj.OBJECT_TYPE === filterType
    );

  // Manejo de errores
  if (noradError || satnogsError || heavensError) {
    return (
      <div className="min-h-screen bg-[url('/stars.jpg')] bg-cover bg-fixed text-white flex items-center justify-center">
        <div className="text-red-500 text-center">
          Error al cargar datos. Por favor, intenta de nuevo más tarde.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('/stars.jpg')] bg-cover bg-fixed text-white flex relative">
      {/* Fondo animado de estrellas */}
      <div className="stars absolute inset-0 z-0" />
      <aside className="w-64 bg-black/60 backdrop-blur-sm border-r border-gray-800 min-h-screen p-4 hidden md:block">
        <div className="text-xl font-bold mb-6 flex items-center gap-2">
          <Menu className="text-blue-300" /> Navegación
        </div>
        <nav className="space-y-2 text-sm">
          <button
            className="w-full text-left text-blue-100 hover:text-white"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            🌌 Mapa Estelar
          </button>
          <button
            className="w-full text-left text-blue-100 hover:text-white"
            onClick={() =>
              document
                .getElementById('norad')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            🛰️ Objetos NORAD
          </button>
          <button
            className="w-full text-left text-blue-100 hover:text-white"
            onClick={() =>
              document
                .getElementById('satnogs')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            📡 Señales Anómalas
          </button>
          <button
            className="w-full text-left text-blue-100 hover:text-white"
            onClick={() =>
              document
                .getElementById('heavens')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            🌠 Pasos Visibles
          </button>
        </nav>
        <hr className="my-6 border-gray-700" />
        <div className="text-sm text-gray-300">Filtrar por tipo:</div>
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="bg-black border border-gray-600 rounded px-2 py-1 text-sm mt-2 w-full text-white"
        >
          <option value="ALL">Todos</option>
          <option value="PAYLOAD">Satélites</option>
          <option value="ROCKET BODY">Etapas de Cohete</option>
          <option value="DEBRIS">Basura Espacial</option>
        </select>
      </aside>

      <main className="flex-1 p-6 z-10">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2 text-blue-300">
            <Globe2 /> Radar de Anomalías Espaciales
          </h1>
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <input
              type="text"
              placeholder="🔍 Buscar objeto..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="bg-black/70 border border-gray-500 rounded px-3 py-1 text-sm w-64"
            />
            {!noradObjects && !satnogsSignals && !heavensAbove && (
              <Loader2 className="animate-spin text-white" />
            )}
          </div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <SkyMap objects={filtered} />
          <Globe objects={filtered} />
        </section>

        {/* Sección de señales anómalas */}
        <section id="satnogs" className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <SignalHigh /> Señales Anómalas Detectadas
          </h2>
          {anomalies.length > 0 ? (
            <ul className="space-y-2">
              {anomalies.map((signal: any, index: number) => (
                <li key={index} className="bg-red-900/50 p-3 rounded">
                  Señal: {signal.name} | Frecuencia: {signal.frequency} MHz
                </li>
              ))}
            </ul>
          ) : (
            <p>No se detectaron señales anómalas.</p>
          )}
        </section>

        <footer className="mt-16 text-center text-gray-400 text-xs border-t border-gray-700 pt-6">
          &copy; 2025 Radar Espacial Guillermo | Datos: NORAD, SatNOGS,
          Heavens-Above
        </footer>
      </main>
    </div>
  );
}

export default Dashboard;