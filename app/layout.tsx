export const metadata = {
  title: 'Radar de Anomalías Espaciales',
  description: 'Monitoreo de objetos y señales en el espacio en tiempo real.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}