
'use client';

import Image from 'next/image';
import { MapPin, Calendar, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatMonthYear } from '@/lib/dates';
import { TravelSelection } from '@/lib/store';

interface TravelSummaryProps {
  selection: TravelSelection;
  className?: string;
}

export function TravelSummary({ selection, className }: TravelSummaryProps) {
  const { country, countryData, duration, startMonth, startYear, numberOfEvents } = selection;
  
  if (!country) {
    return null;
  }
  
  const imageUrl = countryData?.imageUrl || 'https://cdn.abacus.ai/images/1e243cf5-38b6-459e-b0d2-f8ab7e1149f8.png';
  const departureDate = formatMonthYear(startMonth, startYear);
  
  return (
    <Card className={`overflow-hidden ${className || ''}`}>
      <CardContent className="p-0">
        <div className="flex items-center space-x-4 p-4">
          {/* Imagen del país */}
          <div className="relative w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={imageUrl}
              alt={`Imagen de ${country}`}
              fill
              className="object-cover"
              onError={(e) => {
                // Fallback a imagen genérica en caso de error
                e.currentTarget.src = 'https://cdn.abacus.ai/images/1e243cf5-38b6-459e-b0d2-f8ab7e1149f8.png';
              }}
            />
          </div>
          
          {/* Información del viaje */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-[#00CF0C]" />
              <span className="font-semibold text-gray-900">{country}</span>
              {countryData?.currencyCode && (
                <span className="text-sm text-gray-500">({countryData.currencyCode})</span>
              )}
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{duration} días</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{departureDate}</span>
              </div>
              
              {numberOfEvents > 0 && (
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3" />
                  <span>{numberOfEvents} eventos</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
