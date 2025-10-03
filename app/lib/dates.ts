
// Utilidades para cálculos de fechas

export function calculateWeeksUntilStart(startMonth: number, startYear: number): number {
  const today = new Date();
  const startDate = new Date(startYear, startMonth - 1, 1); // mes - 1 porque Date usa 0-based months
  
  const diffInMs = startDate.getTime() - today.getTime();
  const diffInWeeks = diffInMs / (1000 * 60 * 60 * 24 * 7);
  
  return Math.max(0, Math.floor(diffInWeeks));
}

export function formatStartDate(month: number, year: number): string {
  const monthNames = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  
  return `${monthNames[month - 1]} ${year}`;
}

export function getMonthOptions(): Array<{ value: number; label: string }> {
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  
  return months.map((month, index) => ({
    value: index + 1,
    label: month
  }));
}

export function getYearOptions(): Array<{ value: number; label: string }> {
  const years = [];
  const currentYear = new Date().getFullYear();
  const startYear = Math.max(2025, currentYear);
  
  for (let year = startYear; year <= 2030; year++) {
    years.push({
      value: year,
      label: year.toString()
    });
  }
  
  return years;
}

export function validateStartDate(month: number, year: number): boolean {
  const startDate = new Date(year, month - 1, 1);
  const today = new Date();
  
  // La fecha debe ser posterior a hoy y dentro del rango permitido
  return startDate > today && year >= 2025 && year <= 2030;
}
