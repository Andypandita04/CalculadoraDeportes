
'use client';

import { Globe, MapPin } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCountriesData } from '@/hooks/use-countries-data';
import { useAppStore } from '@/lib/store';

interface CountrySelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function CountrySelect({ value, onValueChange, placeholder = "Selecciona un país" }: CountrySelectProps) {
  const { countries, isLoading, error } = useCountriesData();
  
  if (isLoading) {
    return (
      <div className="flex items-center space-x-3 h-12 px-4 bg-gray-100 rounded-xl animate-pulse">
        <Globe className="h-4 w-4 text-gray-400" />
        <span className="text-sm text-gray-500">Cargando países...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center space-x-3 h-12 px-4 bg-red-50 border border-red-200 rounded-xl">
        <Globe className="h-4 w-4 text-red-500" />
        <span className="text-sm text-red-600">Error cargando países</span>
      </div>
    );
  }
  
  // Agrupar países por continente para mejor UX
  const continents = countries?.reduce?.((acc, country) => {
    const continent = country?.continent || 'Otros';
    if (!acc[continent]) {
      acc[continent] = [];
    }
    acc[continent].push(country);
    return acc;
  }, {} as Record<string, typeof countries>) || {};
  
  return (
    <Select value={value || ""} onValueChange={(val) => onValueChange(val)}>
      <SelectTrigger className="w-full">
        <div className="flex items-center space-x-3">
          <Globe className="h-4 w-4 text-[#00CF0C]" />
          <SelectValue placeholder={placeholder} />
        </div>
      </SelectTrigger>
      <SelectContent>
        
        {Object?.entries?.(continents)?.map?.(([continent, countriesInContinent]) => (
          <div key={continent}>
            <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {continent}
            </div>
            {countriesInContinent?.map?.((country) => (
              <SelectItem key={country?.country || 'unknown'} value={country?.country || 'unknown'}>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-3 w-3 text-gray-400" />
                  <span>{country?.country || 'País desconocido'}</span>
                  <span className="text-gray-400 text-xs">({country?.currencyCode || 'N/A'})</span>
                </div>
              </SelectItem>
            )) || []}
          </div>
        )) || []}
        

      </SelectContent>
    </Select>
  );
}
