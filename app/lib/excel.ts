
import * as XLSX from 'xlsx';
import { Currency, Destination, ExcelData } from './types';

// Configuración de transferencia internacional por defecto
const DEFAULT_TRANSFER_COST_MXN = 200;

export async function parseExcelData(filePath: string): Promise<ExcelData> {
  const workbook = XLSX.readFile(filePath);
  
  // Parsear hoja de tipos de cambio
  const currencies = parseCurrenciesSheet(workbook);
  
  // Parsear hojas de continentes
  const destinations = parseDestinationsSheets(workbook, currencies);
  
  return {
    currencies,
    destinations
  };
}

function parseCurrenciesSheet(workbook: XLSX.WorkBook): Currency[] {
  const sheet = workbook.Sheets['TiposDeCambios'];
  if (!sheet) throw new Error('Hoja TiposDeCambios no encontrada');
  
  const data = XLSX.utils.sheet_to_json(sheet);
  const currencies: Currency[] = [];
  
  for (const row of data as any[]) {
    const symbol = row['Moneda'] || row['Código ISO'];
    const isoCode = row['Código ISO'];
    const realRate = parseFloat(row['TipoCambioReal ($MXN por c/u)']) || 0;
    const paddedRate = parseFloat(row['TipoCambioAcolchonado']) || realRate;
    
    if (symbol && isoCode && realRate > 0) {
      currencies.push({
        id: generateId(),
        symbol,
        isoCode,
        realExchangeRate: realRate,
        paddedRate: paddedRate
      });
    }
  }
  
  return currencies;
}

function parseDestinationsSheets(workbook: XLSX.WorkBook, currencies: Currency[]): Destination[] {
  const continentSheets = ['USA_CANADA', 'Europa', 'Asia', 'Oceania', 'Sudamerica'];
  const destinations: Destination[] = [];
  
  for (const sheetName of continentSheets) {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) continue;
    
    const data = XLSX.utils.sheet_to_json(sheet);
    
    for (const row of data as any[]) {
      const currencySymbol = row['Divisa'];
      const currency = currencies.find(c => c.symbol === currencySymbol);
      
      if (!currency || !row['País']) continue;
      
      const destination: Destination = {
        id: generateId(),
        continent: row['Continente'] || '',
        country: row['País'] || '',
        city: row['Ciudad'] || null,
        currencyId: currency.id,
        realExchangeRate: parseFloat(row['Tipo de cambio (Real)']) || currency.realExchangeRate,
        paddedExchangeRate: parseFloat(row['Tipo de cambio (Acolchonado)']) || currency.paddedRate,
        imageUrl: row['URL de imagen'] || row['URL de la imagen'] || null,
        
        // Costos por categoría
        housingCost: parseFloat(row['Costo de hospedaje mensual (Moneda local)']) || 0,
        foodCost: parseFloat(row['Costo de comida mensual (Moneda local)']) || 0,
        transportCost: parseFloat(row['Costo de transporte mensual (Moneda local)'] || row['Costo de transportación mensual (Moneda local)']) || 0,
        entertainmentCost: parseFloat(row['Costo por Entretenimiento mensual (Moneda local)']) || 0,
        insuranceCost: parseFloat(row['Costo de seguros, trámites, visas y permisos al mes (Moneda local)']) || 0,
        flightCost: parseFloat(row['Costo de vuelo ida y vuelta (Moneda local)']) || 0,
        communicationCost: parseFloat(row['Costo de comunicaciones (SIM local/wifi portatil) (Moneda local)']) || 0,
        activitiesCost: parseFloat(row['Costos de Actividades turísticas (Moneda local)']) || 0,
        extrasCost: parseFloat(row['Costos de Extras: recuerdos, ropa, farmacia (Moneda local)']) || 0,
        contingencyPercent: parseFloat(row['Colchón de imprevistos (10%)']) || 0,
        bankFeesCost: parseFloat(row['Costo promedio de uso de cuenta o tarjetas nacionales (fees, retiros) (Moneda local)']) || 0,
        
        // Totales calculados
        totalMonthlyLocal: parseFloat(row['Total mensual (Moneda local)']) || 0,
        totalMonthlyMxnReal: parseFloat(row['Total mensual (MXN con TC Real)']) || 0,
        totalMonthlyMxnPadded: parseFloat(row['Total mensual (MXN con TC Acolchonado)']) || 0,
        
        currency
      };
      
      destinations.push(destination);
    }
  }
  
  return destinations;
}

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Función utilitaria para obtener el costo de transferencia configurado
export function getTransferCostMxn(): number {
  return DEFAULT_TRANSFER_COST_MXN;
}
