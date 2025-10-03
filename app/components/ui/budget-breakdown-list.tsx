
'use client';

import { 
  Home, 
  UtensilsCrossed, 
  Car, 
  Gamepad2, 
  Shield, 
  Plane,
  Wifi,
  Camera,
  ShoppingBag 
} from 'lucide-react';
import { Destination } from '@/lib/types';
import { formatMxn, convertToMxn, formatLocalEquivalent } from '@/lib/currency';

interface BudgetBreakdownListProps {
  destination: Destination;
  weeks: number;
  className?: string;
  showWeekly?: boolean;
}

const CATEGORY_ICONS = {
  housing: Home,
  food: UtensilsCrossed,
  transport: Car,
  entertainment: Gamepad2,
  insurance: Shield,
  flight: Plane,
  communication: Wifi,
  activities: Camera,
  extras: ShoppingBag
};

const WEEKS_PER_MONTH = 4.345;

export function BudgetBreakdownList({
  destination,
  weeks,
  className = '',
  showWeekly = true
}: BudgetBreakdownListProps) {
  // Calcular costos semanales/mensuales para categorías RECURRENTES (sin pagos únicos)
  const weeklyCategories = [
    {
      id: 'housing',
      name: 'Hospedaje',
      icon: CATEGORY_ICONS.housing,
      monthlyLocal: destination.housingCost,
      monthlyMxn: convertToMxn(destination.housingCost, destination.realExchangeRate)
    },
    {
      id: 'food',
      name: 'Alimentos',
      icon: CATEGORY_ICONS.food,
      monthlyLocal: destination.foodCost,
      monthlyMxn: convertToMxn(destination.foodCost, destination.realExchangeRate)
    },
    {
      id: 'transport',
      name: 'Transporte',
      icon: CATEGORY_ICONS.transport,
      monthlyLocal: destination.transportCost,
      monthlyMxn: convertToMxn(destination.transportCost, destination.realExchangeRate)
    },
    {
      id: 'entertainment',
      name: 'Entretenimiento',
      icon: CATEGORY_ICONS.entertainment,
      monthlyLocal: destination.entertainmentCost,
      monthlyMxn: convertToMxn(destination.entertainmentCost, destination.realExchangeRate)
    },
    {
      id: 'activities',
      name: 'Actividades turísticas',
      icon: CATEGORY_ICONS.activities,
      monthlyLocal: destination.activitiesCost,
      monthlyMxn: convertToMxn(destination.activitiesCost, destination.realExchangeRate)
    },
    {
      id: 'extras',
      name: 'Extras',
      icon: CATEGORY_ICONS.extras,
      monthlyLocal: destination.extrasCost,
      monthlyMxn: convertToMxn(destination.extrasCost, destination.realExchangeRate)
    }
  ];

  // Categorías de PAGOS ÚNICOS (no se multiplican por semanas)
  const oneTimeCategories = [
    {
      id: 'flight',
      name: 'Vuelo de ida y vuelta',
      icon: CATEGORY_ICONS.flight,
      amountLocal: destination.flightCost,
      amountMxn: convertToMxn(destination.flightCost, destination.realExchangeRate)
    },
    {
      id: 'communication',
      name: 'Costo paquetes de datos y WiFi',
      icon: CATEGORY_ICONS.communication,
      amountLocal: destination.communicationCost,
      amountMxn: convertToMxn(destination.communicationCost, destination.realExchangeRate)
    },
    {
      id: 'insurance',
      name: 'Costo por seguros y trámites',
      icon: CATEGORY_ICONS.insurance,
      amountLocal: destination.insuranceCost,
      amountMxn: convertToMxn(destination.insuranceCost, destination.realExchangeRate)
    }
  ];

  // Filtrar categorías con costo > 0
  const validWeeklyCategories = weeklyCategories.filter(cat => cat.monthlyLocal > 0);
  const validOneTimeCategories = oneTimeCategories.filter(cat => cat.amountLocal > 0);

  // Calcular totales semanales (sin pagos únicos)
  const weeklyTotalLocal = validWeeklyCategories.reduce((sum, cat) => sum + (cat.monthlyLocal / WEEKS_PER_MONTH), 0);
  const weeklyTotalMxn = validWeeklyCategories.reduce((sum, cat) => sum + (cat.monthlyMxn / WEEKS_PER_MONTH), 0);

  // Calcular totales únicos
  const oneTimeTotalLocal = validOneTimeCategories.reduce((sum, cat) => sum + cat.amountLocal, 0);
  const oneTimeTotalMxn = validOneTimeCategories.reduce((sum, cat) => sum + cat.amountMxn, 0);

  // Total final para el viaje completo
  const tripTotalLocal = (weeklyTotalLocal * weeks) + oneTimeTotalLocal;
  const tripTotalMxn = (weeklyTotalMxn * weeks) + oneTimeTotalMxn;

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* SECCIÓN 1: Gastos semanales/mensuales */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Desglose por categoría {showWeekly ? '(semanal)' : '(mensual)'}
        </h3>

        <div className="space-y-3">
          {validWeeklyCategories.map((category) => {
            const Icon = category.icon;
            const periodLocal = showWeekly 
              ? category.monthlyLocal / WEEKS_PER_MONTH
              : category.monthlyLocal;
            const periodMxn = showWeekly 
              ? category.monthlyMxn / WEEKS_PER_MONTH
              : category.monthlyMxn;

            return (
              <div
                key={category.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center">
                  <div className="p-2 bg-primary bg-opacity-10 rounded-lg mr-4">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{category.name}</h4>
                    <p className="text-sm text-gray-500">
                      {formatLocalEquivalent(periodLocal, destination.currency.symbol)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {formatMxn(periodMxn)} MXN
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECCIÓN 2: Pagos únicos */}
      {validOneTimeCategories.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Desglose por categoría (pagos únicos)
          </h3>

          <div className="space-y-3">
            {validOneTimeCategories.map((category) => {
              const Icon = category.icon;

              return (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-500 bg-opacity-10 rounded-lg mr-4">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{category.name}</h4>
                      <p className="text-sm text-blue-600">
                        {formatLocalEquivalent(category.amountLocal, destination.currency.symbol)}
                      </p>
                      <p className="text-xs text-blue-500">Pago único (no se multiplica por semanas)</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {formatMxn(category.amountMxn)} MXN
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TOTAL GENERAL del viaje completo */}
      {weeks > 0 && (
        <div className="mt-6 p-6 bg-gradient-primary rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-xl mb-2">Total para {weeks} semana{weeks !== 1 ? 's' : ''}</h4>
              <div className="space-y-1 text-green-100 text-sm">
                <p>• Gastos semanales × {weeks}: {formatMxn(weeklyTotalMxn * weeks)} MXN</p>
                {validOneTimeCategories.length > 0 && (
                  <p>• Pagos únicos: {formatMxn(oneTimeTotalMxn)} MXN</p>
                )}
                <p className="text-green-200">
                  ≈ {formatLocalEquivalent(tripTotalLocal, destination.currency.symbol)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">
                {formatMxn(tripTotalMxn)} MXN
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
