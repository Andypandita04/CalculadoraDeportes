
import { Destination, Benefit, BenefitCalculation } from './types';
import { calculateWeeksUntilStart } from './dates';
import { getTransferCostMxn } from './excel';

// Constantes para cálculos
const WEEKS_PER_MONTH = 4.345; // Semanas por mes
const ANNUAL_INTEREST_RATE = 0.05; // 5% anual
const CASHBACK_RATE = 0.03; // 3% cashback
const EXCHANGE_RATE_BENEFIT = 0.05; // 5% mejor tipo de cambio
const TRANSFERS_PER_MONTH = 2; // 2 transferencias por mes

export function calculateBenefits(
  destination: Destination,
  weeks: number,
  startMonth: number,
  startYear: number
): BenefitCalculation {
  const benefits: Benefit[] = [];
  
  // Cálculos base - solo costos recurrentes (sin pagos únicos)
  // Excluir: insuranceCost, flightCost, communicationCost
  const monthlyRecurringLocal = destination.housingCost + 
    destination.foodCost + 
    destination.transportCost + 
    destination.entertainmentCost + 
    destination.activitiesCost + 
    destination.extrasCost;
  
  const monthlyMxn = monthlyRecurringLocal * destination.realExchangeRate;
  const weeklyMxn = monthlyMxn / WEEKS_PER_MONTH;
  const weeklyLocal = weeklyMxn / destination.realExchangeRate;
  
  // A. Tipo de cambio 5% mejor
  const benefitA = calculateExchangeRateBenefit(
    monthlyMxn,
    weeks,
    destination
  );
  benefits.push(benefitA);
  
  // B. Rendimientos con interés compuesto 5% anual
  const benefitB = calculateInvestmentReturns(
    weeklyMxn,
    weeks,
    startMonth,
    startYear,
    destination
  );
  benefits.push(benefitB);
  
  // C. 3% cashback en categorías específicas
  const benefitC = calculateCashbackBenefit(
    destination,
    weeks
  );
  benefits.push(benefitC);
  
  // D. Transferencias gratuitas
  const benefitD = calculateFreeTransfersBenefit(
    weeks,
    destination
  );
  benefits.push(benefitD);
  
  // Totales
  const totalWeeklyMxn = benefits.reduce((sum, b) => sum + b.weeklyAmountMxn, 0);
  const totalAmountMxn = benefits.reduce((sum, b) => sum + b.totalAmountMxn, 0);
  const totalWeeklyLocal = totalWeeklyMxn / destination.realExchangeRate;
  const totalAmountLocal = totalAmountMxn / destination.realExchangeRate;
  const equivalentWeeks = totalAmountMxn / weeklyMxn;
  
  return {
    benefits,
    totalWeeklyMxn,
    totalAmountMxn,
    totalWeeklyLocal,
    totalAmountLocal,
    equivalentWeeks
  };
}

function calculateExchangeRateBenefit(
  monthlyMxn: number,
  weeks: number,
  destination: Destination
): Benefit {
  const weeklyBenefit = (monthlyMxn * EXCHANGE_RATE_BENEFIT) / WEEKS_PER_MONTH;
  const totalBenefit = weeklyBenefit * weeks;
  const weeklyLocal = weeklyBenefit / destination.realExchangeRate;
  const months = weeks / WEEKS_PER_MONTH;
  
  return {
    id: 'exchange-rate',
    title: 'Tipo de cambio más barato',
    description: `Obtén un tipo de cambio 5% mejor que el promedio del mercado durante todo tu intercambio`,
    formula: `Monto mensual × 5% × Meses de intercambio = Ahorro total en tipo de cambio`,
    weeklyAmountMxn: weeklyBenefit,
    weeklyAmountLocal: weeklyLocal,
    totalAmountMxn: totalBenefit,
    currency: destination.currency
  };
}

