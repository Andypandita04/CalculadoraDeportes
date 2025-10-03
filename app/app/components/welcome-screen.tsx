
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, Plane } from 'lucide-react';

export function WelcomeScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGetStarted = async () => {
    setIsLoading(true);
    // Pequeña animación de carga para mejorar UX
    await new Promise(resolve => setTimeout(resolve, 300));
    router.push('/trip-form');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-hidden relative">
      {/* Fondo con imagen de la Tierra y aviones */}
      <div className="absolute inset-0">
        <div className="relative w-full h-full">
          <Image
            src="https://cdn.abacus.ai/images/4736b22c-e61b-434d-b4eb-824aa1ed7baa.png"
            alt="Planeta Tierra con aviones volando alrededor"
            fill
            className="object-cover object-center opacity-20"
            priority
            sizes="100vw"
          />
          {/* Overlay gradiente para mejor legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/60 to-transparent" />
        </div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 container-app min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-12">
          
          {/* Columna izquierda - Contenido principal (~50%) */}
          <div className="space-y-8 fade-in lg:pr-8">
            <div className="space-y-6">
              {/* Título principal con la palabra "viaje" en verde */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Calcula aquí cuánto dinero necesitarás en tu{' '}
                <span className="text-primary-dark">viaje</span>
              </h1>

              {/* Subtítulo descriptivo */}
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl">
                Planifica tu presupuesto de viaje de manera inteligente y descubre cómo ahorrar más con beneficios exclusivos.
              </p>

              {/* Características clave */}
              <div className="space-y-3 text-gray-700">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                  <span>Cálculos precisos basados en datos reales</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                  <span>Beneficios de ahorro personalizados</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                  <span>Plan de ahorro optimizado para tu viaje</span>
                </div>
              </div>
            </div>

            {/* Botón principal */}
            <div className="space-y-4">
              <button
                onClick={handleGetStarted}
                disabled={isLoading}
                className={`
                  btn-primary text-xl px-8 py-4 flex items-center space-x-3 group
                  ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'}
                  transform transition-all duration-300
                `}
                aria-label="Comenzar calculadora de presupuesto"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                    <span>Cargando...</span>
                  </>
                ) : (
                  <>
                    <Plane className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                    <span>Comenzar</span>
                    <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </button>

              <p className="text-sm text-gray-500">
                ✨ Completamente gratis • 📊 Resultados en 3 minutos
              </p>
            </div>

            {/* Stats destacados */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">58+</div>
                <div className="text-sm text-gray-600">Destinos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">14</div>
                <div className="text-sm text-gray-600">Monedas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">4</div>
                <div className="text-sm text-gray-600">Beneficios</div>
              </div>
            </div>
          </div>

          {/* Columna derecha - Espacio para la imagen de fondo (visible en desktop) */}
          <div className="hidden lg:block">
            {/* Este espacio permite que la imagen de fondo sea más prominente */}
            <div className="relative">
              {/* Elemento decorativo opcional */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-xl" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-green-200/30 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Elementos decorativos flotantes */}
      <div className="absolute top-20 right-20 w-4 h-4 bg-primary rounded-full" />
      <div className="absolute bottom-40 left-20 w-3 h-3 bg-green-400 rounded-full" />
      <div className="absolute top-1/2 right-10 w-5 h-5 bg-blue-400/60 rounded-full" />
    </div>
  );
}
