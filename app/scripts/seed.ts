
import { PrismaClient } from '@prisma/client';
import { parseExcelData } from '../lib/excel';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');
  
  try {
    // Limpiar datos existentes
    console.log('🧹 Limpiando datos existentes...');
    await prisma.tripForm.deleteMany();
    await prisma.destination.deleteMany();
    await prisma.currency.deleteMany();
    await prisma.appConfig.deleteMany();
    
    // Parsear datos del Excel
    const excelPath = path.join(process.cwd(), 'data', 'Dinamica_Presupuesto_Viajero1234566.xlsx');
    console.log('📊 Parseando archivo Excel...');
    const excelData = await parseExcelData(excelPath);
    
    // Insertar currencies
    console.log('💱 Insertando currencies...');
    const currencyPromises = excelData.currencies.map(currency =>
      prisma.currency.create({
        data: {
          symbol: currency.symbol,
          isoCode: currency.isoCode,
          realExchangeRate: currency.realExchangeRate,
          paddedRate: currency.paddedRate
        }
      })
    );
    
    const createdCurrencies = await Promise.all(currencyPromises);
    console.log(`✅ ${createdCurrencies.length} currencies insertadas`);
    
    // Crear un mapa de símbolos a IDs de currencies
    const currencyMap = new Map();
    createdCurrencies.forEach(currency => {
      currencyMap.set(currency.symbol, currency.id);
    });
    
    // Insertar destinations
    console.log('🏝️ Insertando destinations...');
    const destinationPromises = excelData.destinations.map(destination => {
      const currencyId = currencyMap.get(destination.currency.symbol);
      if (!currencyId) {
        console.warn(`⚠️ Currency no encontrada para ${destination.country}: ${destination.currency.symbol}`);
        return null;
      }
      
      return prisma.destination.create({
        data: {
          continent: destination.continent,
          country: destination.country,
          city: destination.city,
          currencyId,
          realExchangeRate: destination.realExchangeRate,
          paddedExchangeRate: destination.paddedExchangeRate,
          imageUrl: destination.imageUrl,
          housingCost: destination.housingCost,
          foodCost: destination.foodCost,
          transportCost: destination.transportCost,
          entertainmentCost: destination.entertainmentCost,
          insuranceCost: destination.insuranceCost,
          flightCost: destination.flightCost,
          communicationCost: destination.communicationCost,
          activitiesCost: destination.activitiesCost,
          extrasCost: destination.extrasCost,
          contingencyPercent: destination.contingencyPercent,
          bankFeesCost: destination.bankFeesCost,
          totalMonthlyLocal: destination.totalMonthlyLocal,
          totalMonthlyMxnReal: destination.totalMonthlyMxnReal,
          totalMonthlyMxnPadded: destination.totalMonthlyMxnPadded
        }
      });
    }).filter(promise => promise !== null);
    
    const createdDestinations = await Promise.all(destinationPromises);
    console.log(`✅ ${createdDestinations.length} destinations insertadas`);
    
    // Insertar configuraciones de la app
    console.log('⚙️ Insertando configuraciones...');
    await prisma.appConfig.createMany({
      data: [
        {
          key: 'transfer_cost_mxn',
          value: '200',
          description: 'Costo de transferencia internacional en MXN'
        },
        {
          key: 'exchange_rate_benefit_percent',
          value: '0.05',
          description: 'Porcentaje de beneficio en tipo de cambio (5%)'
        },
        {
          key: 'annual_interest_rate',
          value: '0.05',
          description: 'Tasa de interés anual para rendimientos (5%)'
        },
        {
          key: 'cashback_rate',
          value: '0.03',
          description: 'Porcentaje de cashback (3%)'
        }
      ]
    });
    
    console.log('🎉 Seed completado exitosamente!');
    
    // Mostrar estadísticas
    const totalCurrencies = await prisma.currency.count();
    const totalDestinations = await prisma.destination.count();
    const totalConfigs = await prisma.appConfig.count();
    
    console.log(`📊 Estadísticas finales:`);
    console.log(`   - Currencies: ${totalCurrencies}`);
    console.log(`   - Destinations: ${totalDestinations}`);
    console.log(`   - Configuraciones: ${totalConfigs}`);
    
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
