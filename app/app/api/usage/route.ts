
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

interface UsageEventRequest {
  eventType: 'page_view' | 'calculation_started' | 'calculation_completed' | 'form_submitted';
  eventPage?: string;
  sessionId?: string;
  eventPayload?: Record<string, any>;
}

export async function POST(request: NextRequest) {
  try {
    // Esta ruta ya no guarda eventos en la base de datos
    // Solo retorna éxito para mantener compatibilidad con el código existente
    const body: UsageEventRequest = await request.json();
    
    return NextResponse.json({
      success: true,
      message: 'OK'
    });
    
  } catch (error) {
    return NextResponse.json({
      success: true,
      message: 'OK'
    });
  }
}
