
import { useEffect, useRef } from 'react';

export default function useSignalAlerts(signals: any[]) {
  const previousCount = useRef(0);

  useEffect(() => {
    if (signals.length > previousCount.current) {
      const newSignals = signals.length - previousCount.current;
      console.log(`🔔 Se detectaron ${newSignals} señales nuevas`);

      if (Notification.permission === "granted") {
        new Notification("🚨 Nuevas señales detectadas", {
          body: `${newSignals} nuevas señales no identificadas.`,
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            new Notification("🚨 Nuevas señales detectadas", {
              body: `${newSignals} nuevas señales no identificadas.`,
            });
          }
        });
      }
    }

    previousCount.current = signals.length;
  }, [signals]);
}
