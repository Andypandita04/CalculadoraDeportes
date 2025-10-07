
'use client';

import { useState } from 'react';
import { User, Mail, Star, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getBenefitDisplayName } from '@/lib/benefits.daily';
import { useAppStore } from '@/lib/store';
import { useUsageTracking } from '@/hooks/use-usage-tracking';

interface LeadFormProps {
  onSuccess?: () => void;
}

export function LeadForm({ onSuccess }: LeadFormProps) {
  const { formData, updateFormData, sessionId } = useAppStore();
  const { trackEvent } = useUsageTracking();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos del formulario
    if (!formData?.fullName?.trim?.()) {
      setError('El nombre completo es requerido');
      return;
    }
    
    if (!formData?.email?.trim?.()) {
      setError('El correo electrónico es requerido');
      return;
    }
    
    if (!formData?.preferredBenefit) {
      setError('Por favor selecciona tu beneficio preferido');
      return;
    }
    
    // Obtener datos del store
    const { travelSelection, calculationResults } = useAppStore.getState();
    
    // Validar que tenemos todos los datos necesarios del viaje
    if (!travelSelection?.country || !travelSelection?.countryData) {
      setError('Faltan datos del viaje. Por favor completa el proceso desde el inicio.');
      return;
    }
    
    if (!calculationResults) {
      setError('Faltan datos del cálculo. Por favor completa el proceso desde el inicio.');
      return;
    }
    
    // Calcular valores requeridos
    const durationWeeks = Math.ceil(travelSelection.duration / 7);
    const totalAmount = Math.round(calculationResults.dailyCostMXN * travelSelection.duration);
    const totalSavings = Math.round(calculationResults.benefits?.totalBenefits || 0);
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Datos del viaje
          continent: travelSelection.countryData.continent,
          country: travelSelection.country,
          durationWeeks,
          month: travelSelection.startMonth,
          year: travelSelection.startYear,
          totalAmount,
          totalSavings,
          
          // Datos del usuario
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          preferredBenefit: formData.preferredBenefit,
          
          sessionId
        })
      });
      
      const result = await response.json();
      
      if (result?.success) {
        setIsSubmitted(true);
        
        // Track successful form submission
        await trackEvent('form_submitted', '/benefits-breakdown', {
          preferredBenefit: formData.preferredBenefit
        });
        
        // Call onSuccess callback if provided
        onSuccess?.();
      } else {
        throw new Error(result?.error || 'Error al enviar el formulario');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error submitting form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isSubmitted) {
    return (
      <Card className="border-[#00CF0C] bg-gradient-to-r from-green-50 to-white">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-[#00CF0C] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                ¡Gracias por participar!
              </h3>
              <p className="text-gray-600">
                Recibirás tu plan de ahorro en las próximas horas.
                <br />
                <strong className="text-[#00CF0C]">¡Mucho éxito en tu viaje!</strong>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Star className="h-6 w-6 text-[#00CF0C]" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg md:text-xl leading-tight mb-2">
              Ten acceso a estos beneficios
            </CardTitle>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">
                Por solo <span className="font-bold text-[#00CF0C] text-base">$49 MXN/mes</span>
              </p>
              <p className="text-sm text-gray-500">
                Crea tu cuenta y espera nuestro lanzamiento
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre completo */}
          <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm font-medium text-gray-700">
              Nombre completo
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="fullName"
                type="text"
                value={formData?.fullName || ''}
                onChange={(e) => updateFormData({ fullName: e.target.value })}
                placeholder="Ingresa tu nombre completo"
                className="pl-10"
                required
              />
            </div>
          </div>
          
          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={formData?.email || ''}
                onChange={(e) => updateFormData({ email: e.target.value })}
                placeholder="tu.email@ejemplo.com"
                className="pl-10"
                required
              />
            </div>
          </div>
          
          {/* Beneficio preferido */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Beneficio de tu preferencia
            </label>
            <Select 
              value={formData?.preferredBenefit || "default"} 
              onValueChange={(value) => value !== "default" ? updateFormData({ preferredBenefit: value as any }) : null}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tu beneficio preferido" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default" disabled>
                  Selecciona tu beneficio preferido
                </SelectItem>
                <SelectItem value="A">A. {getBenefitDisplayName('A')}</SelectItem>
                <SelectItem value="B">B. {getBenefitDisplayName('B')}</SelectItem>
                <SelectItem value="C">C. {getBenefitDisplayName('C')}</SelectItem>
                <SelectItem value="D">D. {getBenefitDisplayName('D')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Error message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          {/* Submit button */}
          <Button 
            type="submit" 
            size="lg" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Crear plan de ahorro'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
