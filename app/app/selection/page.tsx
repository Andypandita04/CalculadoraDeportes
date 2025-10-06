
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowRight, Ticket } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CountrySelect } from '@/components/country-select';
import { DurationSelect } from '@/components/duration-select';
import { DatePicker } from '@/components/date-picker';
import { TravelSummary } from '@/components/travel-summary';
import { LoadingSpinner } from '@/components/loading-spinner';

import { useAppStore } from '@/lib/store';
import { usePageTracking } from '@/hooks/use-usage-tracking';
import { useCountriesData } from '@/hooks/use-countries-data';

export default function SelectionPage() {
  const router = useRouter();
  const { 
    travelSelection, 
    updateTravelSelection, 
    setCurrentStep 
  } = useAppStore();
  
  const { isLoading: countriesLoading } = useCountriesData();
  
  // Track page view
  usePageTracking('/selection');
  
  // Local state for number of events
  const [numberOfEvents, setNumberOfEvents] = useState(travelSelection?.numberOfEvents || 1);
  
  useEffect(() => {
    setCurrentStep('selection');
  }, [setCurrentStep]);
  
  const canProceed = Boolean(
    travelSelection?.country && 
    travelSelection?.duration && 
    travelSelection?.startMonth && 
    travelSelection?.startYear
  );
  
  const handleCalculateBudget = () => {
    if (canProceed) {
      // Update number of events in store
      updateTravelSelection({ numberOfEvents });
      setCurrentStep('budget');
      router.push('/budget-summary');
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Background image */}
      <div className="fixed inset-0 z-0">
        <div className="relative w-full h-full opacity-10">
          <Image
            src="https://cdn.abacus.ai/images/c7e10fec-af19-4031-ad21-bd45eda5f4de.png"
            alt="Fondo de viajes turísticos y deportivos"
            fill
            className="object-cover"
          />
        </div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Planifiquemos tu viaje
            </h1>
            <p className="text-lg text-gray-600">
              Necesitamos algunos datos para calcular tu presupuesto personalizado
            </p>
          </div>
          
          {countriesLoading && (
            <div className="text-center py-8">
              <LoadingSpinner size="lg" text="Cargando datos de países..." />
            </div>
          )}
          
          {!countriesLoading && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Formulario */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <Card className="shadow-xl backdrop-blur-sm bg-white/95">
                  <CardContent className="p-6 space-y-6">
                    
                    {/* Columna 1 - Destino */}
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                        <span>¿A qué país viajarás?</span>
                      </h2>
                      
                      <CountrySelect
                        value={travelSelection?.country || ''}
                        onValueChange={(country) => updateTravelSelection({ country })}
                        placeholder="Selecciona un país"
                      />
                    </div>
                    
                    {/* Columna 2 - Tiempo, fecha y eventos */}
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          ¿Cuánto tiempo durará tu viaje (en días)?
                        </h3>
                        <DurationSelect
                          value={travelSelection?.duration || 7}
                          onValueChange={(duration) => updateTravelSelection({ duration })}
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          ¿Desde qué fecha?
                        </h3>
                        <DatePicker
                          selectedMonth={travelSelection?.startMonth || new Date().getMonth() + 2}
                          selectedYear={travelSelection?.startYear || new Date().getFullYear()}
                          onMonthChange={(month) => updateTravelSelection({ startMonth: month })}
                          onYearChange={(year) => updateTravelSelection({ startYear: year })}
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          ¿A cuántos eventos deportivos piensas ir durante tu viaje?
                        </h3>
                        <div className="flex items-center space-x-3">
                          <Ticket className="h-4 w-4 text-[#00CF0C]" />
                          <Input
                            type="number"
                            min="0"
                            max="20"
                            value={numberOfEvents}
                            onChange={(e) => setNumberOfEvents(parseInt(e.target.value) || 0)}
                            placeholder="Número de eventos"
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* Resumen y CTA */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {/* Resumen dinámico */}
                {travelSelection?.country && (
                  <TravelSummary 
                    selection={{
                      ...travelSelection,
                      numberOfEvents
                    }} 
                  />
                )}
                
                {/* CTA Button */}
                <Card className="bg-gradient-to-r from-[#00CF0C] to-[#007400] text-white shadow-xl">
                  <CardContent className="p-6 text-center space-y-4">
                    <h3 className="text-lg font-semibold">
                      ¿Listo para conocer tu presupuesto?
                    </h3>
                    
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={handleCalculateBudget}
                      disabled={!canProceed}
                      className="w-full bg-white text-[#00CF0C] hover:bg-gray-50 border-white hover:scale-105 transition-transform duration-200"
                    >
                      Calcula tu presupuesto
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    
                    {!canProceed && (
                      <p className="text-sm text-white/80">
                        Completa todos los campos para continuar
                      </p>
                    )}
                  </CardContent>
                </Card>
                
                {/* Info adicional */}
                <motion.div
                  className="text-center space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  <p className="text-sm text-gray-600">
                    💡 Obtén un cálculo personalizado por día y descubre formas de ahorrar
                  </p>
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
