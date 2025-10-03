
export function getDaysUntilStart(startMonth: number, startYear: number): number {
  const today = new Date();
  const startDate = new Date(startYear, startMonth - 1, 1); // mes - 1 porque Date usa 0-indexing
  
  const diffTime = startDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays); // No puede ser negativo
}

export function formatMonthYear(month: number, year: number): string {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  
  return `${months[month - 1]} ${year}`;
}

export function getAvailableYears(): number[] {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 6 }, (_, i) => currentYear + i); // 2024-2029 o similar
}

export function getAvailableMonths(): Array<{ value: number; label: string }> {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  
  return months.map((label, index) => ({
    value: index + 1,
    label
  }));
}
