
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: 'Calculadora de Presupuesto Viajero | Eventos Deportivos',
  description: 'Calcula tu presupuesto diario para viajes internacionales a eventos deportivos. Descubre cómo ahorrar más y maximizar tu experiencia de viaje.',
  keywords: [
    'presupuesto viaje',
    'calculadora viaje',
    'eventos deportivos',
    'viajes internacionales',
    'ahorro viaje',
    'costo por día'
  ],
  authors: [{ name: 'Presupuesto Viajero' }],
  openGraph: {
    title: 'Calculadora de Presupuesto Viajero | Eventos Deportivos',
    description: 'Calcula tu presupuesto diario para viajes internacionales a eventos deportivos',
    type: 'website',
    locale: 'es_ES',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#00CF0C',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} scroll-smooth`}>
      <body className={`${inter.className} antialiased bg-white text-gray-900`}>
        <main className="relative min-h-screen">
          {children}
        </main>
        
        <Toaster 
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              fontFamily: 'var(--font-inter)',
            }
          }}
        />
      </body>
    </html>
  );
}
