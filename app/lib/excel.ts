
import * as XLSX from 'xlsx';

export interface CountryData {
  continent: string;
  country: string;
  currencyCode: string;
  exchangeRate: number; // to MXN
  monthlyCosts: {
    hospedaje: number;
    alimentos: number;
    transporte: number;
    entretenimiento: number;
    seguros: number;
  };
  oneTimeCosts: {
    vuelo: number; // Columna L
    comunicaciones: number; // Columna M
    entradas: number; // Columna N
    bebidasEvento: number; // Columna O
    souvenirs: number; // Columna P
    feesTarjetas: number; // Columna R
  };
  monthlyTotalLocal: number;
  monthlyTotalMXN: number;
  monthlyTotalMXNWithBuffer?: number;
  imageUrl: string;
}

export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
}

export interface ExcelData {
  countries: CountryData[];
  currencies: Record<string, CurrencyInfo>;
}

export function processExcelFile(buffer: ArrayBuffer): ExcelData {
  try {
    const workbook = XLSX.read(buffer, { type: 'array' });
    const countries: CountryData[] = [];
    const currencies: Record<string, CurrencyInfo> = {};
    
    // Procesar hoja TiposDeCambios primero para mapear monedas
    if (workbook.SheetNames.includes('TiposDeCambios')) {
      const currencySheet = workbook.Sheets['TiposDeCambios'];
      const currencyData = XLSX.utils.sheet_to_json(currencySheet);
      
      currencyData.forEach((row: any) => {
        const codigo = row['Código ISO'] || row['código'] || row['Código'];
        const moneda = row['Moneda'] || row['moneda'];
        
        if (moneda && codigo) {
          currencies[codigo] = {
            code: codigo,
            symbol: moneda,
            name: row['nombre'] || moneda
          };
        }
      });
    }
    
    // Procesar las 5 hojas de continentes
    const continentSheets = workbook.SheetNames.filter(name => 
      name !== 'TiposDeCambios' && !name.startsWith('_')
    );
    
    continentSheets.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      
      // Agrupar por país para tomar promedio de costos (ya que hay múltiples ciudades por país)
      const countryGroups: Record<string, any[]> = {};
      
      data.forEach((row: any) => {
        const countryName = row['País'] || row['País '];
        if (countryName) {
          if (!countryGroups[countryName]) {
            countryGroups[countryName] = [];
          }
          countryGroups[countryName].push(row);
        }
      });
      
      // Procesar cada país (promediando costos de sus ciudades)
      Object.keys(countryGroups).forEach(countryName => {
        const cityRows = countryGroups[countryName];
        const firstRow = cityRows[0]; // Para datos básicos del país
        
        try {
          // Calcular promedios de costos mensuales en moneda local
          const avgCosts = {
            hospedaje: cityRows.reduce((sum, row) => sum + (parseFloat(row['Costo de hospedaje mensual (Moneda local)']) || 0), 0) / cityRows.length,
            alimentos: cityRows.reduce((sum, row) => sum + (parseFloat(row['Costo de comida mensual (Moneda local)']) || 0), 0) / cityRows.length,
            transporte: cityRows.reduce((sum, row) => sum + (parseFloat(row['Costo de transportación mensual (Moneda local)']) || 0), 0) / cityRows.length,
            entretenimiento: cityRows.reduce((sum, row) => sum + (parseFloat(row['Costo por Entretenimiento mensual (Moneda local)']) || 0), 0) / cityRows.length,
            seguros: cityRows.reduce((sum, row) => sum + (parseFloat(row['Costo de seguros, trámites, visas y permisos al mes (Moneda local)']) || 0), 0) / cityRows.length
          };
          
          // Calcular promedios de costos únicos en moneda local
          const avgOneTimeCosts = {
            vuelo: cityRows.reduce((sum, row) => sum + (parseFloat(row['Costo de vuelo ida y vuelta (Moneda local)']) || 0), 0) / cityRows.length,
            comunicaciones: cityRows.reduce((sum, row) => sum + (parseFloat(row['Costo de comunicaciones (SIM local/wifi portatil) (Moneda local)']) || 0), 0) / cityRows.length,
            entradas: cityRows.reduce((sum, row) => sum + (parseFloat(row['Costo Entradas (Moneda local)']) || 0), 0) / cityRows.length,
            bebidasEvento: cityRows.reduce((sum, row) => sum + (parseFloat(row['Costo Bebidas y comida dentro del evento (Moneda local)']) || 0), 0) / cityRows.length,
            souvenirs: cityRows.reduce((sum, row) => sum + (parseFloat(row['Costo Souvenirs o merchandising oficial (Moneda local)']) || 0), 0) / cityRows.length,
            feesTarjetas: cityRows.reduce((sum, row) => sum + (parseFloat(row['Costo promedio de uso de cuenta o tarjetas nacionales (fees, retiros) (Moneda local)']) || 0), 0) / cityRows.length
          };
          
          const exchangeRate = parseFloat(firstRow['Tipo de cambio (Real)']) || 1;
          const avgMonthlyLocal = cityRows.reduce((sum, row) => sum + (parseFloat(row['Total mensual (Moneda local)']) || 0), 0) / cityRows.length;
          const avgMonthlyMXN = avgMonthlyLocal * exchangeRate;
          
          const countryData: CountryData = {
            continent: firstRow['Continente'] || sheetName,
            country: countryName,
            currencyCode: firstRow['Divisa'] || 'USD',
            exchangeRate: exchangeRate,
            monthlyCosts: avgCosts,
            oneTimeCosts: avgOneTimeCosts,
            monthlyTotalLocal: avgMonthlyLocal,
            monthlyTotalMXN: avgMonthlyMXN,
            monthlyTotalMXNWithBuffer: parseFloat(firstRow['Total mensual (MXN con TC Acolchonado)']) || undefined,
            imageUrl: firstRow['URL de imagen'] || ''
          };
          
          // Validar que el país no exista ya para evitar duplicados
          if (!countries.find(c => c.country === countryData.country)) {
            countries.push(countryData);
          }
        } catch (error) {
          console.warn(`Error processing country ${countryName} in ${sheetName}:`, error);
        }
      });
    });
    

    
    return { countries, currencies };
  } catch (error) {
    console.error('Error processing Excel file:', error);
    throw new Error('Error al procesar el archivo Excel. Verifique el formato.');
  }
}

export function getDailyCosts(monthlyMXN: number) {
  return monthlyMXN / 30.437; // Promedio días/mes según especificaciones
}

export function getLocalEquivalent(amountMXN: number, exchangeRate: number) {
  return amountMXN / exchangeRate;
}
