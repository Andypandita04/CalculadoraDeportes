
'use client';

import { TrendingUp, Percent, CreditCard, Send } from 'lucide-react';
import { Benefit } from '@/lib/types';
import { formatMxn, formatLocalEquivalent } from '@/lib/currency';

interface BenefitItemProps {
  benefit: Benefit;
  className?: string;
}

const BENEFIT_ICONS = {
  'exchange-rate': Percent,
  'investment-returns': TrendingUp,
  'cashback': CreditCard,
  'free-transfers': Send
};

const BENEFIT_ICON_COLORS = {
  'exchange-rate': 'bg-blue-100',
  'investment-returns': 'bg-green-100',
  'cashback': 'bg-gray-800',
  'free-transfers': 'bg-purple-100'
};

const BENEFIT_ICON_TEXT_COLORS = {
  'exchange-rate': 'text-blue-600',
  'investment-returns': 'text-green-600',
  'cashback': 'text-white',
  'free-transfers': 'text-purple-600'
};

export function BenefitItem({ benefit, className = '' }: BenefitItemProps) {
  const Icon = BENEFIT_ICONS[benefit.id as keyof typeof BENEFIT_ICONS] || TrendingUp;
  const iconBgColor = BENEFIT_ICON_COLORS[benefit.id as keyof typeof BENEFIT_ICON_COLORS] || 'bg-primary bg-opacity-10';
  const iconTextColor = BENEFIT_ICON_TEXT_COLORS[benefit.id as keyof typeof BENEFIT_ICON_TEXT_COLORS] || 'text-primary';

  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${className}`}>
      <div className="flex items-start space-x-4">
        {/* Icono */}
        <div className={`flex-shrink-0 w-16 h-16 ${iconBgColor} rounded-full flex items-center justify-center`}>
          <Icon className={`h-8 w-8 ${iconTextColor}`} />
        </div>
        
        {/* Contenido */}
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-lg mb-2">
            {benefit.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3">
            {benefit.description}
          </p>
          
          {/* Fórmula */}
          {benefit.formula && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-xs text-gray-600">
                <span className="font-semibold">Fórmula:</span> {benefit.formula}
              </p>
            </div>
          )}
          
          {/* Monto */}
          <div className="space-y-1">
            <div className="font-bold text-3xl text-primary">
              {formatMxn(benefit.weeklyAmountMxn)}
            </div>
            <div className="text-sm text-gray-500">
              ({formatLocalEquivalent(benefit.weeklyAmountLocal, benefit.currency.symbol)})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
