
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, TrendingUp } from 'lucide-react';
import { BenefitsList } from '@/components/ui/benefits-list';
import { SavingsTotal } from '@/components/ui/savings-total';
import { LeadForm } from '@/components/ui/lead-form';
import { TripFormDraft, BenefitCalculation, Destination } from '@/lib/types';
import { calculateBenefits } from '@/lib/benefits';

const WEEKS_PER_MONTH = 4.345;

export function BenefitsBreakdownScreen() {
  const router = useRouter();
  
  const [tripDraft, setTripDraft] = useState<(TripFormDraft & { continente: string; pais: string }) | null>(null);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [benefitCalculation, setBenefitCalculation] = useState<BenefitCalculation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  useEffect(() => {
    loadTripDraftAndCalculateBenefits();
  }, []);

  const loadTripDraftAndCalculateBenefits = async () => {
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

      // Si hay un destino seleccionado (no "otro"), cargarlo y calcular beneficios
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
    router.push('/budget-summary');
  };

  const handleLeadFormSubmit = async (leadData: {
    fullName: string;
    email: string;
    preferredBenefit: string;
  }) => {
    if (!tripDraft) {
      throw new Error('No hay información del viaje');
    }

    setIsSubmittingLead(true);
    
    try {
      // Calcular monto total y ahorro total
      let montoTotal = 0;
      let ahorroTotal = 0;

      if (destination) {
        // Calcular costos semanales recurrentes (sin pagos únicos)
        const weeklyRecurringCostLocal = (
          destination.housingCost + 
          destination.foodCost + 
          destination.transportCost + 
          destination.entertainmentCost + 
          destination.activitiesCost + 
          destination.extrasCost
        ) / WEEKS_PER_MONTH;

        const weeklyRecurringCostMxn = weeklyRecurringCostLocal * destination.realExchangeRate;

        // Pagos únicos
        const oneTimeCostLocal = (
          destination.insuranceCost + 
          destination.flightCost + 
          destination.communicationCost
        );
        const oneTimeCostMxn = oneTimeCostLocal * destination.realExchangeRate;

        // Total del viaje
        montoTotal = (weeklyRecurringCostMxn * tripDraft.weeks) + oneTimeCostMxn;
        
        // Ahorro total (de beneficios)
        if (benefitCalculation) {
          ahorroTotal = benefitCalculation.totalAmountMxn;
        }
      }

      // Crear el trip_form con TODOS los campos requeridos
      const tripFormData = {
        continente: tripDraft.continente,
        pais: tripDraft.pais,
        semanasDuracion: tripDraft.weeks,
        mes: tripDraft.startMonth,
        anio: tripDraft.startYear,
        montoTotal: Math.round(montoTotal),
        ahorroTotal: Math.round(ahorroTotal),
        beneficioPreferido: leadData.preferredBenefit,
        nombre: leadData.fullName,
        correoElectronico: leadData.email
      };

      const response = await fetch('/api/trip-forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.error || 'Error al enviar el formulario');
      }

      // Limpiar el sessionStorage después de un envío exitoso
      sessionStorage.removeItem('tripDraft');

      // El éxito será manejado por el componente LeadForm
      return Promise.resolve();

    } catch (error) {
      console.error('Error submitting lead:', error);
      throw error;
    } finally {
      setIsSubmittingLead(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-light flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Calculando tus beneficios...</p>
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
            Regresar
          </button>
        </div>
      </div>
    );
  }

  const countryName = destination?.country || tripDraft.otherCountry || 'Destino no especificado';

  if (!destination || !benefitCalculation) {
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
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Beneficios para tu viaje a {countryName}
              </h1>
              <p className="text-lg text-gray-600">
                Aunque no tenemos datos específicos para este destino, podemos ayudarte con un plan personalizado.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <LeadForm
                onSubmit={handleLeadFormSubmit}
                loading={isSubmittingLead}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Título principal */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary bg-opacity-10 rounded-full mb-4">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Beneficios para tu viaje a {countryName}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Descubre cuánto podrías ahorrar cada semana implementando estos beneficios financieros 
              para tu viaje de {tripDraft.weeks} semana{tripDraft.weeks !== 1 ? 's' : ''}.
            </p>
          </div>

          {/* Lista de beneficios */}
          <BenefitsList calculation={benefitCalculation} />

          {/* Total de ahorros */}
          <SavingsTotal calculation={benefitCalculation} />

          {/* Mensaje contextual */}
          <div className="text-center">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                💰 Este ahorro es equivalente a
              </h3>
              <div className="text-3xl font-bold text-primary mb-2">
                {benefitCalculation.equivalentWeeks.toFixed(1)} semanas
              </div>
              <p className="text-gray-600">
                del costo total de tu viaje. ¡Prácticamente como si tuvieras semanas gratis!
              </p>
            </div>
          </div>

          {/* Formulario final */}
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                ¿Te interesa optimizar tu ahorro?
              </h2>
              <p className="text-gray-600">
                Déjanos tus datos y te enviaremos un plan personalizado para alcanzar tu meta de viaje.
              </p>
            </div>

            <LeadForm
              onSubmit={handleLeadFormSubmit}
              loading={isSubmittingLead}
            />
          </div>

          {/* Información adicional */}
          <div className="bg-blue-50 rounded-xl p-8 border border-blue-100">
            <h4 className="font-semibold text-blue-900 mb-4 text-center">
              📋 Próximos pasos recomendados
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-blue-800">
              <div className="space-y-2">
                <p className="font-medium">Para maximizar tus ahorros:</p>
                <ul className="space-y-1 ml-4">
                  <li>• Compara tipos de cambio regularmente</li>
                  <li>• Considera abrir una cuenta de ahorro</li>
                  <li>• Busca tarjetas con cashback en viajes</li>
                  <li>• Planifica transferencias gratuitas</li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="font-medium">Consejos adicionales:</p>
                <ul className="space-y-1 ml-4">
                  <li>• Reserva vuelos con anticipación</li>
                  <li>• Considera hospedaje compartido</li>
                  <li>• Aprovecha descuentos estudiantiles</li>
                  <li>• Viaja en temporadas medias</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
