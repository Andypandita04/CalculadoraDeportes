
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CountryData, CurrencyInfo } from './excel';
import { BenefitsResult } from './benefits.daily';

export interface TravelSelection {
  country: string;
  countryData?: CountryData;
  duration: number;
  startMonth: number;
  startYear: number;
  numberOfEvents: number;
}

export interface FormData {
  fullName: string;
  email: string;
  preferredBenefit: 'A' | 'B' | 'C' | 'D' | '';
}

export interface CalculationResults {
  dailyCostMXN: number;
  dailyCostLocal: number;
  localCurrency: string;
  benefits?: BenefitsResult;
  oneOffCosts: {
    flights: number;
    dataWifi: number;
    eventTickets: number;
    insuranceVisa: number;
    bebidasEvento: number;
    souvenirs: number;
  };
}

interface AppStore {
  // Datos del Excel
  countries: CountryData[];
  currencies: Record<string, CurrencyInfo>;
  isDataLoaded: boolean;
  
  // Selecciones del usuario
  travelSelection: TravelSelection;
  formData: FormData;
  calculationResults?: CalculationResults;
  
  // UI Estado
  currentStep: 'home' | 'selection' | 'budget' | 'benefits' | 'form';
  sessionId: string;
  
  // Acciones
  setCountriesData: (countries: CountryData[], currencies: Record<string, CurrencyInfo>) => void;
  updateTravelSelection: (selection: Partial<TravelSelection>) => void;
  updateFormData: (data: Partial<FormData>) => void;
  setCalculationResults: (results: CalculationResults) => void;
  setCurrentStep: (step: 'home' | 'selection' | 'budget' | 'benefits' | 'form') => void;
  resetSelection: () => void;
  generateSessionId: () => void;
}

const initialTravelSelection: TravelSelection = {
  country: '',
  duration: 7,
  startMonth: new Date().getMonth() + 2, // 2 meses en el futuro por defecto
  startYear: new Date().getFullYear(),
  numberOfEvents: 1
};

const initialFormData: FormData = {
  fullName: '',
  email: '',
  preferredBenefit: ''
};

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      countries: [],
      currencies: {},
      isDataLoaded: false,
      travelSelection: initialTravelSelection,
      formData: initialFormData,
      currentStep: 'home',
      sessionId: generateId(),
      
      // Acciones
      setCountriesData: (countries, currencies) => 
        set({ countries, currencies, isDataLoaded: true }),
      
      updateTravelSelection: (selection) => {
        const current = get().travelSelection;
        const updated = { ...current, ...selection };
        
        // Si cambió el país, actualizar countryData
        if (selection.country) {
          const countryData = get().countries.find(c => c.country === selection.country);
          updated.countryData = countryData;
        }
        
        set({ travelSelection: updated });
      },
      
      updateFormData: (data) => {
        const current = get().formData;
        set({ formData: { ...current, ...data } });
      },
      
      setCalculationResults: (results) => 
        set({ calculationResults: results }),
      
      setCurrentStep: (step) => 
        set({ currentStep: step }),
      
      resetSelection: () => 
        set({ 
          travelSelection: initialTravelSelection, 
          formData: initialFormData,
          calculationResults: undefined,
          currentStep: 'home'
        }),
      
      generateSessionId: () => 
        set({ sessionId: generateId() })
    }),
    {
      name: 'travel-calculator-storage',
      partialize: (state) => ({
        // Solo persistir las selecciones del usuario, no los datos del Excel
        travelSelection: state.travelSelection,
        formData: state.formData,
        sessionId: state.sessionId
      })
    }
  )
);
