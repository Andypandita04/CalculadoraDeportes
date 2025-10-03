
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';

interface FormSubmissionRequest {
  // Datos del viaje
  continent: string;
  country: string;
  durationWeeks: number;
  month: number;
  year: number;
  totalAmount: number;
  totalSavings: number;
  
  // Datos del usuario
  fullName: string;
  email: string;
  preferredBenefit: 'A' | 'B' | 'C' | 'D';
  
  sessionId: string;
}

function hashIP(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16);
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body: FormSubmissionRequest = await request.json();
    const { 
      continent, 
      country, 
      durationWeeks, 
      month, 
      year, 
      totalAmount, 
      totalSavings,
      fullName, 
      email, 
      preferredBenefit, 
      sessionId 
    } = body;
    
    // Validaciones de datos del viaje
    if (!continent?.trim()) {
      return NextResponse.json({
        success: false,
        error: 'El continente es requerido'
      }, { status: 400 });
    }
    
    if (!country?.trim()) {
      return NextResponse.json({
        success: false,
        error: 'El país es requerido'
      }, { status: 400 });
    }
    
    if (!durationWeeks || durationWeeks < 1) {
      return NextResponse.json({
        success: false,
        error: 'La duración en semanas es requerida'
      }, { status: 400 });
    }
    
    if (!month || month < 1 || month > 12) {
      return NextResponse.json({
        success: false,
        error: 'El mes es inválido'
      }, { status: 400 });
    }
    
    if (!year || year < 2025) {
      return NextResponse.json({
        success: false,
        error: 'El año es inválido'
      }, { status: 400 });
    }
    
    if (totalAmount === undefined || totalAmount === null || totalAmount < 0) {
      return NextResponse.json({
        success: false,
        error: 'El monto total es requerido'
      }, { status: 400 });
    }
    
    if (totalSavings === undefined || totalSavings === null || totalSavings < 0) {
      return NextResponse.json({
        success: false,
        error: 'El ahorro total es requerido'
      }, { status: 400 });
    }
    
    // Validaciones de datos del usuario
    if (!fullName?.trim()) {
      return NextResponse.json({
        success: false,
        error: 'El nombre completo es requerido'
      }, { status: 400 });
    }
    
    if (!email?.trim() || !validateEmail(email)) {
      return NextResponse.json({
        success: false,
        error: 'Se requiere un email válido'
      }, { status: 400 });
    }
    
    if (!preferredBenefit || !['A', 'B', 'C', 'D'].includes(preferredBenefit)) {
      return NextResponse.json({
        success: false,
        error: 'Se requiere seleccionar un beneficio preferido'
      }, { status: 400 });
    }
    
    const clientIP = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || '';
    
    // Guardar en la base de datos
    try {
      await prisma.tripForm.create({
        data: {
          continent: continent.trim(),
          country: country.trim(),
          durationWeeks,
          month,
          year,
          totalAmount,
          totalSavings,
          preferredBenefit,
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          sessionId,
          ipAddress: hashIP(clientIP),
          userAgent: userAgent.substring(0, 500)
        }
      });
      
      return NextResponse.json({
        success: true,
        message: 'Formulario enviado correctamente. Recibirás tu plan de ahorro en las próximas horas.'
      });
    } catch (dbError) {
      console.error('Error saving to database:', dbError);
      return NextResponse.json({
        success: false,
        error: 'Error al guardar el formulario'
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Error submitting form:', error);
    return NextResponse.json({
      success: false,
      error: 'Error al enviar el formulario'
    }, { status: 500 });
  }
}
