
'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { usePageTracking } from '@/hooks/use-usage-tracking';
import { motion } from 'framer-motion';

export default function HomePage() {
  const router = useRouter();
  const { setCurrentStep, generateSessionId } = useAppStore();
  
  // Track page view
  usePageTracking('/');
  
  const handleStartJourney = () => {
    generateSessionId(); // Generate new session for this journey
    setCurrentStep('selection');
    router.push('/selection');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-4rem)]">
          
          {/* Lado izquierdo - Contenido */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Calcula aquí cuánto dinero necesitarás en tu{' '}
                <span className="text-[#007400]">viaje</span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                Planifica tu presupuesto diario para eventos deportivos internacionales 
                y descubre cómo ahorrar más para tu próxima aventura.
              </p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Button 
                size="lg"
                onClick={handleStartJourney}
                className="text-lg px-8 py-4 h-auto hover:scale-105 transition-transform duration-200"
              >
                Comenzar
              </Button>
            </motion.div>
            
            
          </motion.div>
          
          {/* Lado derecho - Imagen */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative aspect-video bg-gray-200 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://cdn.abacus.ai/images/30a7e139-f798-4c75-82c7-86016f6cd964.png"
                alt="Ilustración de viajes internacionales con planeta Tierra, aviones y copa mundial"
                fill
                className="object-cover"
                priority
              />
              
              {/* Overlay decorativo */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              
              {/* Badge flotante */}
              <motion.div 
                className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                <p className="text-sm font-semibold text-gray-900">
                  Planifica tu próximo viaje deportivo
                </p>
              </motion.div>

              {/* Features highlight 
              <motion.div 
                className="grid grid-cols-2 gap-6 pt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <div className="space-y-2">
                  <div className="w-8 h-8 bg-[#00CF0C]/10 rounded-lg flex items-center justify-center">
                    <span className="text-[#00CF0C] font-bold">💰</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">Cálculo preciso</h3>
                  <p className="text-sm text-gray-600">Presupuesto diario personalizado por país</p>
                </div>
                
                <div className="space-y-2">
                  <div className="w-8 h-8 bg-[#00CF0C]/10 rounded-lg flex items-center justify-center">
                    <span className="text-[#00CF0C] font-bold">🏆</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">Eventos deportivos</h3>
                  <p className="text-sm text-gray-600">Especializado en viajes deportivos</p>
                </div>
                
                <div className="space-y-2">
                  <div className="w-8 h-8 bg-[#00CF0C]/10 rounded-lg flex items-center justify-center">
                    <span className="text-[#00CF0C] font-bold">💡</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">Tips de ahorro</h3>
                  <p className="text-sm text-gray-600">Descubre cómo ahorrar más</p>
                </div>
                
                <div className="space-y-2">
                  <div className="w-8 h-8 bg-[#00CF0C]/10 rounded-lg flex items-center justify-center">
                    <span className="text-[#00CF0C] font-bold">🌍</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">Global</h3>
                  <p className="text-sm text-gray-600">Destinos en todo el mundo</p>
                </div>
              </motion.div> */}






            </div> {/* Fin del contenedor de la imagen */}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
