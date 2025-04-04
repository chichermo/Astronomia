
import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

const SkyMap = dynamic(() => import('@/components/SkyMap'), { ssr: false });
const Globe = dynamic(() => import('@/components/Globe'), { ssr: false });

export default function Dashboard() {
  const [noradObjects, setNoradObjects] = useState([]);
  const [satnogsSignals, setSatnogsSignals] = useState([]);
  const [heavensAbove, setHeavensAbove] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

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

  const filtered = noradObjects.filter(obj => obj.OBJECT_NAME.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">🌌 Radar de Anomalías Espaciales</h1>
      <p className="text-sm text-muted-foreground">Monitoreo en tiempo real de objetos espaciales, trayectorias y anomalías orbitales. Datos desde NORAD, Heavens-Above, SatNOGS y más.</p>

      <div className="flex items-center gap-2">
        <Input placeholder="🔍 Buscar objeto..." value={query} onChange={e => setQuery(e.target.value)} />
        {loading && <Loader2 className="animate-spin" />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SkyMap objects={filtered} />
        <Globe objects={filtered} />
      </div>

      <h2 className="text-xl font-semibold mt-6">🛰️ Objetos Activos (NORAD)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((obj, idx) => (
          <Card key={idx}>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg">🛰️ {obj.OBJECT_NAME}</h3>
              <p className="text-sm text-muted-foreground">NORAD ID: {obj.NORAD_CAT_ID}</p>
              <p className="text-sm">Tipo: {obj.OBJECT_TYPE}</p>
              <p className="text-sm">Órbita: {obj.MEAN_MOTION} rev/día</p>
              <p className="text-sm">Inclinación: {obj.INCLINATION}°</p>
              <p className="text-sm">Eccentricidad: {obj.ECCENTRICITY}</p>
              <Button variant="outline" className="mt-2 w-full">📊 Ver trayectoria</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-6">📡 Señales Anómalas (SatNOGS)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {satnogsSignals.map((signal, idx) => (
          <Card key={idx}>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg">📡 Señal #{signal.id}</h3>
              <p className="text-sm">Frecuencia: {signal.freq}</p>
              <p className="text-sm">Estación: {signal.station_id}</p>
              <p className="text-sm">Inicio: {signal.start}</p>
              <p className="text-sm">Duración: {signal.duration}s</p>
              <Button variant="outline" className="mt-2 w-full">🔍 Ver análisis</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-6">🌠 Pasos Visibles (Heavens-Above)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {heavensAbove.map((pass, idx) => (
          <Card key={idx}>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg">🌠 {pass.name}</h3>
              <p className="text-sm">Comienzo: {pass.startUTC}</p>
              <p className="text-sm">Altitud máx: {pass.maxAltitude}</p>
              <p className="text-sm">Magnitud: {pass.magnitude}</p>
              <Button variant="outline" className="mt-2 w-full">🕒 Ver detalles</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
