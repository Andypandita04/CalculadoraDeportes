
// Tipos TypeScript para la aplicación

export interface Currency {
  id: string;
  symbol: string;
  isoCode: string;
  realExchangeRate: number;
  paddedRate: number;
}

export interface Destination {
  id: string;
  continent: string;
  country: string;
  city?: string | null;
  currencyId: string;
  realExchangeRate: number;
  paddedExchangeRate: number;
  imageUrl?: string | null;
  
  // Costos mensuales en moneda local
  housingCost: number;
  foodCost: number;
  transportCost: number;
  entertainmentCost: number;
  insuranceCost: number;
  flightCost: number;
  communicationCost: number;
  activitiesCost: number;
  extrasCost: number;
  contingencyPercent: number;
  bankFeesCost: number;
  
  // Totales calculados
  totalMonthlyLocal: number;
  totalMonthlyMxnReal: number;
  totalMonthlyMxnPadded: number;
  
  currency: Currency;
}

export interface TripForm {
  id?: string;
  continente: string;
  pais: string;
  semanasDuracion: number;
  mes: number;
  anio: number;
  montoTotal: number;
  ahorroTotal: number;
  beneficioPreferido: string;
  nombre: string;
  correoElectronico: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface temporal para mantener compatibilidad durante el proceso de carga inicial
export interface TripFormDraft {
  destinationId?: string | null;
  otherCountry?: string | null;
  weeks: number;
  startMonth: number;
  startYear: number;
  destination?: Destination | null;
}

export interface Benefit {
  id: string;
  title: string;
  description: string;
  formula?: string;
  weeklyAmountMxn: number;
  weeklyAmountLocal: number;
  totalAmountMxn: number;
  currency: Currency;
}

export interface BenefitCalculation {
  benefits: Benefit[];
  totalWeeklyMxn: number;
  totalAmountMxn: number;
  totalWeeklyLocal: number;
  totalAmountLocal: number;
  equivalentWeeks: number;
}

export interface ExcelData {
  currencies: Currency[];
  destinations: Destination[];
}
