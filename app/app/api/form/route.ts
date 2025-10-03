
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';

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

// Función para generar un ID único
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Función para guardar datos en archivo JSON
async function saveFormData(data: any): Promise<void> {
  console.log('📂 Starting saveFormData function...');
  
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, 'form-submissions.json');
    
    console.log('📁 Data directory:', dataDir);
    console.log('📄 File path:', filePath);
    
    // Crear directorio si no existe
    try {
      console.log('🔍 Checking if data directory exists...');
      await fs.access(dataDir);
      console.log('✅ Data directory exists');
    } catch {
      console.log('📁 Creating data directory...');
      await fs.mkdir(dataDir, { recursive: true });
      console.log('✅ Data directory created successfully');
    }
    
    // Leer datos existentes
    let existingData: any[] = [];
    try {
      console.log('📖 Reading existing data from file...');
      const fileContent = await fs.readFile(filePath, 'utf8');
      existingData = JSON.parse(fileContent);
      console.log('✅ Existing data loaded:', existingData.length, 'records');
    } catch {
      console.log('ℹ️ No existing file found or empty, starting with empty array');
    }
    
    // Agregar nuevo registro
    const newRecord = {
      id: generateId(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('📝 New record created:', JSON.stringify(newRecord, null, 2));
    
    existingData.push(newRecord);
    
    console.log('💾 Saving updated data to file...');
    // Guardar datos actualizados
    await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));
    
    console.log('✅ Data saved successfully! Total records:', existingData.length);
    
  } catch (error) {
    console.error('Error saving form data to JSON:', error);
    throw new Error('Error al guardar los datos del formulario');
  }
}

export async function POST(request: NextRequest) {
  console.log('📨 POST request received at /api/form');
  console.log('🕐 Timestamp:', new Date().toISOString());
  
  try {
    console.log('📋 Parsing request body...');
    const body: FormSubmissionRequest = await request.json();
    console.log('✅ Body parsed successfully:', JSON.stringify(body, null, 2));
    
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
    
    console.log('🔍 Extracted data:');
    console.log('- Continent:', continent);
    console.log('- Country:', country);
    console.log('- Duration:', durationWeeks, 'weeks');
    console.log('- Date:', month + '/' + year);
    console.log('- Total Amount:', totalAmount);
    console.log('- Total Savings:', totalSavings);
    console.log('- Full Name:', fullName);
    console.log('- Email:', email);
    console.log('- Preferred Benefit:', preferredBenefit);
    console.log('- Session ID:', sessionId);
    
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
    
    console.log('🌐 Client Info:');
    console.log('- IP (hashed):', hashIP(clientIP));
    console.log('- User Agent:', userAgent.substring(0, 100));
    
    // Preparar datos para guardar
    const dataToSave = {
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
    };
    
    console.log('💾 Data to save:', JSON.stringify(dataToSave, null, 2));
    
    // Guardar en archivo JSON
    try {
      console.log('📁 Attempting to save form data...');
      await saveFormData(dataToSave);
      console.log('✅ Form data saved successfully!');
      
      return NextResponse.json({
        success: true,
        message: 'Formulario enviado correctamente. Recibirás tu plan de ahorro en las próximas horas.'
      });
    } catch (saveError) {
      console.error('❌ Error saving form data:', saveError);
      return NextResponse.json({
        success: false,
        error: 'Error al guardar el formulario'
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('❌ Error submitting form:', error);
    return NextResponse.json({
      success: false,
      error: 'Error al enviar el formulario'
    }, { status: 500 });
  }
}
