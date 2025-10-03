
const LOCALE_ES_MX = 'es-MX';

export function formatMXN(amount: number): string {
  return new Intl.NumberFormat(LOCALE_ES_MX, {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatMXNAmount(amount: number): string {
  return new Intl.NumberFormat(LOCALE_ES_MX, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatLocalCurrency(amount: number, currencyCode: string): string {
  return new Intl.NumberFormat(LOCALE_ES_MX, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function getEquivalentDisplay(amountMXN: number, exchangeRate: number, currencyCode: string): string {
  const localAmount = amountMXN / exchangeRate;
  return `≈ ${formatLocalCurrency(localAmount, currencyCode)} ${currencyCode}`;
}

export function roundToDecimals(value: number, decimals: number = 2): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}
