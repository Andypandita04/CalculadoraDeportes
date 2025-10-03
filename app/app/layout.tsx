
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: 'Calculadora de Presupuesto de Viajes',
  description: 'Calcula cuánto dinero necesitarás en tu viaje y descubre los beneficios de ahorrar inteligentemente',
  keywords: ['viajes', 'presupuesto', 'ahorro', 'calculadora', 'intercambio'],
  authors: [{ name: 'Calculadora Viajes' }],
  robots: 'index, follow'
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className={`${inter.className} font-sans antialiased`}>
        <main className="min-h-screen bg-white">
          {children}
        </main>
      </body>
    </html>
  );
}
