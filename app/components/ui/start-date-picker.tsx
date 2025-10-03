
'use client';

import { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { getMonthOptions, getYearOptions, formatStartDate } from '@/lib/dates';

interface StartDatePickerProps {
  month: number;
  year: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  className?: string;
  disabled?: boolean;
}

export function StartDatePicker({
  month,
  year,
  onMonthChange,
  onYearChange,
  className = '',
  disabled = false
}: StartDatePickerProps) {
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);

  const monthOptions = getMonthOptions();
  const yearOptions = getYearOptions();

  const selectedMonth = monthOptions.find(m => m.value === month);
  const selectedYear = yearOptions.find(y => y.value === year);

  const handleMonthSelect = (monthValue: number) => {
    onMonthChange(monthValue);
    setIsMonthOpen(false);
  };

  const handleYearSelect = (yearValue: number) => {
    onYearChange(yearValue);
    setIsYearOpen(false);
  };

  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-2 gap-3">
        {/* Selector de mes */}
        <div className="relative">
          <button
            type="button"
            className={`
              w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg
              focus:ring-2 focus:ring-primary focus:border-transparent
              transition-all duration-200 flex items-center justify-between
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary cursor-pointer'}
            `}
            onClick={() => !disabled && setIsMonthOpen(!isMonthOpen)}
            disabled={disabled}
            aria-label="Selector de mes"
          >
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
              <span className={selectedMonth ? 'text-gray-900' : 'text-gray-500'}>
                {selectedMonth?.label || 'Mes'}
              </span>
            </div>
            <ChevronDown 
              className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                isMonthOpen ? 'transform rotate-180' : ''
              }`} 
            />
          </button>

          {isMonthOpen && !disabled && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsMonthOpen(false)}
              />
              <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {monthOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`
                      w-full px-4 py-3 text-left hover:bg-gray-50 
                      transition-colors duration-150 capitalize
                      ${month === option.value ? 'bg-primary bg-opacity-10 text-primary' : 'text-gray-900'}
                    `}
                    onClick={() => handleMonthSelect(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Selector de año */}
        <div className="relative">
          <button
            type="button"
            className={`
              w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg
              focus:ring-2 focus:ring-primary focus:border-transparent
              transition-all duration-200 flex items-center justify-between
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary cursor-pointer'}
            `}
            onClick={() => !disabled && setIsYearOpen(!isYearOpen)}
            disabled={disabled}
            aria-label="Selector de año"
          >
            <span className={selectedYear ? 'text-gray-900' : 'text-gray-500'}>
              {selectedYear?.label || 'Año'}
            </span>
            <ChevronDown 
              className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                isYearOpen ? 'transform rotate-180' : ''
              }`} 
            />
          </button>

          {isYearOpen && !disabled && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsYearOpen(false)}
              />
              <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {yearOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`
                      w-full px-4 py-3 text-left hover:bg-gray-50 
                      transition-colors duration-150
                      ${year === option.value ? 'bg-primary bg-opacity-10 text-primary' : 'text-gray-900'}
                    `}
                    onClick={() => handleYearSelect(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Mostrar fecha formateada si ambos valores están seleccionados */}
      {month > 0 && year > 0 && (
        <div className="mt-2 text-sm text-gray-600 text-center">
          Fecha de inicio: <span className="font-medium text-primary-dark">
            {formatStartDate(month, year)}
          </span>
        </div>
      )}
    </div>
  );
}
