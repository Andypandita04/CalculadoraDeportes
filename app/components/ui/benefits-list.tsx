
'use client';

import { BenefitCalculation } from '@/lib/types';
import { BenefitItem } from './benefit-item';

interface BenefitsListProps {
  calculation: BenefitCalculation;
  className?: string;
}

export function BenefitsList({ calculation, className = '' }: BenefitsListProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Lista vertical de beneficios */}
      <div className="space-y-6 max-w-4xl mx-auto">
        {calculation.benefits.map((benefit) => (
          <BenefitItem 
            key={benefit.id} 
            benefit={benefit}
          />
        ))}
      </div>
    </div>
  );
}
