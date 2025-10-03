
'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';

type EventType = 'page_view' | 'calculation_started' | 'calculation_completed' | 'form_submitted';

export function useUsageTracking() {
  const sessionId = useAppStore(state => state.sessionId);
  
  const trackEvent = async (
    eventType: EventType, 
    eventPage?: string, 
    eventPayload?: Record<string, any>
  ) => {
    try {
      const response = await fetch('/api/usage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType,
          eventPage,
          sessionId,
          eventPayload
        })
      });
      
      // Verificar que la respuesta sea OK y contenga JSON válido
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          await response.json();
        }
      }
    } catch (error) {
      console.warn('Error tracking event:', error);
      // No bloqueamos la UI por errores de tracking
    }
  };
  
  const trackPageView = (page: string) => {
    trackEvent('page_view', page);
  };
  
  return {
    trackEvent,
    trackPageView
  };
}

// Hook para trackear automáticamente las vistas de página
export function usePageTracking(pageName: string) {
  const { trackPageView } = useUsageTracking();
  
  useEffect(() => {
    trackPageView(pageName);
  }, [pageName, trackPageView]);
}
