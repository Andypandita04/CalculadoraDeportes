
'use client';

import { Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAvailableMonths, getAvailableYears } from '@/lib/dates';

interface DatePickerProps {
  selectedMonth: number;
  selectedYear: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

export function DatePicker({ selectedMonth, selectedYear, onMonthChange, onYearChange }: DatePickerProps) {
  const months = getAvailableMonths();
  const years = getAvailableYears();
  
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Mes</label>
        <Select 
          value={selectedMonth?.toString?.()} 
          onValueChange={(val) => onMonthChange(parseInt(val))}
        >
          <SelectTrigger>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-[#00CF0C]" />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            {months?.map?.((month) => (
              <SelectItem key={month?.value} value={month?.value?.toString?.()}>
                {month?.label}
              </SelectItem>
            )) || []}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Año</label>
        <Select 
          value={selectedYear?.toString?.()} 
          onValueChange={(val) => onYearChange(parseInt(val))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {years?.map?.((year) => (
              <SelectItem key={year} value={year?.toString?.()}>
                {year}
              </SelectItem>
            )) || []}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
