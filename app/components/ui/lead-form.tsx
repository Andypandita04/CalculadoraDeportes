
'use client';

import { useState } from 'react';
import { User, Mail, Award, Send } from 'lucide-react';
import { getBenefitOptions } from '@/lib/benefits';

interface LeadFormProps {
  onSubmit: (data: {
    fullName: string;
    email: string;
    preferredBenefit: string;
  }) => Promise<void>;
  className?: string;
  loading?: boolean;
}

export function LeadForm({ onSubmit, className = '', loading = false }: LeadFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    preferredBenefit: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const benefitOptions = getBenefitOptions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.preferredBenefit) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (!isValidEmail(formData.email)) {
      setError('Por favor ingresa un email válido');
      return;
    }

    try {
      await onSubmit(formData);
      setIsSubmitted(true);
    } catch (err) {
      setError('Hubo un error al enviar el formulario. Intenta de nuevo.');
      console.error('Error submitting lead form:', err);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(''); // Limpiar error cuando el usuario empiece a escribir
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  if (isSubmitted) {
    return (
      <div className={`text-center p-8 bg-white rounded-xl shadow-lg border border-gray-100 ${className}`}>
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary bg-opacity-10 rounded-full mb-4">
          <Send className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          ¡Gracias por participar!
        </h3>
        <p className="text-gray-600 leading-relaxed">
          Recibirás tu plan de ahorro personalizado en las próximas horas.
          <br />
          <span className="font-semibold text-primary">¡Mucho éxito en tu viaje!</span>
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-100 ${className}`}>
      <div className="p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Crear plan de ahorro personalizado
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre completo */}
          <div>
            <label className="form-label" htmlFor="fullName">
              <User className="inline h-4 w-4 mr-2" />
              Nombre completo
            </label>
            <input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Tu nombre completo"
              className="form-input"
              required
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div>
            <label className="form-label" htmlFor="email">
              <Mail className="inline h-4 w-4 mr-2" />
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="tu@email.com"
              className="form-input"
              required
              disabled={loading}
            />
          </div>

          {/* Beneficio preferido */}
          <div>
            <label className="form-label" htmlFor="preferredBenefit">
              <Award className="inline h-4 w-4 mr-2" />
              Beneficio que más te interesa
            </label>
            <select
              id="preferredBenefit"
              value={formData.preferredBenefit}
              onChange={(e) => handleInputChange('preferredBenefit', e.target.value)}
              className="select-custom"
              required
              disabled={loading}
            >
              <option value="">Selecciona un beneficio</option>
              {benefitOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className={`
              w-full btn-primary flex items-center justify-center space-x-2
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                <span>Creando tu plan...</span>
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span>Crear plan de ahorro</span>
              </>
            )}
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-4">
          Al enviar este formulario, aceptas recibir información sobre tu plan de ahorro.
        </p>
      </div>
    </div>
  );
}
