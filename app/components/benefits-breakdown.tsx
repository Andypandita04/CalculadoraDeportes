
'use client';

import { 
  TrendingUp, 
  PiggyBank, 
  CreditCard, 
  ArrowRightLeft,
  Trophy
} from 'lucide-react';
import { MoneyTag } from './money-tag';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BenefitsResult, getBenefitDisplayName } from '@/lib/benefits.daily';
import { formatMXNAmount, getEquivalentDisplay, roundToDecimals } from '@/lib/currency';

interface BenefitsBreakdownProps {
  benefits: BenefitsResult;
  exchangeRate: number;
  currencyCode: string;
}

const benefitIcons = {
  A: TrendingUp,
  B: PiggyBank, 
  C: CreditCard,
  D: ArrowRightLeft
};

const benefitDescriptions = {
  A: 'Obtén un mejor tipo de cambio que los bancos tradicionales',
  B: 'Genera rendimientos mientras ahorras para tu viaje',
  C: 'Recibe cashback en tus gastos de transporte y entretenimiento',
  D: 'Evita comisiones en transferencias internacionales'
};

export function BenefitsBreakdown({ benefits, exchangeRate, currencyCode }: BenefitsBreakdownProps) {
  const benefitItems = [
    {
      type: 'A' as const,
      data: benefits?.benefitA,
      color: 'bg-green-50 text-green-700',
      iconColor: 'text-green-600'
    },
    {
      type: 'B' as const, 
      data: benefits?.benefitB,
      color: 'bg-blue-50 text-blue-700',
      iconColor: 'text-blue-600'
    },
    {
      type: 'C' as const,
      data: benefits?.benefitC, 
      color: 'bg-purple-50 text-purple-700',
      iconColor: 'text-purple-600'
    },
    {
      type: 'D' as const,
      data: benefits?.benefitD,
      color: 'bg-orange-50 text-orange-700', 
      iconColor: 'text-orange-600'
    }
  ];
  
  const totalBenefits = benefits?.totalBenefits || 0;
  const equivalentDays = roundToDecimals(benefits?.equivalentDays || 0, 2);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-[#00CF0C]" />
            <span>Beneficios disponibles</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {benefitItems?.map?.((item) => {
            const Icon = benefitIcons[item?.type];
            const displayName = getBenefitDisplayName(item?.type);
            const description = benefitDescriptions[item?.type];
            
            return (
              <div key={item?.type} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${item?.color}`}>
                    <Icon className={`h-5 w-5 ${item?.iconColor}`} />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">{displayName}</h4>
                      <div className="text-right">
                        <MoneyTag
                          amountMXN={item?.data?.totalAmount || 0}
                          exchangeRate={exchangeRate}
                          currencyCode={currencyCode}
                          size="sm"
                          variant="primary"
                        />
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600">{description}</p>
                    
                    {(item?.data?.dailyAmount || 0) > 0 && (
                      <div className="text-xs text-gray-500">
                        Por día: {formatMXNAmount(item?.data?.dailyAmount || 0)} MXN
                        {exchangeRate && currencyCode && (
                          <span className="ml-2">
                            {getEquivalentDisplay(item?.data?.dailyAmount || 0, exchangeRate, currencyCode)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          }) || []}
        </CardContent>
      </Card>
      
      {/* Total de beneficios */}
      <Card className="border-[#00CF0C] bg-gradient-to-r from-green-50 to-white">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Con estos beneficios podrías ahorrar/ganar:
              </h3>
              <MoneyTag
                amountMXN={totalBenefits}
                exchangeRate={exchangeRate}
                currencyCode={currencyCode}
                size="lg"
                variant="primary"
                className="justify-center"
              />
            </div>
            
            {equivalentDays > 0 && (
              <div className="p-4 bg-white rounded-xl shadow-sm">
                <p className="text-sm text-gray-700">
                  Este ahorro es equivalente a{' '}
                  <span className="font-bold text-[#00CF0C]">{equivalentDays} días</span>
                  {' '}del viaje
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
