
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import { TravelSummary } from '@/components/travel-summary';
import { BenefitsBreakdown } from '@/components/benefits-breakdown';
import { LeadForm } from '@/components/lead-form';
import { LoadingSpinner } from '@/components/loading-spinner';

import { useAppStore } from '@/lib/store';
import { usePageTracking } from '@/hooks/use-usage-tracking';

export default function BenefitsBreakdownPage() {
  const router = useRouter();
  const { 
    travelSelection, 
    calculationResults,
    setCurrentStep 
  } = useAppStore();
  
  const [showForm, setShowForm] = useState(false);
  
  // Track page view
  usePageTracking('/benefits-breakdown');
  
  useEffect(() => {
    setCurrentStep('benefits');
    
    // Show form after a few seconds to let user see benefits first
    const timer = setTimeout(() => {
      setShowForm(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [setCurrentStep]);
  
  // Redirect if missing data
  useEffect(() => {
    if (!travelSelection?.country || !travelSelection?.countryData || !calculationResults) {
      router.replace('/budget-summary');
    }
  }, [travelSelection, calculationResults, router]);
  
  // Early return si no hay datos completos
  if (!travelSelection?.country || !travelSelection?.countryData || !calculationResults?.benefits) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <h2 className="text-xl font-semibold text-gray-900">Redirigiendo...</h2>
          <p className="text-gray-600">Preparando tus datos de cálculo</p>
        </div>
      </div>
    );
  }
  
  const { benefits } = calculationResults;
  const { countryData } = travelSelection;
  
  if (!countryData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error: Faltan datos del país seleccionado</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Conoce los beneficios de nuestra membresía 
            </h1>
            <p className="text-lg text-gray-600">
              Descubre cómo puedes ahorrar más para tu viaje a {travelSelection?.country}
            </p>
          </div>
          
          {/* Travel Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <TravelSummary selection={travelSelection} />
          </motion.div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Benefits Display */}
            <motion.div
              className="lg:col-span-2 space-y-6"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <BenefitsBreakdown
                benefits={benefits}
                exchangeRate={countryData?.exchangeRate || 1}
                currencyCode={calculationResults?.localCurrency || 'USD'}
              />
            </motion.div>
            
            {/* Sidebar with Form */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              
              {/* Form */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ 
                  opacity: showForm ? 1 : 0, 
                  scale: showForm ? 1 : 0.95 
                }}
                transition={{ duration: 0.5 }}
              >
                {showForm && (
                  <LeadForm 
                    onSuccess={() => {
                      setCurrentStep('form');
                      // Keep user on same page to see success message
                    }}
                  />
                )}
              </motion.div>
              
              {!showForm && (
                <motion.div
                  className="text-center py-8"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: showForm ? 0 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-[#00CF0C]/10 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-2xl">💰</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      ¡Grandes ahorros te esperan!
                    </h3>
                    <p className="text-gray-600">
                      Obtén tu plan personalizado en unos segundos...
                    </p>
                    <LoadingSpinner size="sm" />
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
          
          {/* Bottom CTA */}
          <motion.div
            className="bg-gradient-to-r from-[#00CF0C] to-[#007400] rounded-2xl p-8 text-center text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-4">
              ¿Listo para hacer realidad tu viaje?
            </h2>
            <p className="text-lg opacity-90 mb-6">
              Con los ahorros calculados, podrías extender tu viaje o disfrutar de más experiencias
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold">
                  {Math.round(benefits?.totalBenefits || 0).toLocaleString('es-MX')}
                </div>
                <div className="text-sm opacity-80">MXN en ahorros</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-3xl font-bold">
                  {Math.round(benefits?.equivalentDays || 0)}
                </div>
                <div className="text-sm opacity-80">Días adicionales</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-3xl font-bold">4</div>
                <div className="text-sm opacity-80">Formas de ahorrar</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
