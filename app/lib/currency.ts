
// Utilidades para formateo de monedas

export function formatCurrency(amount: number, locale: string = 'es-MX', currency: string = 'MXN'): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  } catch (error) {
    // Fallback para códigos de moneda no reconocidos
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
}

export function formatMxn(amount: number): string {
  return formatCurrency(amount, 'es-MX', 'MXN');
}

export function formatLocal(amount: number, currencyCode: string): string {
  // Mapeo de códigos ISO a locales apropiados
  const currencyLocales: Record<string, string> = {
    'USD': 'en-US',
    'EUR': 'es-ES',
    'GBP': 'en-GB',
    'JPY': 'ja-JP',
    'CAD': 'en-CA',
    'AUD': 'en-AU',
    'CHF': 'de-CH',
    'ARS': 'es-AR',
    'CLP': 'es-CL',
    'COP': 'es-CO'
  };
  
  const locale = currencyLocales[currencyCode] || 'es-MX';
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  } catch (error) {
    // Fallback si el código no es reconocido
    return `${amount.toLocaleString('es-MX', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })} ${currencyCode}`;
  }
}

export function convertToLocal(amountMxn: number, exchangeRate: number): number {
  return amountMxn / exchangeRate;
}

export function convertToMxn(amountLocal: number, exchangeRate: number): number {
  return amountLocal * exchangeRate;
}

export function formatAmount(amount: number, decimals: number = 0): string {
  return amount.toLocaleString('es-MX', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

// Función para crear el texto de moneda local (ej: "≈ 350 EUR")
export function formatLocalEquivalent(amountLocal: number, currencyCode: string): string {
  const formatted = formatAmount(amountLocal);
  return `≈ ${formatted} ${currencyCode}`;
}
