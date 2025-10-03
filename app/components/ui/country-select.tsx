
'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { Destination } from '@/lib/types';

interface CountrySelectProps {
  destinations: Destination[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function CountrySelect({
  destinations = [],
  value = '',
  onChange,
  placeholder = 'Selecciona un país',
  className = '',
  disabled = false
}: CountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

  useEffect(() => {
    if (value && destinations?.length > 0) {
      const destination = destinations.find(d => d.id === value);
      setSelectedDestination(destination || null);
    } else {
      setSelectedDestination(null);
    }
  }, [value, destinations]);

  const handleSelect = (destinationId: string) => {
    onChange(destinationId);
    setIsOpen(false);
  };

  const handleOtherSelect = () => {
    onChange('other');
    setIsOpen(false);
  };

  // Agrupar destinos por continente
  const groupedDestinations = destinations?.reduce((groups, destination) => {
    const continent = destination.continent;
    if (!groups[continent]) {
      groups[continent] = [];
    }
    groups[continent].push(destination);
    return groups;
  }, {} as Record<string, Destination[]>) || {};

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        className={`
          w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg
          focus:ring-2 focus:ring-primary focus:border-transparent
          transition-all duration-200 flex items-center justify-between
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary cursor-pointer'}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-label="Selector de país"
      >
        <div className="flex items-center">
          <MapPin className="h-5 w-5 text-gray-400 mr-3" />
          <span className={selectedDestination ? 'text-gray-900' : 'text-gray-500'}>
            {value === 'other' 
              ? 'Otro país' 
              : selectedDestination?.country || placeholder
            }
          </span>
        </div>
        <ChevronDown 
          className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && !disabled && (
        <>
          {/* Overlay para cerrar el dropdown */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown menu */}
          <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {Object.entries(groupedDestinations).map(([continent, destinations]) => (
              <div key={continent} className="border-b border-gray-100 last:border-b-0">
                <div className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-50">
                  {continent}
                </div>
                {destinations.map((destination) => (
                  <button
                    key={destination.id}
                    className={`
                      w-full px-4 py-3 text-left hover:bg-gray-50 
                      transition-colors duration-150 flex items-center
                      ${value === destination.id ? 'bg-primary bg-opacity-10 text-primary' : 'text-gray-900'}
                    `}
                    onClick={() => handleSelect(destination.id)}
                  >
                    <div className="flex-1">
                      <div className="font-medium">{destination.country}</div>
                      {destination.city && (
                        <div className="text-sm text-gray-500">{destination.city}</div>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 ml-2">
                      {destination.currency?.symbol}
                    </div>
                  </button>
                ))}
              </div>
            ))}
            
            {/* Opción "Otro" */}
            <button
              className={`
                w-full px-4 py-3 text-left border-t border-gray-200 
                hover:bg-gray-50 transition-colors duration-150
                ${value === 'other' ? 'bg-primary bg-opacity-10 text-primary' : 'text-gray-900'}
              `}
              onClick={handleOtherSelect}
            >
              <div className="font-medium">Otro país</div>
              <div className="text-sm text-gray-500">No encuentro mi destino</div>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
