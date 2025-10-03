
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Calculator } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TravelSummary } from '@/components/travel-summary';
import { MoneyTag } from '@/components/money-tag';
import { BudgetBreakdown } from '@/components/budget-breakdown';
import { LoadingSpinner } from '@/components/loading-spinner';

import { useAppStore } from '@/lib/store';
import { useCalculations } from '@/hooks/use-calculations';
import { usePageTracking } from '@/hooks/use-usage-tracking';
import { getDailyCosts } from '@/lib/excel';

export default function BudgetSummaryPage() {
  const router = useRouter();
  const { 
    travelSelection, 
    calculationResults,
    setCurrentStep 
  } = useAppStore();
  
  const { calculateBudget, isLoading, error, isOtherCountry } = useCalculations();
  const [hasCalculated, setHasCalculated] = useState(false);
  
  // Track page view
  usePageTracking('/budget-summary');
  
  // Set current step once on mount
  useEffect(() => {
    setCurrentStep('budget');
  }, [setCurrentStep]);
  
  // Redirect if missing data
  useEffect(() => {
    if (!travelSelection?.country || !travelSelection?.countryData) {
      router.push('/selection');
    }
  }, [travelSelection?.country, travelSelection?.countryData, router]);
  
  // Auto-calculate if we have the necessary data but no results yet
  useEffect(() => {
    if (travelSelection?.country && travelSelection?.countryData && !calculationResults && !hasCalculated && !isLoading) {
      calculateBudget().then(() => {
        setHasCalculated(true);
      });
    }
  }, [travelSelection?.country, travelSelection?.countryData, calculationResults, hasCalculated, isLoading]);
  
  const handleViewBenefits = () => {
    setCurrentStep('benefits');
    router.push('/benefits-breakdown');
  };

  if (isLoading || (!calculationResults && !error)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <h2 className="text-xl font-semibold text-gray-900">Calculando tu presupuesto...</h2>
          <p className="text-gray-600">Esto tomará solo unos segundos</p>
        </div>
      </div>
    );
  }
  
  const { countryData, duration, numberOfEvents } = travelSelection;
  
  if (!calculationResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-600">{error || 'Error al cargar los resultados del cálculo'}</p>
          <Button onClick={() => router.push('/selection')} className="mt-4">
            Volver a selección
          </Button>
        </div>
      </div>
    );
  }
  
  const { dailyCostMXN, dailyCostLocal, localCurrency, oneOffCosts } = calculationResults;
  
  if (!countryData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error: Faltan datos del país seleccionado</p>
          <Button onClick={() => router.push('/selection')} className="mt-4">
            Volver a selección
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
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
              Tu presupuesto está listo
            </h1>
            <p className="text-lg text-gray-600">
              Aquí tienes el desglose completo de tu viaje a {travelSelection?.country}
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
            
            {/* Main Budget Display */}
            <motion.div
              className="lg:col-span-2 space-y-6"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              
              {/* Daily Cost Card */}
              <Card className="bg-gradient-to-r from-[#00CF0C] to-[#007400] text-white shadow-xl">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <Calculator className="h-6 w-6" />
                    <h2 className="text-xl font-semibold">
                      Para tu viaje necesitarás por día:
                    </h2>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-4xl md:text-5xl font-bold">
                      {Math.round(dailyCostMXN).toLocaleString('es-MX')} MXN
                    </div>
                    <div className="text-lg opacity-90">
                      ≈ {Math.round(dailyCostLocal).toLocaleString('es-MX')} {localCurrency}
                    </div>
                  </div>
                  
                  <div className="bg-white/20 rounded-lg p-4 mt-6">
                    <p className="text-sm">
                      Para {duration} días: <strong>{Math.round(dailyCostMXN * duration).toLocaleString('es-MX')} MXN</strong>
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Budget Breakdown */}
              <BudgetBreakdown
                countryData={countryData}
                numberOfEvents={numberOfEvents}
                exchangeRate={countryData?.exchangeRate || 1}
                currencyCode={localCurrency || 'USD'}
              />
            </motion.div>
            
            {/* Sidebar */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              
              {/* CTA to Benefits */}
              <Card className="border-[#00CF0C] shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg text-[#00CF0C]">
                    💡 ¿Sabías que puedes ahorrar más?
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-gray-600">
                    Descubre 4 formas de reducir tus costos y maximizar tu presupuesto de viaje.
                  </p>
                  
                  <Button
                    size="lg"
                    onClick={handleViewBenefits}
                    className="w-full hover:scale-105 transition-transform duration-200"
                  >
                    Ver beneficios
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
              
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-md">Resumen rápido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Costo por día:</span>
                    <span className="font-semibold">{Math.round(dailyCostMXN).toLocaleString('es-MX')} MXN</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total {duration} días:</span>
                    <span className="font-semibold">{Math.round(dailyCostMXN * duration).toLocaleString('es-MX')} MXN</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Moneda local:</span>
                    <span className="font-semibold">{localCurrency}</span>
                  </div>
                  
                  {numberOfEvents > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Eventos:</span>
                      <span className="font-semibold">{numberOfEvents}</span>
                    </div>
                  )}
                  
                  {oneOffCosts && (
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Pagos únicos:</span>
                        <span className="font-semibold text-[#007400]">
                          {Math.round(
                            oneOffCosts.flights + 
                            oneOffCosts.dataWifi + 
                            oneOffCosts.eventTickets + 
                            oneOffCosts.insuranceVisa +
                            (oneOffCosts.bebidasEvento || 0) +
                            (oneOffCosts.souvenirs || 0)
                          ).toLocaleString('es-MX')} MXN
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Tips */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-blue-900">💡 Tip</h4>
                    <p className="text-sm text-blue-800">
                      Los costos pueden variar según la temporada y ubicación específica. 
                      Considera un colchón adicional del 10-15% para imprevistos.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
