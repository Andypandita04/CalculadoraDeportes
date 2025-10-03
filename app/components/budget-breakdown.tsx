
'use client';

import { 
  Bed, 
  Utensils, 
  Car, 
  Gamepad2, 
  Shield, 
  MoreHorizontal,
  Plane,
  Wifi,
  Ticket,
  FileCheck,
  CreditCard,
  Coffee,
  ShoppingBag
} from 'lucide-react';
import { MoneyTag } from './money-tag';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/lib/store';

interface BudgetBreakdownProps {
  countryData: any;
  numberOfEvents?: number;
  exchangeRate: number;
  currencyCode: string;
}

const categoryIcons = {
  hospedaje: Bed,
  alimentos: Utensils,
  transporte: Car,
  entretenimiento: Gamepad2,
  seguros: Shield,
  feesTarjetas: CreditCard
};

const oneOffIcons = {
  flights: Plane,
  dataWifi: Wifi,
  eventTickets: Ticket,
  insurance: FileCheck,
  bebidasEvento: Coffee,
  souvenirs: ShoppingBag
};

export function BudgetBreakdown({ countryData, numberOfEvents = 1, exchangeRate, currencyCode }: BudgetBreakdownProps) {
  const { travelSelection } = useAppStore();
  const duration = travelSelection?.duration || 1;
  
  if (!countryData?.monthlyCosts || !countryData?.oneTimeCosts) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No hay datos disponibles para mostrar el desglose</p>
      </div>
    );
  }
  
  const { monthlyCosts, oneTimeCosts } = countryData;
  
  // Costos por categoría (diarios)
  // Fórmula: columna / 30 (NO multiplicamos por días aquí, solo mostramos el costo por día)
  const dailyBreakdown = [
    {
      key: 'hospedaje',
      label: 'Hospedaje',
      dailyAmountLocal: (monthlyCosts?.hospedaje || 0) / 30,
      Icon: categoryIcons.hospedaje
    },
    {
      key: 'alimentos',
      label: 'Alimentos',
      dailyAmountLocal: (monthlyCosts?.alimentos || 0) / 30,
      Icon: categoryIcons.alimentos
    },
    {
      key: 'transporte', 
      label: 'Transporte',
      dailyAmountLocal: (monthlyCosts?.transporte || 0) / 30,
      Icon: categoryIcons.transporte
    },
    {
      key: 'entretenimiento',
      label: 'Entretenimiento', 
      dailyAmountLocal: (monthlyCosts?.entretenimiento || 0) / 30,
      Icon: categoryIcons.entretenimiento
    },
    {
      key: 'feesTarjetas',
      label: 'Costos por uso de tarjetas',
      dailyAmountLocal: (oneTimeCosts?.feesTarjetas || 0) / duration, // Columna R / días del usuario
      Icon: categoryIcons.feesTarjetas
    }
  ].filter(item => (item?.dailyAmountLocal || 0) > 0);
  
  // Costos únicos (pagos únicos)
  const oneOffCosts = [
    {
      key: 'flights',
      label: 'Vuelo de ida y vuelta',
      amountLocal: oneTimeCosts?.vuelo || 0, // Columna L
      Icon: oneOffIcons.flights
    },
    {
      key: 'dataWifi',
      label: 'Paquetes de datos y WiFi',
      amountLocal: oneTimeCosts?.comunicaciones || 0, // Columna M
      Icon: oneOffIcons.dataWifi
    },
    {
      key: 'eventTickets',
      label: `Costo promedio de boletos (${numberOfEvents} ${numberOfEvents === 1 ? 'evento' : 'eventos'})`,
      amountLocal: (oneTimeCosts?.entradas || 0) * numberOfEvents, // Columna N × eventos
      Icon: oneOffIcons.eventTickets
    },
    {
      key: 'insurance',
      label: 'Seguros y trámites',
      amountLocal: monthlyCosts?.seguros || 0, // Columna K
      Icon: oneOffIcons.insurance
    },
    {
      key: 'bebidasEvento',
      label: `Costos de consumo dentro del evento`,
      amountLocal: (oneTimeCosts?.bebidasEvento || 0) * numberOfEvents, // Columna O × eventos
      Icon: oneOffIcons.bebidasEvento
    },
    {
      key: 'souvenirs',
      label: 'Costos souvenirs',
      amountLocal: oneTimeCosts?.souvenirs || 0, // Columna P
      Icon: oneOffIcons.souvenirs
    }
  ].filter(item => (item?.amountLocal || 0) > 0);
  
  const totalOneOffLocal = oneOffCosts.reduce((sum, item) => sum + (item?.amountLocal || 0), 0);
  const totalOneOffMXN = totalOneOffLocal * exchangeRate;
  
  return (
    <div className="space-y-6">
      {/* Desglose diario */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Car className="h-5 w-5 text-[#00CF0C]" />
            <span>Desglose por categoría (por día)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {dailyBreakdown?.map?.((item) => {
            const dailyAmountMXN = (item?.dailyAmountLocal || 0) * exchangeRate;
            const Icon = item?.Icon || MoreHorizontal;
            
            return (
              <div key={item?.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Icon className="h-4 w-4 text-gray-600" />
                  </div>
                  <span className="font-medium text-gray-900">{item?.label}</span>
                </div>
                
                <MoneyTag
                  amountMXN={dailyAmountMXN}
                  exchangeRate={exchangeRate}
                  currencyCode={currencyCode}
                  size="sm"
                />
              </div>
            );
          }) || []}
        </CardContent>
      </Card>
      
      {/* Pagos únicos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Plane className="h-5 w-5 text-[#007400]" />
            <span>Desglose por categoría (pagos únicos)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {oneOffCosts?.map?.((item) => {
            const Icon = item?.Icon || MoreHorizontal;
            const amountMXN = (item?.amountLocal || 0) * exchangeRate;
            
            return (
              <div key={item?.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Icon className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-900">{item?.label}</span>
                </div>
                
                <MoneyTag
                  amountMXN={amountMXN}
                  exchangeRate={exchangeRate}
                  currencyCode={currencyCode}
                  size="sm"
                  variant="secondary"
                />
              </div>
            );
          }) || []}
          
          {/* Total de pagos únicos */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#00CF0C]/10 rounded-lg">
                <FileCheck className="h-4 w-4 text-[#00CF0C]" />
              </div>
              <span className="font-semibold text-gray-900">Total pagos únicos</span>
            </div>
            
            <MoneyTag
              amountMXN={totalOneOffMXN}
              exchangeRate={exchangeRate}
              currencyCode={currencyCode}
              size="md"
              variant="primary"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
