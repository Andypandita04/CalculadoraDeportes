
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export function QuickSelectScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);



  const handleContinue = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    router.push('/trip-form');
  };

  const handleGoBack = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 overflow-hidden relative">
      {/* Fondo con imagen de viajes/dinero */}
      <div className="absolute inset-0">
        <div className="relative w-full h-full">
          <Image
            src="https://cdn.abacus.ai/images/ed1ba010-60c0-4ad5-877a-13759a6ae094.png"
            alt="Fondo de viajes y presupuesto"
            fill
            className="object-cover object-center opacity-15"
            sizes="100vw"
          />
          {/* Overlay gradiente */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-white/90" />
        </div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 container-app">
        <div className="min-h-screen flex flex-col justify-center py-12">
          
          {/* Header con botón de regreso */}
          <div className="absolute top-6 left-6">
            <button
              onClick={handleGoBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors duration-200 p-2 rounded-lg hover:bg-white/50"
              aria-label="Regresar a la pantalla anterior"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm font-medium">Regresar</span>
            </button>
          </div>

          <div className="max-w-4xl mx-auto text-center space-y-12">
            
            {/* Título principal */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Planifiquemos tu{' '}
                <span className="text-primary-dark">viaje</span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                Te ayudaremos a calcular exactamente cuánto dinero necesitarás para tu próxima aventura,
                y te mostraremos cómo ahorrar más con beneficios exclusivos.
              </p>
            </div>

            {/* Proceso en 3 pasos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold text-lg">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Selecciona destino</h3>
                <p className="text-gray-600 text-sm">Elige tu país de destino y duración del viaje</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold text-lg">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Ve tu presupuesto</h3>
                <p className="text-gray-600 text-sm">Conoce el costo detallado por categorías</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold text-lg">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Descubre beneficios</h3>
                <p className="text-gray-600 text-sm">Obtén tu plan personalizado de ahorro</p>
              </div>
            </div>

            {/* Características destacadas */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                ¿Por qué usar nuestra calculadora?
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900">Datos reales actualizados</h4>
                    <p className="text-gray-600 text-sm">Información de costos basada en datos reales de más de 50 destinos</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900">Beneficios personalizados</h4>
                    <p className="text-gray-600 text-sm">Descubre cómo ahorrar con tipos de cambio, rendimientos e inversiones</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900">Plan de ahorro completo</h4>
                    <p className="text-gray-600 text-sm">Recibe recomendaciones específicas para alcanzar tu meta</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900">100% gratuito</h4>
                    <p className="text-gray-600 text-sm">Sin costos ocultos, obtén toda la información que necesitas</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Botón de continuar */}
            <div className="space-y-4">
              <button
                onClick={handleContinue}
                disabled={isLoading}
                className={`
                  btn-primary text-xl px-8 py-4 flex items-center space-x-3 group mx-auto
                  ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'}
                  transform transition-all duration-300
                `}
                aria-label="Continuar al formulario de viaje"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                    <span>Cargando...</span>
                  </>
                ) : (
                  <>
                    <span>Empezar ahora</span>
                    <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </button>

              <p className="text-sm text-gray-500">
                ⏱️ Solo toma 2-3 minutos • 🔒 Información segura
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Elementos decorativos */}
      <div className="absolute top-16 right-16 w-6 h-6 bg-primary/20 rounded-full" />
      <div className="absolute bottom-20 left-16 w-4 h-4 bg-green-300/30 rounded-full" />
      <div className="absolute top-1/3 right-8 w-3 h-3 bg-blue-300/40 rounded-full" />
    </div>
  );
}