function calculateInvestmentReturns(
  weeklyMxn: number,
  tripWeeks: number,
  startMonth: number,
  startYear: number,
  destination: Destination
): Benefit {
  const weeksUntilStart = calculateWeeksUntilStart(startMonth, startYear);
  let interestEarned = 0;
  let weeklyBenefit = 0;
  
  if (weeksUntilStart > 0) {
    const weeklyInterestRate = ANNUAL_INTEREST_RATE / 52;
    const totalNeeded = weeklyMxn * tripWeeks;
    
    // Calcular aporte semanal necesario
    const weeklyContribution = totalNeeded / weeksUntilStart;
    
    // Calcular valor futuro con interés compuesto
    const futureValue = weeklyContribution * (
      (Math.pow(1 + weeklyInterestRate, weeksUntilStart) - 1) / weeklyInterestRate
    );
    
    // Intereses ganados
    interestEarned = futureValue - (weeklyContribution * weeksUntilStart);
    weeklyBenefit = interestEarned / tripWeeks; // Prorrateado por semanas del viaje
  }
  
  const weeklyLocal = weeklyBenefit / destination.realExchangeRate;
  
  return {
    id: 'investment-returns',
    title: 'Rendimientos por ahorro',
    description: `Genera rendimientos con interés simple del 4% anual en tu plan de ahorro`,
    formula: `Interés simple generado a la fecha de inicio del intercambio si ahorras el monto mensual desde hoy`,
    weeklyAmountMxn: weeklyBenefit,
    weeklyAmountLocal: weeklyLocal,
    totalAmountMxn: interestEarned,
    currency: destination.currency
  };
}

function calculateCashbackBenefit(
  destination: Destination,
  weeks: number
): Benefit {
  // Categorías elegibles para cashback: alimentos, transporte, entretenimiento (solo gastos recurrentes)
  const monthlyFood = destination.foodCost * destination.realExchangeRate;
  const monthlyTransport = destination.transportCost * destination.realExchangeRate;
  const monthlyEntertainment = destination.entertainmentCost * destination.realExchangeRate;
  
  const weeklyCashbackBase = (monthlyFood + monthlyTransport + monthlyEntertainment) / WEEKS_PER_MONTH;
  const weeklyBenefit = weeklyCashbackBase * CASHBACK_RATE;
  const totalBenefit = weeklyBenefit * weeks;
  const weeklyLocal = weeklyBenefit / destination.realExchangeRate;
  const months = weeks / WEEKS_PER_MONTH;
  
  return {
    id: 'cashback',
    title: '3% de cashback',
    description: 'Recibe el 3% de cashback mensual en gastos de alimentos, transporte y entretenimiento durante todo tu intercambio',
    formula: `3% × (Alimentos + Transporte + Entretenimiento) × Meses de intercambio`,
    weeklyAmountMxn: weeklyBenefit,
    weeklyAmountLocal: weeklyLocal,
    totalAmountMxn: totalBenefit,
    currency: destination.currency
  };
}

function calculateFreeTransfersBenefit(
  weeks: number,
  destination: Destination
): Benefit {
  const transferCostMxn = getTransferCostMxn();
  const transfersPerWeek = TRANSFERS_PER_MONTH / WEEKS_PER_MONTH; // ≈ 0.46
  const weeklyBenefit = transfersPerWeek * transferCostMxn;
  const totalBenefit = weeklyBenefit * weeks;
  const weeklyLocal = weeklyBenefit / destination.realExchangeRate;
  const months = weeks / WEEKS_PER_MONTH;
  const totalTransfers = Math.ceil(TRANSFERS_PER_MONTH * months);
  
  return {
    id: 'free-transfers',
    title: 'Transferencias gratuitas',
    description: 'Realiza transferencias internacionales sin comisión durante tu intercambio',
    formula: `Costo por transferencia × Número de transferencias durante el intercambio = Ahorro total`,
    weeklyAmountMxn: weeklyBenefit,
    weeklyAmountLocal: weeklyLocal,
    totalAmountMxn: totalBenefit,
    currency: destination.currency
  };
}

export function getBenefitOptions(): Array<{ value: string; label: string }> {
  return [
    { value: 'exchange-rate', label: 'Tipo de cambio 5% mejor' },
    { value: 'investment-returns', label: 'Rendimientos (5% anual)' },
    { value: 'cashback', label: '3% cashback' },
    { value: 'free-transfers', label: 'Transferencias gratuitas' }
  ];
}
