// hooks/useSignalAlerts.ts
import { useEffect, useRef } from 'react';

export default function useSignalAlerts(signals) {
  const previousIds = useRef(new Set());

  useEffect(() => {
    if (!signals || signals.length === 0) return;

    const currentIds = new Set(signals.map(s => s.id));
    const newIds = [...currentIds].filter(id => !previousIds.current.has(id));

    if (newIds.length > 0) {
      const audio = new Audio('/alert.mp3');
      audio.play();
      alert(`🚨 Nuevas señales detectadas: ${newIds.length}`);
    }

    previousIds.current = currentIds;
  }, [signals]);
}
