
'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { CountryData, CurrencyInfo } from '@/lib/excel';

export function useCountriesData() {
  const { countries, currencies, isDataLoaded, setCountriesData } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const loadData = async () => {
    if (isDataLoaded || isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/excel');
      const result = await response.json();
      
      if (result.success) {
        setCountriesData(result.data.countries, result.data.currencies);
      } else {
        throw new Error(result.error || 'Error al cargar los datos');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error loading countries data:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadData();
  }, []);
  
  return {
    countries,
    currencies,
    isLoading,
    error,
    retry: loadData
  };
}
