
'use client';

import { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

interface WeeksInputProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  disabled?: boolean;
}

const WEEK_OPTIONS = [
  { value: 1, label: '1 semana' },
  { value: 2, label: '2 semanas' },
  { value: 4, label: '1 mes (4 semanas)' },
  { value: 8, label: '2 meses (8 semanas)' },
  { value: 12, label: '3 meses (12 semanas)' },
  { value: 24, label: '6 meses (24 semanas)' },
  { value: 48, label: '1 año (48 semanas)' }
];

export function WeeksInput({
  value,
  onChange,
  className = '',
  disabled = false
}: WeeksInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const selectedOption = WEEK_OPTIONS.find(option => option.value === value);
  const isCustomValue = !selectedOption && value > 0;

  const handleOptionSelect = (optionValue: number) => {
    onChange(optionValue);
    setIsOpen(false);
    setShowCustomInput(false);
    setCustomValue('');
  };

  const handleCustomInput = () => {
    setShowCustomInput(true);
    setIsOpen(false);
    setCustomValue(value > 0 ? value.toString() : '');
  };

  const handleCustomSubmit = () => {
    const numValue = parseInt(customValue);
    if (numValue > 0 && numValue <= 104) { // Máximo 2 años
      onChange(numValue);
      setShowCustomInput(false);
    }
  };

  const handleCustomKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCustomSubmit();
    } else if (e.key === 'Escape') {
      setShowCustomInput(false);
      setCustomValue('');
    }
  };

  return (
    <div className={`relative ${className}`}>
      {showCustomInput ? (
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="number"
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              onKeyDown={handleCustomKeyPress}
              onBlur={handleCustomSubmit}
              placeholder="Número de semanas"
              min="1"
              max="104"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              autoFocus
            />
          </div>
          <button
            type="button"
            onClick={handleCustomSubmit}
            className="px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200"
          >
            OK
          </button>
        </div>
      ) : (
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
          aria-label="Selector de duración en semanas"
        >
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-gray-400 mr-3" />
            <span className={value > 0 ? 'text-gray-900' : 'text-gray-500'}>
              {isCustomValue 
                ? `${value} semana${value !== 1 ? 's' : ''}` 
                : selectedOption?.label || 'Selecciona duración'
              }
            </span>
          </div>
          <ChevronDown 
            className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            }`} 
          />
        </button>
      )}

      {isOpen && !disabled && !showCustomInput && (
        <>
          {/* Overlay para cerrar el dropdown */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown menu */}
          <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {WEEK_OPTIONS.map((option) => (
              <button
                key={option.value}
                className={`
                  w-full px-4 py-3 text-left hover:bg-gray-50 
                  transition-colors duration-150
                  ${value === option.value ? 'bg-primary bg-opacity-10 text-primary' : 'text-gray-900'}
                `}
                onClick={() => handleOptionSelect(option.value)}
              >
                {option.label}
              </button>
            ))}
            
            {/* Opción personalizada */}
            <button
              className="w-full px-4 py-3 text-left border-t border-gray-200 hover:bg-gray-50 transition-colors duration-150 text-primary font-medium"
              onClick={handleCustomInput}
            >
              Otra duración...
            </button>
          </div>
        </>
      )}
    </div>
  );
}
