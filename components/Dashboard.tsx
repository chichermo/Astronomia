
import { useEffect, useState } from 'react';
import { Loader2, Star, Globe2, SignalHigh, Menu } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import useSignalAlerts from '@/hooks/useSignalAlerts';

const SkyMap = dynamic(() => import('./SkyMap'), { ssr: false });
const Globe = dynamic(() => import('./Globe'), { ssr: false });

// ... CONTENIDO COMPLETO DEL DASHBOARD AQUÍ
