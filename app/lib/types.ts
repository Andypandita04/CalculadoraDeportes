
export interface PageProps {
  params: { [key: string]: string | string[] | undefined };
  searchParams: { [key: string]: string | string[] | undefined };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UsageEventData {
  eventType: 'page_view' | 'calculation_started' | 'calculation_completed' | 'form_submitted';
  eventPage?: string;
  sessionId?: string;
  eventPayload?: Record<string, any>;
}

export interface OneOffCostEstimates {
  flights: number; // Vuelos ida y vuelta en MXN
  dataWifi: number; // Paquetes de datos y WiFi en MXN
  eventTickets: number; // Costo promedio por evento * número de eventos
  insuranceVisa: number; // Seguros y trámites en MXN
  bebidasEvento: number; // Bebidas y comida dentro del evento en MXN
  souvenirs: number; // Souvenirs en MXN
}

// Configuración por país para costos únicos (puede expandirse)
export interface CountryOneOffCosts {
  country: string;
  flightCostMXN: number;
  dataWifiCostMXN: number;
  avgEventTicketCostMXN: number;
  insuranceVisaCostMXN: number;
}

// Constantes de configuración
export const DEFAULT_ONE_OFF_COSTS: CountryOneOffCosts = {
  country: 'default',
  flightCostMXN: 8500, // Vuelo promedio internacional
  dataWifiCostMXN: 800, // Plan de datos internacional por semana
  avgEventTicketCostMXN: 1200, // Boleto promedio evento deportivo
  insuranceVisaCostMXN: 1500 // Seguro de viaje + trámites
};

export const TYPICAL_TRIP_DURATIONS = [3, 5, 7, 10, 14, 21, 28];
