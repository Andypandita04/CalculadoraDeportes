
import { getDaysUntilStart } from './dates';
import { CountryData } from './excel';

export interface BenefitCalculation {
  dailyAmount: number;
  totalAmount: number;
  description: string;
  type: 'A' | 'B' | 'C' | 'D';
}

export interface BenefitsResult {
  benefitA: BenefitCalculation;
  benefitB: BenefitCalculation;
  benefitC: BenefitCalculation;
  benefitD: BenefitCalculation;
  totalBenefits: number;
  equivalentDays: number;
}

const DAYS_PER_MONTH = 30.437;
const TRANSFERS_PER_DAY = 2 / DAYS_PER_MONTH; // 2 transferencias/mes = 0.0657 trans/día
const DEFAULT_TRANSFER_COST_MXN = 35; // Costo por transferencia en MXN (configurable)

export function calculateBenefits(
  countryData: CountryData,
  tripDuration: number,
  startMonth: number,
  startYear: number
): BenefitsResult {
  const { monthlyTotalMXN, monthlyCosts, exchangeRate } = countryData;
  const dailyMXN = monthlyTotalMXN / DAYS_PER_MONTH;
  const daysUntilStart = getDaysUntilStart(startMonth, startYear);
  
  // A. Tipo de cambio más barato (4% de mejora)
  const benefitA = calculateExchangeRateBenefit(monthlyTotalMXN, tripDuration);
  
  // B. Rendimientos (interés compuesto 5% anual)
  const benefitB = calculateInvestmentBenefit(dailyMXN, tripDuration, daysUntilStart);
  
  // C. 3% de cashback en categorías específicas
  const benefitC = calculateCashbackBenefit(monthlyCosts, tripDuration);
  
  // D. Transferencias gratuitas
  const benefitD = calculateTransferBenefit(tripDuration);
  
  const totalBenefits = benefitA.totalAmount + benefitB.totalAmount + 
                       benefitC.totalAmount + benefitD.totalAmount;
  
  const equivalentDays = totalBenefits / dailyMXN;
  
  return {
    benefitA,
    benefitB,
    benefitC,
    benefitD,
    totalBenefits,
    equivalentDays
  };
}

function calculateExchangeRateBenefit(monthlyMXN: number, tripDuration: number): BenefitCalculation {
  // 4% de mejora en tipo de cambio
  const dailySavings = (monthlyMXN * 0.04) / DAYS_PER_MONTH;
  const totalSavings = dailySavings * tripDuration;
  
  return {
    dailyAmount: dailySavings,
    totalAmount: totalSavings,
    description: 'Ahorro por mejor tipo de cambio (4%)',
    type: 'A'
  };
}

function calculateInvestmentBenefit(
  dailyMXN: number, 
  tripDuration: number, 
  daysUntilStart: number
): BenefitCalculation {
  if (daysUntilStart <= 0) {
    // No hay tiempo para generar intereses
    return {
      dailyAmount: 0,
      totalAmount: 0,
      description: 'Rendimientos por ahorro previo (5% anual)',
      type: 'B'
    };
  }
  
  // Interés diario del 5% anual
  const dailyInterestRate = 0.05 / 365;
  const tripTotalCost = dailyMXN * tripDuration;
  
  // Calcular aporte diario necesario para alcanzar la meta
  // VF = Aporte_día × [((1 + i)^n - 1) / i]
  // Despejando Aporte_día = VF / [((1 + i)^n - 1) / i]
  const compound = Math.pow(1 + dailyInterestRate, daysUntilStart);
  const annuityFactor = (compound - 1) / dailyInterestRate;
  const dailyContribution = tripTotalCost / annuityFactor;
  
  // Intereses totales generados
  const totalContributions = dailyContribution * daysUntilStart;
  const totalInterest = tripTotalCost - totalContributions;
  
  // Prorratear intereses por día de viaje
  const interestPerDayOfTrip = totalInterest / tripDuration;
  
  return {
    dailyAmount: interestPerDayOfTrip,
    totalAmount: totalInterest,
    description: 'Rendimientos por ahorro previo (5% anual)',
    type: 'B'
  };
}

function calculateCashbackBenefit(monthlyCosts: any, tripDuration: number): BenefitCalculation {
  // 3% cashback en transporte, entretenimiento y viajes (si existe)
  const transporteDaily = (monthlyCosts.transporte || 0) / DAYS_PER_MONTH;
  const entretenimientoDaily = (monthlyCosts.entretenimiento || 0) / DAYS_PER_MONTH;
  const viajesDaily = 0; // No está en el schema actual, se podría agregar más tarde
  
  const eligibleDailySpend = transporteDaily + entretenimientoDaily + viajesDaily;
  const dailyCashback = eligibleDailySpend * 0.03;
  const totalCashback = dailyCashback * tripDuration;
  
  return {
    dailyAmount: dailyCashback,
    totalAmount: totalCashback,
    description: '3% cashback en transporte y entretenimiento',
    type: 'C'
  };
}

function calculateTransferBenefit(tripDuration: number): BenefitCalculation {
  // Supuesto: 2 transferencias/mes → 0.0657 trans/día
  const dailyTransfers = TRANSFERS_PER_DAY;
  const dailySavings = dailyTransfers * DEFAULT_TRANSFER_COST_MXN;
  const totalSavings = dailySavings * tripDuration;
  
  return {
    dailyAmount: dailySavings,
    totalAmount: totalSavings,
    description: 'Ahorro en transferencias internacionales',
    type: 'D'
  };
}

export function getBenefitDisplayName(type: 'A' | 'B' | 'C' | 'D'): string {
  const names = {
    A: 'Tipo de cambio preferencial',
    B: 'Rendimientos por ahorro',
    C: 'Cashback en gastos',
    D: 'Transferencias gratuitas'
  };
  return names[type];
}
