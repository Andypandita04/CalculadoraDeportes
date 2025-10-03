
'use client';

export const MESSAGES = {
  es: {
    // Pantalla inicial
    'home.title': 'Calcula aquí cuánto dinero necesitarás en tu',
    'home.titleHighlight': 'viaje',
    'home.startButton': 'Comenzar',
    
    // Selección rápida
    'selection.title': 'Planifiquemos tu viaje',
    'selection.country.title': '¿A qué país viajarás?',
    'selection.country.placeholder': 'Selecciona un país',
    'selection.duration.title': '¿Cuánto tiempo durará tu viaje (en días)?',
    'selection.duration.other': 'Otro',
    'selection.date.title': '¿Desde qué fecha?',
    'selection.events.title': '¿A cuántos eventos deportivos piensas ir durante tu viaje?',
    'selection.calculateButton': 'Calcula tu presupuesto',
    'selection.summary.days': 'días',
    'selection.summary.events': 'eventos',
    'selection.summary.departure': 'Salida estimada',
    
    // Resumen presupuesto
    'budget.title': 'Para tu viaje necesitarás por día:',
    'budget.breakdown.title': 'Desglose por categoría (por día)',
    'budget.breakdown.hospedaje': 'Hospedaje',
    'budget.breakdown.alimentos': 'Alimentos',
    'budget.breakdown.transporte': 'Transporte',
    'budget.breakdown.entretenimiento': 'Entretenimiento',
    'budget.breakdown.seguros': 'Seguros/Trámites',
    'budget.breakdown.otros': 'Otros gastos',
    'budget.oneoff.title': 'Desglose por categoría (pagos únicos)',
    'budget.oneoff.flights': 'Vuelo de ida y vuelta',
    'budget.oneoff.dataWifi': 'Paquetes de datos y WiFi',
    'budget.oneoff.eventTickets': 'Costo promedio de boletos',
    'budget.oneoff.insurance': 'Seguros y trámites',
    'budget.oneoff.total': 'Total pagos únicos',
    'budget.benefitsButton': 'Ver beneficios',
    
    // Beneficios
    'benefits.title': 'Con estos beneficios podrías ahorrar/ganar:',
    'benefits.equivalentDays': 'Este ahorro es equivalente a {days} días del viaje',
    'benefits.form.title': 'Obtén tu plan de ahorro personalizado',
    'benefits.form.name': 'Nombre completo',
    'benefits.form.email': 'Correo electrónico',
    'benefits.form.preferredBenefit': 'Beneficio de tu preferencia',
    'benefits.form.submit': 'Crear plan de ahorro',
    'benefits.form.success': 'Gracias por participar, recibirás tu plan de ahorro en las próximas horas. ¡Mucho éxito en tu viaje!',
    
    // Navegación y comunes
    'common.back': 'Atrás',
    'common.next': 'Siguiente',
    'common.loading': 'Cargando...',
    'common.error': 'Ha ocurrido un error',
    'common.tryAgain': 'Intentar de nuevo',
    'common.perDay': 'por día',
    'common.total': 'Total',
    
    // Months
    'months.1': 'Enero',
    'months.2': 'Febrero', 
    'months.3': 'Marzo',
    'months.4': 'Abril',
    'months.5': 'Mayo',
    'months.6': 'Junio',
    'months.7': 'Julio',
    'months.8': 'Agosto',
    'months.9': 'Septiembre',
    'months.10': 'Octubre',
    'months.11': 'Noviembre',
    'months.12': 'Diciembre'
  }
};

export const DEFAULT_LOCALE = 'es';
export type Locale = keyof typeof MESSAGES;

// Hook para usar mensajes (será implementado con react-intl en los componentes)
export function getMessage(key: string, values?: Record<string, any>): string {
  const keys = key.split('.');
  let message: any = MESSAGES[DEFAULT_LOCALE];
  
  for (const k of keys) {
    message = message?.[k];
  }
  
  if (typeof message !== 'string') {
    return key; // Fallback a la key si no se encuentra
  }
  
  // Simple template replacement
  if (values) {
    return message.replace(/\{(\w+)\}/g, (match: string, param: string) => 
      values[param] || match
    );
  }
  
  return message;
}
