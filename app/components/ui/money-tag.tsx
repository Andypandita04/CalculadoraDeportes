
'use client';

import { formatMxn, formatLocalEquivalent } from '@/lib/currency';
import { Currency } from '@/lib/types';

interface MoneyTagProps {
  amountMxn: number;
  amountLocal?: number;
  currency?: Currency;
  showLocal?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function MoneyTag({
  amountMxn,
  amountLocal,
  currency,
  showLocal = true,
  className = '',
  size = 'md'
}: MoneyTagProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg font-semibold'
  };

  const localAmount = amountLocal ?? (currency ? amountMxn / currency.realExchangeRate : 0);

  return (
    <div className={`${className}`}>
      <span className={`text-gray-900 ${sizeClasses[size]}`}>
        {formatMxn(amountMxn)} MXN
      </span>
      {showLocal && currency && (
        <div className="text-gray-500 text-sm mt-1">
          {formatLocalEquivalent(localAmount, currency.symbol)}
        </div>
      )}
    </div>
  );
}
