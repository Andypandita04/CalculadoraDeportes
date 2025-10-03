
import { Suspense } from 'react';
import { BudgetSummaryScreen } from './components/budget-summary-screen';
import { Loader2 } from 'lucide-react';

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-light flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </div>
    </div>
  );
}

export default function BudgetSummaryPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <BudgetSummaryScreen />
    </Suspense>
  );
}
