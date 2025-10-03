
'use client';

import { Trophy, TrendingUp } from 'lucide-react';
import { BenefitCalculation } from '@/lib/types';
import { formatMxn, formatLocalEquivalent } from '@/lib/currency';

interface SavingsTotalProps {
  calculation: BenefitCalculation;
  className?: string;
}

export function SavingsTotal({ calculation, className = '' }: SavingsTotalProps) {
  const firstBenefit = calculation.benefits[0];
  const currencySymbol = firstBenefit?.currency?.symbol || 'USD';

  return (
    <div className={`bg-gradient-primary rounded-xl p-8 text-white ${className}`}>
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
          <Trophy className="h-8 w-8 text-white" />
        </div>

        <h2 className="text-2xl font-bold mb-2">
          Con estos beneficios podrías ahorrar/ganar:
        </h2>

        {/* Total del periodo completo */}
        <div className="mb-6">
          <div className="text-4xl font-bold mb-2">
            {formatMxn(calculation.totalAmountMxn)} MXN
          </div>
          <div className="text-green-100 text-lg">
            {formatLocalEquivalent(calculation.totalAmountLocal, currencySymbol)}
          </div>
        </div>

        {/* Equivalencia en semanas del viaje */}
        <div className="bg-white bg-opacity-10 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="h-5 w-5 mr-2" />
            <span className="font-semibold">Equivalencia</span>
          </div>
          <p className="text-green-100">
            Este ahorro es equivalente a{' '}
            <span className="font-bold text-white">
              {calculation.equivalentWeeks.toFixed(1)} semanas
            </span>{' '}
            del viaje
          </p>
        </div>

        {/* Total semanal */}
        <div className="text-center bg-white bg-opacity-10 rounded-lg p-4">
          <div className="text-sm text-green-100 mb-1">Ahorro semanal promedio</div>
          <div className="font-semibold text-lg">
            {formatMxn(calculation.totalWeeklyMxn)} MXN por semana
          </div>
          <div className="text-sm text-green-100">
            {formatLocalEquivalent(calculation.totalWeeklyLocal, currencySymbol)}
          </div>
        </div>
      </div>
    </div>
  );
}
