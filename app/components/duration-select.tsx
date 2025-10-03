
'use client';

import { Calendar, Clock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { TYPICAL_TRIP_DURATIONS } from '@/lib/types';
import { useState } from 'react';

interface DurationSelectProps {
  value: number;
  onValueChange: (days: number) => void;
}

export function DurationSelect({ value, onValueChange }: DurationSelectProps) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState(value?.toString?.() || '');
  
  const handleSelectChange = (val: string) => {
    if (val === 'custom') {
      setShowCustomInput(true);
      setCustomValue(value?.toString?.() || '');
    } else {
      const numVal = parseInt(val);
      if (!isNaN(numVal) && numVal > 0) {
        onValueChange(numVal);
        setShowCustomInput(false);
      }
    }
  };
  
  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomValue(val);
    
    const numVal = parseInt(val);
    if (!isNaN(numVal) && numVal > 0) {
      onValueChange(numVal);
    }
  };
  
  if (showCustomInput) {
    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <Clock className="h-4 w-4 text-[#00CF0C]" />
          <Input
            type="number"
            min="1"
            max="365"
            value={customValue}
            onChange={handleCustomChange}
            placeholder="Ingresa número de días"
            className="flex-1"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowCustomInput(false)}
          className="text-xs text-[#00CF0C] hover:underline"
        >
          Usar opciones predefinidas
        </button>
      </div>
    );
  }
  
  const currentValueInOptions = TYPICAL_TRIP_DURATIONS.includes(value);
  
  return (
    <Select 
      value={currentValueInOptions ? value?.toString?.() : 'custom'} 
      onValueChange={handleSelectChange}
    >
      <SelectTrigger className="w-full">
        <div className="flex items-center space-x-3">
          <Calendar className="h-4 w-4 text-[#00CF0C]" />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        {TYPICAL_TRIP_DURATIONS?.map?.((days) => (
          <SelectItem key={days} value={days?.toString?.()}>
            {days} días
          </SelectItem>
        )) || []}
        <SelectItem value="custom">
          Otro (personalizado)
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
