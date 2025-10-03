
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { CountrySelect } from '@/components/ui/country-select';
import { WeeksInput } from '@/components/ui/weeks-input';
import { StartDatePicker } from '@/components/ui/start-date-picker';
import { SummaryCard } from '@/components/ui/summary-card';
import { Destination } from '@/lib/types';
import { validateStartDate } from '@/lib/dates';

export function TripFormScreen() {
  const router = useRouter();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoadingDestinations, setIsLoadingDestinations] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    destinationId: '',
    otherCountry: '',
    weeks: 0,
    startMonth: 0,
    startYear: 0
  });

  const selectedDestination = destinations.find(d => d.id === formData.destinationId) || null;
  const isFormValid = 
    (formData.destinationId === 'other' ? formData.otherCountry.trim() : formData.destinationId) &&
    formData.weeks > 0 &&
    formData.startMonth > 0 &&
    formData.startYear > 0 &&
    validateStartDate(formData.startMonth, formData.startYear);

  // Cargar destinos al montar el componente
  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    try {
      setIsLoadingDestinations(true);
      const response = await fetch('/api/destinations');
      if (response.ok) {
        const data = await response.json();
        setDestinations(data);
      } else {
        console.error('Error loading destinations');
      }
    } catch (error) {
      console.error('Error loading destinations:', error);
    } finally {
      setIsLoadingDestinations(false);
    }
  };

  const handleDestinationChange = (destinationId: string) => {
    setFormData(prev => ({
      ...prev,
      destinationId,
      otherCountry: destinationId === 'other' ? prev.otherCountry : ''
    }));
  };

  const handleOtherCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      otherCountry: e.target.value
    }));
  };

  const handleWeeksChange = (weeks: number) => {
    setFormData(prev => ({ ...prev, weeks }));
  };

  const handleMonthChange = (month: number) => {
    setFormData(prev => ({ ...prev, startMonth: month }));
  };

  const handleYearChange = (year: number) => {
    setFormData(prev => ({ ...prev, startYear: year }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) return;

    try {
      setIsSubmitting(true);

      // Guardar temporalmente los datos en sessionStorage
      // Incluir el continente y país del destino seleccionado
      const tripData = {
        destinationId: formData.destinationId,
        otherCountry: formData.otherCountry,
        weeks: formData.weeks,
        startMonth: formData.startMonth,
        startYear: formData.startYear,
        continente: selectedDestination?.continent || 'Otro',
        pais: selectedDestination?.country || formData.otherCountry || 'Otro'
      };

      sessionStorage.setItem('tripDraft', JSON.stringify(tripData));
      
      // Navegar a la siguiente pantalla
      router.push('/budget-summary');
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    router.push('/quick-select');
  };

  if (isLoadingDestinations) {
    return (
      <div className="min-h-screen bg-gradient-light flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Cargando destinos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-light">
      {/* Header con botón de regreso */}
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
        {/* Título y subtítulo */}
        <div className="text-center mb-12 space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Planifica tu viaje en{' '}
            <span className="text-primary-dark">3 pasos</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Conoce cuánto dinero necesitas para tu próxima aventura y cómo ahorrar más con beneficios exclusivos
          </p>

          {/* Proceso en 3 pasos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Selecciona destino</h3>
              <p className="text-gray-600 text-sm">Elige tu país de destino y duración del viaje</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Ve tu presupuesto</h3>
              <p className="text-gray-600 text-sm">Conoce el costo detallado por categorías</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Descubre beneficios</h3>
              <p className="text-gray-600 text-sm">Obtén tu plan personalizado de ahorro</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Columna 1: Destino (33%) */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  ¿A qué país viajarás?
                </h2>
                
                <div className="space-y-4">
                  <CountrySelect
                    destinations={destinations}
                    value={formData.destinationId}
                    onChange={handleDestinationChange}
                    placeholder="Selecciona tu destino"
                  />

                  {/* Input adicional para "Otro país" */}
                  {formData.destinationId === 'other' && (
                    <div className="animate-in slide-in-from-top duration-200">
                      <input
                        type="text"
                        value={formData.otherCountry}
                        onChange={handleOtherCountryChange}
                        placeholder="Nombre del país"
                        className="form-input"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Columna 2: Tiempo y fecha (33%) */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="space-y-6">
                  {/* Duración */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      ¿Cuánto tiempo durará tu viaje?
                    </h3>
                    <WeeksInput
                      value={formData.weeks}
                      onChange={handleWeeksChange}
                    />
                  </div>

                  {/* Fecha de inicio */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      ¿Desde qué fecha?
                    </h3>
                    <StartDatePicker
                      month={formData.startMonth}
                      year={formData.startYear}
                      onMonthChange={handleMonthChange}
                      onYearChange={handleYearChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Columna 3: Resumen + CTA (33%) */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                {/* Resumen dinámico */}
                <SummaryCard
                  destination={selectedDestination}
                  otherCountry={formData.destinationId === 'other' ? formData.otherCountry : undefined}
                  weeks={formData.weeks}
                  month={formData.startMonth}
                  year={formData.startYear}
                />

                {/* CTA Button */}
                <button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className={`
                    w-full btn-primary text-lg px-6 py-4 flex items-center justify-center space-x-3
                    ${!isFormValid || isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
                    transform transition-all duration-300
                  `}
                  aria-label="Calcular presupuesto de viaje"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                      <span>Calculando...</span>
                    </>
                  ) : (
                    <>
                      <span>Calcula tu presupuesto</span>
                      <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </button>

                {/* Indicador de progreso */}
                <div className="bg-white rounded-lg p-4 border border-gray-100">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Progreso</span>
                    <span>
                      {[
                        formData.destinationId === 'other' ? formData.otherCountry.trim() : formData.destinationId,
                        formData.weeks > 0,
                        formData.startMonth > 0 && formData.startYear > 0
                      ].filter(Boolean).length} de 3
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${([
                          formData.destinationId === 'other' ? formData.otherCountry.trim() : formData.destinationId,
                          formData.weeks > 0,
                          formData.startMonth > 0 && formData.startYear > 0
                        ].filter(Boolean).length / 3) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
