
'use client';

import { formatMXNAmount, getEquivalentDisplay } from '@/lib/currency';
import { cn } from '@/lib/utils';

interface MoneyTagProps {
  amountMXN: number;
  exchangeRate?: number;
  currencyCode?: string;
  showEquivalent?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'secondary';
}

export function MoneyTag({ 
  amountMXN, 
  exchangeRate, 
  currencyCode, 
  showEquivalent = true,
  className,
  size = 'md',
  variant = 'default'
}: MoneyTagProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl font-semibold'
  };
  
  const variantClasses = {
    default: 'text-gray-900',
    primary: 'text-[#00CF0C] font-semibold',
    secondary: 'text-gray-600'
  };
  
  return (
    <div className={cn('space-y-1', className)}>
      <div className={cn(sizeClasses[size], variantClasses[variant])}>
        {formatMXNAmount(amountMXN)} MXN
      </div>
      
      {showEquivalent && exchangeRate && currencyCode && (
        <div className="text-sm text-gray-500">
          {getEquivalentDisplay(amountMXN, exchangeRate, currencyCode)}
        </div>
      )}
    </div>
  );
}
