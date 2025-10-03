
'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { CalculationResults } from '@/lib/store';

export function useCalculations() {
  const { 
    travelSelection, 
    setCalculationResults, 
    calculationResults,
    sessionId 
  } = useAppStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOtherCountry, setIsOtherCountry] = useState(false);
  
  const calculateBudget = async (): Promise<CalculationResults | null> => {
    const { country, countryData, duration, startMonth, startYear, numberOfEvents } = travelSelection;
    
    if (!country || !duration) {
      setError('Faltan datos para realizar el cálculo');
      return null;
    }

    // Verificar que tengamos los datos del país
    if (!countryData) {
      setError('No se encontraron datos para el país seleccionado. Por favor, intenta de nuevo.');
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    setIsOtherCountry(false);
    
    try {
      const response = await fetch('/api/calculations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          country,
          countryData,
          duration,
          startMonth,
          startYear,
          numberOfEvents,
          sessionId
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setCalculationResults(result.data);
        return result.data;
      } else {
        if (result.isOtherCountry) {
          setIsOtherCountry(true);
        }
        throw new Error(result.error || 'Error al calcular el presupuesto');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error calculating budget:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    calculateBudget,
    calculationResults,
    isLoading,
    error,
    isOtherCountry
  };
}
