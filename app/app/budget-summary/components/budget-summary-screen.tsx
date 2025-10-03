
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { TripFormDraft, Destination, BenefitCalculation } from '@/lib/types';
import { formatMxn, convertToMxn, formatLocalEquivalent } from '@/lib/currency';
import { calculateBenefits } from '@/lib/benefits';

const WEEKS_PER_MONTH = 4.345;

export function BudgetSummaryScreen() {
  const router = useRouter();
  
  const [tripDraft, setTripDraft] = useState<TripFormDraft | null>(null);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [benefitCalculation, setBenefitCalculation] = useState<BenefitCalculation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    loadTripDraft();
  }, []);

  const loadTripDraft = async () => {
    try {
      setIsLoading(true);
      
      // Cargar el borrador desde sessionStorage
      const storedDraft = sessionStorage.getItem('tripDraft');
      if (!storedDraft) {
        setError('No se encontró información del viaje. Por favor completa el formulario.');
        setIsLoading(false);
        return;
      }

      const draft = JSON.parse(storedDraft) as TripFormDraft & {
        destinationId: string;
        continente: string;
        pais: string;
      };
      
      setTripDraft(draft);

      // Si hay un destino seleccionado (no "otro"), cargarlo
      if (draft.destinationId && draft.destinationId !== 'other') {
        const response = await fetch(`/api/destinations/${draft.destinationId}`);
        if (response.ok) {
          const destinationData = await response.json();
          setDestination(destinationData);
          
          // Calcular beneficios
          const calculation = calculateBenefits(
            destinationData,
            draft.weeks,
            draft.startMonth,
            draft.startYear
          );
          setBenefitCalculation(calculation);
        }
      }
    } catch (error) {
      console.error('Error loading trip draft:', error);
      setError('Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    router.push('/trip-form');
  };

  const handleViewBenefits = () => {
    router.push('/benefits-breakdown');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-light flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Calculando tu presupuesto...</p>
        </div>
      </div>
    );
  }

  if (error || !tripDraft) {
    return (
      <div className="min-h-screen bg-gradient-light flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleGoBack}
            className="btn-primary"
          >
            Regresar al formulario
          </button>
        </div>
      </div>
    );
  }

  const countryName = destination?.country || tripDraft.otherCountry || 'Destino no especificado';
  const monthNames = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  
  // Cálculos para mostrar presupuesto semanal (SIN pagos únicos)
  const weeklyRecurringCostLocal = destination ? (
    destination.housingCost + 
    destination.foodCost + 
    destination.transportCost + 
    destination.entertainmentCost + 
    destination.activitiesCost + 
    destination.extrasCost
  ) / WEEKS_PER_MONTH : 0;

  const weeklyRecurringCostMxn = destination ? weeklyRecurringCostLocal * destination.realExchangeRate : 0;

  // Pagos únicos (no se multiplican por semanas)
  const oneTimeCostLocal = destination ? (
    destination.insuranceCost + 
    destination.flightCost + 
    destination.communicationCost
  ) : 0;

  const oneTimeCostMxn = destination ? oneTimeCostLocal * destination.realExchangeRate : 0;

  return (
    <div className="min-h-screen bg-gradient-light">
      {/* Header */}
      <div className="container-app py-6">
        <button
          onClick={handleGoBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors duration-200 p-2 rounded-lg hover:bg-white/50"
          aria-label="Regresar a la pantalla anterior"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm font-medium">Regresar</span>
        </button>
      </div>

      <div className="container-app pb-12">
        {/* Título principal */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Tu presupuesto de intercambio
          </h1>
          <p className="text-lg text-gray-600">
            Costos {tripDraft.weeks > 1 ? 'semanales' : 'del viaje'} estimados y oportunidades de ahorro
          </p>
        </div>

        {/* Grid layout - 2 columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          
          {/* LADO IZQUIERDO */}
          <div className="space-y-6">
            
            {/* Resumen del viaje */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{countryName}</h2>
              <div className="space-y-2 text-gray-700">
                <p><strong>{tripDraft.weeks > 1 ? `${tripDraft.weeks} semanas` : `${tripDraft.weeks} semana`}</strong></p>
                <p>Inicio: <strong>{monthNames[tripDraft.startMonth]} {tripDraft.startYear}</strong></p>
              </div>
            </div>

            {/* Cuánto necesitarás a la semana */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {tripDraft.weeks > 1 ? 'Cuánto necesitarías a la semana' : 'Para el intercambio necesitarás:'}
              </h2>
              
              {destination && (
                <>
                  {/* Monto principal semanal */}
                  <div className="mb-6">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {formatMxn(weeklyRecurringCostMxn)} MXN
                    </div>
                    <div className="text-lg text-gray-500">
                      {formatLocalEquivalent(weeklyRecurringCostLocal, destination.currency?.symbol)}
                    </div>
                  </div>

                  {/* Desglose semanal */}
                  <div className="space-y-3 mb-6">
                    <h3 className="font-semibold text-gray-900 text-sm mb-3">Desglose por categoría (semanal)</h3>
                    
                    {destination.housingCost > 0 && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-xl">🏠</span>
                          </div>
                          <span className="text-gray-700">Hospedaje</span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {formatMxn(convertToMxn(destination.housingCost / WEEKS_PER_MONTH, destination.realExchangeRate))}
                        </span>
                      </div>
                    )}
                    
                    {destination.foodCost > 0 && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-xl">🍽️</span>
                          </div>
                          <span className="text-gray-700">Alimentos</span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {formatMxn(convertToMxn(destination.foodCost / WEEKS_PER_MONTH, destination.realExchangeRate))}
                        </span>
                      </div>
                    )}
                    
                    {destination.transportCost > 0 && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-xl">🚗</span>
                          </div>
                          <span className="text-gray-700">Transporte</span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {formatMxn(convertToMxn(destination.transportCost / WEEKS_PER_MONTH, destination.realExchangeRate))}
                        </span>
                      </div>
                    )}
                    
                    {destination.entertainmentCost > 0 && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-xl">🎮</span>
                          </div>
                          <span className="text-gray-700">Entretenimiento</span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {formatMxn(convertToMxn(destination.entertainmentCost / WEEKS_PER_MONTH, destination.realExchangeRate))}
                        </span>
                      </div>
                    )}

                    {(destination.activitiesCost > 0 || destination.extrasCost > 0) && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-xl">🎭</span>
                          </div>
                          <span className="text-gray-700">Actividades/Extras</span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {formatMxn(convertToMxn((destination.activitiesCost + destination.extrasCost) / WEEKS_PER_MONTH, destination.realExchangeRate))}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Desglose de pagos únicos */}
                  {oneTimeCostMxn > 0 && (
                    <div className="border-t border-gray-200 pt-4">
                      <h3 className="font-semibold text-gray-900 text-sm mb-3">Desglose por categoría (pagos únicos)</h3>
                      
                      {destination.flightCost > 0 && (
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                              <span className="text-xl">✈️</span>
                            </div>
                            <span className="text-gray-700">Vuelo</span>
                          </div>
                          <span className="font-semibold text-gray-900">
                            {formatMxn(convertToMxn(destination.flightCost, destination.realExchangeRate))}
                          </span>
                        </div>
                      )}
                      
                      {destination.communicationCost > 0 && (
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                              <span className="text-xl">📱</span>
                            </div>
                            <span className="text-gray-700">Comunicación</span>
                          </div>
                          <span className="font-semibold text-gray-900">
                            {formatMxn(convertToMxn(destination.communicationCost, destination.realExchangeRate))}
                          </span>
                        </div>
                      )}
                      
                      {destination.insuranceCost > 0 && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                              <span className="text-xl">🛡️</span>
                            </div>
                            <span className="text-gray-700">Seguros/Trámites</span>
                          </div>
                          <span className="font-semibold text-gray-900">
                            {formatMxn(convertToMxn(destination.insuranceCost, destination.realExchangeRate))}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* LADO DERECHO */}
          <div className="space-y-6">
            
            {/* Ahorro estimado */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Con nosotros podrías generar el siguiente ahorro para tu viaje:
              </h2>
              
              {benefitCalculation && (
                <>
                  <div className="text-center mb-6">
                    <div className="text-5xl font-bold text-primary mb-2">
                      {formatMxn(benefitCalculation.totalAmountMxn)}
                    </div>
                    <div className="text-gray-500 text-lg">
                      ({formatLocalEquivalent(benefitCalculation.totalAmountLocal, destination?.currency?.symbol || 'USD')})
                    </div>
                    <p className="text-gray-600 mt-2">Ahorro estimado total</p>
                  </div>

                  <button
                    onClick={handleViewBenefits}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                    aria-label="Descubre cómo ahorrar"
                  >
                    <span>Descubre cómo</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Sección informativa */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <button
                onClick={() => setShowDisclaimer(!showDisclaimer)}
                className="w-full flex items-center justify-between text-left"
              >
                <h3 className="font-semibold text-gray-900">Ten en cuenta que:</h3>
                {showDisclaimer ? (
                  <ChevronUp className="h-5 w-5 text-gray-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-600" />
                )}
              </button>
              
              {showDisclaimer && (
                <div className="mt-4 space-y-4 text-sm text-gray-700">
                  <div>
                    <h4 className="font-semibold mb-2">Aviso y limitación de responsabilidad</h4>
                    <p className="text-gray-600">
                      Las estimaciones de esta calculadora son referenciales y pueden variar por tipo de cambio, temporada, políticas locales y comisiones. Incluyen supuestos de costos básicos, extras y un colchón del 10%, con conversión a MXN según tipo de cambio real y tipo de cambio preventivo. Esta herramienta no garantiza precios ni constituye oferta o contrato. Los resultados son solo para fines informativos y deben validarse con proveedores oficiales antes de tomar decisiones. La empresa y sus afiliados no asumen responsabilidad por diferencias con costos reales.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Aviso legal y limitación de responsabilidad</h4>
                    <p className="text-gray-600">
                      Esta calculadora es una herramienta orientativa para estimar costos de vida y viaje en distintos países y monedas (USD, CAD, EUR, GBP, JPY, KRW, CNY, AUD, NZD, ARS, CLP, BRL, COP, PEN). Los cálculos incluyen hospedaje, alimentación, transporte, entretenimiento, seguros, trámites, comunicaciones, actividades, extras, comisiones financieras y un colchón de imprevistos (10%), convertidos a MXN con tipo de cambio real y un tipo de cambio preventivo. Los valores mostrados no son precios finales, pues dependen de factores externos: variación cambiaria, temporada, disponibilidad, políticas locales, impuestos o comisiones adicionales. Esta información no constituye oferta, contrato, cotización ni garantía de precio o servicio. La empresa responsable, sus afiliadas y socios no asumen responsabilidad por discrepancias entre los resultados estimados y los costos reales ni por decisiones basadas en estos resultados. El usuario es responsable de verificar condiciones vigentes con proveedores oficiales (aerolíneas, alojamientos, bancos, consulados, operadores turísticos). El uso de esta herramienta implica la aceptación de estas limitaciones.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 max-w-7xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-xs text-gray-700 text-center">
              <strong>AVISO:</strong> Los cálculos mostrados son estimaciones referenciales en distintas monedas y países. Los costos reales pueden variar por tipo de cambio, temporada, comisiones o políticas locales. Esta calculadora no constituye oferta ni garantía de precio. Verifica siempre con proveedores oficiales antes de contratar o viajar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
