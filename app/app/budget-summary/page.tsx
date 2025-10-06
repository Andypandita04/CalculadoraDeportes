
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Calculator, MapPin, Calendar, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BudgetBreakdown } from '@/components/budget-breakdown';
import { LoadingSpinner } from '@/components/loading-spinner';

import { useAppStore } from '@/lib/store';
import { useCalculations } from '@/hooks/use-calculations';
import { usePageTracking } from '@/hooks/use-usage-tracking';
import { calculateBenefits } from '@/lib/benefits.daily';
import { formatMonthYear } from '@/lib/dates';

export default function BudgetSummaryPage() {
  const router = useRouter();
  const { 
    travelSelection, 
    calculationResults,
    setCurrentStep 
  } = useAppStore();
  
  const { calculateBudget, isLoading, error, isOtherCountry } = useCalculations();
  const [hasCalculated, setHasCalculated] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  
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
  
  const handleDiscoverHow = () => {
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
  
  const { countryData, duration, numberOfEvents, startMonth, startYear } = travelSelection;
  
  if (!calculationResults || !countryData) {
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
  
  const { dailyCostMXN, dailyCostLocal, localCurrency } = calculationResults;
  
  // Calculate one-time costs
  const oneTimeCostsMXN = (
    (countryData?.oneTimeCosts?.vuelo || 0) +
    (countryData?.oneTimeCosts?.comunicaciones || 0) +
    ((countryData?.oneTimeCosts?.entradas || 0) * numberOfEvents) +
    ((countryData?.oneTimeCosts?.bebidasEvento || 0) * numberOfEvents) +
    (countryData?.oneTimeCosts?.souvenirs || 0) +
    (countryData?.monthlyCosts?.seguros || 0)
  ) * (countryData?.exchangeRate || 1);
  
  const oneTimeCostsLocal = (
    (countryData?.oneTimeCosts?.vuelo || 0) +
    (countryData?.oneTimeCosts?.comunicaciones || 0) +
    ((countryData?.oneTimeCosts?.entradas || 0) * numberOfEvents) +
    ((countryData?.oneTimeCosts?.bebidasEvento || 0) * numberOfEvents) +
    (countryData?.oneTimeCosts?.souvenirs || 0) +
    (countryData?.monthlyCosts?.seguros || 0)
  );
  
  // Calculate total trip cost (daily costs + one-time costs)
  const totalCostMXN = (dailyCostMXN * duration) + oneTimeCostsMXN;
  const totalCostLocal = (dailyCostLocal * duration) + oneTimeCostsLocal;
  const durationInWeeks = Math.ceil(duration / 7);
  
  // Calculate benefits/savings
  const benefits = calculateBenefits(countryData, duration, startMonth, startYear);
  const totalSavings = benefits.totalBenefits;
  
  // Format departure date
  const departureDate = formatMonthYear(startMonth, startYear);

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
          <div className="text-center space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Tu presupuesto de viajes
            </h1>
            <p className="text-base text-gray-600">
              Costos diarios estimados y oportunidades de ahorro
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Left Side - Trip Summary and Weekly Costs */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              
              {/* Travel Summary (without image) */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-[#00CF0C]" />
                      <span className="text-xl font-semibold text-gray-900">{travelSelection?.country}</span>
                      {countryData?.currencyCode && (
                        <span className="text-lg text-gray-500">({countryData.currencyCode})</span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-6 text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{duration} {duration === 1 ? 'día' : 'días'}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>Inicio: {departureDate}</span>
                      </div>
                      
                      {numberOfEvents > 0 && (
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4" />
                          <span>{numberOfEvents} evento{numberOfEvents > 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Daily Cost and Total Trip Cost - Combined */}
              <Card className="bg-gradient-to-r from-[#00CF0C] to-[#007400] text-white shadow-xl">
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 divide-x divide-white/30">
                    {/* Daily Cost Section */}
                    <div className="text-center space-y-1 pr-4">
                      <h2 className="text-sm font-semibold">
                        Gasto al día:
                      </h2>
                      
                      <div className="space-y-0.5">
                        <div className="text-xl md:text-2xl font-bold">
                          ${Math.round(dailyCostMXN).toLocaleString('es-MX')} MXN
                        </div>
                        <div className="text-sm opacity-90">
                          ${Math.round(dailyCostLocal).toLocaleString('es-MX')} • {localCurrency}
                        </div>
                      </div>
                    </div>
                    
                    {/* Total Cost Section */}
                    <div className="text-center space-y-1 pl-4">
                      <h2 className="text-sm font-semibold">Gasto total del viaje</h2>
                      <div className="space-y-0.5">
                        <div className="text-xl md:text-2xl font-bold">
                          ${Math.round(totalCostMXN).toLocaleString('es-MX')} MXN
                        </div>
                        <div className="text-sm opacity-90">
                          ${Math.round(totalCostLocal).toLocaleString('es-MX')} • {localCurrency}
                        </div>
                        <p className="text-xs opacity-80">
                          {duration} {duration === 1 ? 'día' : 'días'} en {travelSelection?.country}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Daily and One-off Costs Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    ¿Cuánto necesitarías al día?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Daily Breakdown */}
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3">Desglose por categoría (diario)</h4>
                    <div className="space-y-3">
                      {[
                        { 
                          icon: '🏠', 
                          label: 'Hospedaje', 
                          dailyMXN: ((countryData?.monthlyCosts?.hospedaje || 0) / 30) * (countryData?.exchangeRate || 1)
                        },
                        { 
                          icon: '🍽️', 
                          label: 'Alimentos', 
                          dailyMXN: ((countryData?.monthlyCosts?.alimentos || 0) / 30) * (countryData?.exchangeRate || 1)
                        },
                        { 
                          icon: '🚗', 
                          label: 'Transporte', 
                          dailyMXN: ((countryData?.monthlyCosts?.transporte || 0) / 30) * (countryData?.exchangeRate || 1)
                        },
                        { 
                          icon: '🎮', 
                          label: 'Entretenimiento', 
                          dailyMXN: ((countryData?.monthlyCosts?.entretenimiento || 0) / 30) * (countryData?.exchangeRate || 1)
                        }
                      ].filter(item => item.dailyMXN > 0).map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">{item.icon}</span>
                            <span className="text-gray-700">{item.label}</span>
                          </div>
                          <span className="font-semibold">${Math.round(item.dailyMXN).toLocaleString('es-MX')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* One-off Costs */}
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3">Desglose por categoría (pagos únicos)</h4>
                    <div className="space-y-3">
                      {[
                        { 
                          icon: '✈️', 
                          label: 'Vuelo de ida y vuelta', 
                          amountMXN: (countryData?.oneTimeCosts?.vuelo || 0) * (countryData?.exchangeRate || 1)
                        },
                        { 
                          icon: '�', 
                          label: 'Seguros/Trámites', 
                          amountMXN: (countryData?.monthlyCosts?.seguros || 0) * (countryData?.exchangeRate || 1)
                        },
                        { 
                          icon: '�📱', 
                          label: 'Paquetes de datos y WiFi', 
                          amountMXN: (countryData?.oneTimeCosts?.comunicaciones || 0) * (countryData?.exchangeRate || 1)
                        },
                        { 
                          icon: '🎫', 
                          label: `Costo promedio de boletos (${numberOfEvents} evento${numberOfEvents > 1 ? 's' : ''})`, 
                          amountMXN: ((countryData?.oneTimeCosts?.entradas || 0) * numberOfEvents) * (countryData?.exchangeRate || 1)
                        },
                        { 
                          icon: '🍺', 
                          label: 'Costos de consumo dentro del evento', 
                          amountMXN: ((countryData?.oneTimeCosts?.bebidasEvento || 0) * numberOfEvents) * (countryData?.exchangeRate || 1)
                        },
                        { 
                          icon: '🛍️', 
                          label: 'Costos souvenirs', 
                          amountMXN: (countryData?.oneTimeCosts?.souvenirs || 0) * (countryData?.exchangeRate || 1)
                        }
                      ].filter(item => item.amountMXN > 0).map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">{item.icon}</span>
                            <span className="text-gray-700">{item.label}</span>
                          </div>
                          <span className="font-semibold">${Math.round(item.amountMXN).toLocaleString('es-MX')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Right Side - Savings and CTA */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              
              {/* Savings Card */}
              <Card>
                <CardContent className="p-6 text-center space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Con nosotros podrías generar el siguiente ahorro para tu viaje:
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-[#00CF0C]">
                      ${Math.round(totalSavings).toLocaleString('es-MX')}
                    </div>
                    <div className="text-lg text-gray-600">
                      (${Math.round(totalSavings / (countryData?.exchangeRate || 1)).toLocaleString('es-MX')} {localCurrency})
                    </div>
                    <p className="text-sm text-gray-500">Ahorro estimado total</p>
                  </div>
                  
                  <Button
                    size="lg"
                    onClick={handleDiscoverHow}
                    className="w-full bg-[#00CF0C] hover:bg-[#007400] hover:scale-105 transition-transform duration-200"
                  >
                    Descubre cómo →
                  </Button>
                </CardContent>
              </Card>

              {/* Dropdown Disclaimer */}
              <Card>
                <CardHeader 
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setShowDisclaimer(!showDisclaimer)}
                >
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>Ten en cuenta que:</span>
                    {showDisclaimer ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </CardTitle>
                </CardHeader>
                
                {showDisclaimer && (
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Aviso y limitación de responsabilidad
                      </h4>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Las estimaciones de esta calculadora son referenciales y pueden variar por tipo de cambio, 
                        temporada, políticas locales y comisiones. Incluyen supuestos de costos básicos, extras y 
                        un colchón del 10%, con conversión a MXN según tipo de cambio real y tipo de cambio preventivo.
                        Esta herramienta no garantiza precios ni constituye oferta o contrato. Los resultados son 
                        solo para fines informativos y deben validarse con proveedores oficiales antes de tomar 
                        decisiones. La empresa y sus afiliados no asumen responsabilidad por diferencias con costos reales.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Aviso legal y limitación de responsabilidad
                      </h4>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Esta calculadora es una herramienta orientativa para estimar costos de vida y viaje en 
                        distintos países y monedas (USD, CAD, EUR, GBP, JPY, KRW, CNY, AUD, NZD, ARS, CLP, BRL, COP, PEN).
                        Los cálculos incluyen hospedaje, alimentación, transporte, entretenimiento, seguros, trámites, 
                        comunicaciones, actividades, extras, comisiones financieras y un colchón de imprevistos (10%), 
                        convertidos a MXN con tipo de cambio real y un tipo de cambio preventivo.
                        Los valores mostrados no son precios finales, pues dependen de factores externos: variación 
                        cambiaria, temporada, disponibilidad, políticas locales, impuestos o comisiones adicionales.
                        Esta información no constituye oferta, contrato, cotización ni garantía de precio o servicio.
                        La empresa responsable, sus afiliadas y socios no asumen responsabilidad por discrepancias 
                        entre los resultados estimados y los costos reales ni por decisiones basadas en estos resultados.
                        El usuario es responsable de verificar condiciones vigentes con proveedores oficiales 
                        (aerolíneas, alojamientos, bancos, consulados, operadores turísticos).
                        El uso de esta herramienta implica la aceptación de estas limitaciones.
                      </p>
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>
          </div>

          
          {/* Footer */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800 leading-relaxed">
              <strong>AVISO:</strong> Los cálculos mostrados son estimaciones referenciales en distintas monedas y países. 
              Los costos reales pueden variar por tipo de cambio, temporada, comisiones o políticas locales. 
              Esta calculadora no constituye oferta ni garantía de precio. Verifica siempre con proveedores 
              oficiales antes de contratar o viajar.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
