
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// NOTA: Este endpoint ya no se utiliza en el flujo actual.
// Los datos del lead ahora se envían directamente a /api/trip-forms
// Se mantiene para compatibilidad futura o integración con servicios de email marketing

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const {
      fullName,
      email,
      preferredBenefit
    } = body;

    // Validaciones básicas
    if (!fullName || !email || !preferredBenefit) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Verificar beneficios válidos
    const validBenefits = ['exchange-rate', 'investment-returns', 'cashback', 'free-transfers'];
    if (!validBenefits.includes(preferredBenefit)) {
      return NextResponse.json(
        { error: 'Invalid preferred benefit' },
        { status: 400 }
      );
    }

    // Aquí se podría integrar con un servicio de email marketing
    // Para enviar el plan de ahorro personalizado
    // Por ejemplo: Mailchimp, ConvertKit, SendGrid, etc.
    
    console.log('Lead received:', {
      fullName,
      email,
      preferredBenefit
    });

    return NextResponse.json({
      success: true,
      message: 'Lead received successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error processing lead:', error);
    return NextResponse.json(
      { error: 'Error processing lead' },
      { status: 500 }
    );
  }
}
