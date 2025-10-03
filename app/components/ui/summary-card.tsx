
'use client';

import Image from 'next/image';
import { MapPin, Clock, Calendar } from 'lucide-react';
import { Destination } from '@/lib/types';
import { formatStartDate } from '@/lib/dates';

interface SummaryCardProps {
  destination?: Destination | null;
  otherCountry?: string;
  weeks: number;
  month: number;
  year: number;
  className?: string;
  compact?: boolean;
}

export function SummaryCard({
  destination,
  otherCountry,
  weeks,
  month,
  year,
  className = '',
  compact = false
}: SummaryCardProps) {
  const countryName = destination?.country || otherCountry || '';
  const hasValidDate = month > 0 && year > 0;
  const hasValidWeeks = weeks > 0;
  
  if (!countryName && !hasValidWeeks && !hasValidDate) {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden ${className}`}>
      {/* Imagen del país */}
      {destination?.imageUrl && !compact && (
        <div className="relative h-32 bg-gray-200">
          <Image
            src={destination.imageUrl}
            alt={`Imagen de ${destination.country}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      )}

      <div className={compact ? 'p-4' : 'p-6'}>
        <h3 className={`font-semibold text-gray-900 mb-4 ${compact ? 'text-base' : 'text-lg'}`}>
          Resumen de tu viaje
        </h3>

        <div className="space-y-3">
          {/* Destino */}
          {countryName && (
            <div className="flex items-center text-gray-700">
              <MapPin className={`${compact ? 'h-4 w-4' : 'h-5 w-5'} text-primary mr-3`} />
              <div>
                <span className="font-medium">{countryName}</span>
                {destination?.city && (
                  <span className="text-sm text-gray-500 ml-2">({destination.city})</span>
                )}
                {destination?.currency?.symbol && (
                  <span className="text-xs text-gray-500 ml-2 bg-gray-100 px-2 py-1 rounded">
                    {destination.currency.symbol}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Duración */}
          {hasValidWeeks && (
            <div className="flex items-center text-gray-700">
              <Clock className={`${compact ? 'h-4 w-4' : 'h-5 w-5'} text-primary mr-3`} />
              <span>
                <span className="font-medium">{weeks}</span> semana{weeks !== 1 ? 's' : ''}
                {weeks >= 4 && (
                  <span className="text-sm text-gray-500 ml-2">
                    ({Math.round(weeks / 4)} mes{Math.round(weeks / 4) !== 1 ? 'es' : ''} aprox.)
                  </span>
                )}
              </span>
            </div>
          )}

          {/* Fecha de inicio */}
          {hasValidDate && (
            <div className="flex items-center text-gray-700">
              <Calendar className={`${compact ? 'h-4 w-4' : 'h-5 w-5'} text-primary mr-3`} />
              <span>
                Inicio en <span className="font-medium">{formatStartDate(month, year)}</span>
              </span>
            </div>
          )}
        </div>

        {/* Badge de completado */}
        {countryName && hasValidWeeks && hasValidDate && (
          <div className="mt-4 inline-flex items-center px-3 py-1 bg-primary bg-opacity-10 text-primary text-sm font-medium rounded-full">
            ✓ Información completa
          </div>
        )}
      </div>
    </div>
  );
}
