
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { calculateBenefits } from '@/lib/benefits.daily';
import { getDailyCosts, getLocalEquivalent } from '@/lib/excel';
import { DEFAULT_ONE_OFF_COSTS } from '@/lib/types';

interface CalculationRequest {
  country: string;
  countryData: any;
  duration: number;
  startMonth: number;
  startYear: number;
  numberOfEvents: number;
  sessionId: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CalculationRequest = await request.json();
    const { country, countryData, duration, startMonth, startYear, numberOfEvents, sessionId } = body;
    
    if (!country || !duration || !sessionId) {
      return NextResponse.json({
        success: false,
        error: 'Faltan datos requeridos para el cálculo'
      }, { status: 400 });
    }

    // Verificar que tengamos los datos del país
    if (!countryData) {
      return NextResponse.json({
        success: false,
        error: 'No se encontraron datos para el país seleccionado'
      }, { status: 400 });
    }
    
    // Calcular costos diarios
    const dailyCostMXN = getDailyCosts(countryData.monthlyTotalMXN);
    const dailyCostLocal = getLocalEquivalent(dailyCostMXN, countryData.exchangeRate);
    
    // Calcular beneficios
    const benefits = calculateBenefits(countryData, duration, startMonth, startYear);
    
    // Calcular pagos únicos usando datos reales del Excel
    const oneOffCosts = {
      flights: (countryData?.oneTimeCosts?.vuelo || 0) * countryData.exchangeRate,
      dataWifi: (countryData?.oneTimeCosts?.comunicaciones || 0) * countryData.exchangeRate,
      eventTickets: (countryData?.oneTimeCosts?.entradas || 0) * numberOfEvents * countryData.exchangeRate,
      insuranceVisa: (countryData?.monthlyCosts?.seguros || 0) * countryData.exchangeRate,
      bebidasEvento: (countryData?.oneTimeCosts?.bebidasEvento || 0) * numberOfEvents * countryData.exchangeRate,
      souvenirs: (countryData?.oneTimeCosts?.souvenirs || 0) * countryData.exchangeRate
    };
    
    const results = {
      dailyCostMXN,
      dailyCostLocal,
      localCurrency: countryData.currencyCode,
      benefits,
      oneOffCosts
    };
    
    return NextResponse.json({
      success: true,
      data: results
    });
    
  } catch (error) {
    console.error('Error in calculations:', error);
    return NextResponse.json({
      success: false,
      error: 'Error al calcular el presupuesto'
    }, { status: 500 });
  }
}
