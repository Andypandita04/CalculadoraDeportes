
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const {
      continente,
      pais,
      semanasDuracion,
      mes,
      anio,
      montoTotal,
      ahorroTotal,
      beneficioPreferido,
      nombre,
      correoElectronico
    } = body;

    // Validar que TODOS los campos requeridos estén presentes
    if (!continente || !pais || !semanasDuracion || !mes || !anio || 
        montoTotal === undefined || ahorroTotal === undefined || 
        !beneficioPreferido || !nombre || !correoElectronico) {
      return NextResponse.json(
        { 
          error: 'Todos los campos son obligatorios',
          missing: {
            continente: !continente,
            pais: !pais,
            semanasDuracion: !semanasDuracion,
            mes: !mes,
            anio: !anio,
            montoTotal: montoTotal === undefined,
            ahorroTotal: ahorroTotal === undefined,
            beneficioPreferido: !beneficioPreferido,
            nombre: !nombre,
            correoElectronico: !correoElectronico
          }
        },
        { status: 400 }
      );
    }

    // Validar tipos y rangos
    if (semanasDuracion < 1 || semanasDuracion > 104) {
      return NextResponse.json(
        { error: 'Las semanas de duración deben estar entre 1 y 104' },
        { status: 400 }
      );
    }

    if (mes < 1 || mes > 12) {
      return NextResponse.json(
        { error: 'Mes inválido' },
        { status: 400 }
      );
    }

    if (anio < 2025 || anio > 2030) {
      return NextResponse.json(
        { error: 'El año debe estar entre 2025 y 2030' },
        { status: 400 }
      );
    }

    if (montoTotal < 0 || ahorroTotal < 0) {
      return NextResponse.json(
        { error: 'Los montos no pueden ser negativos' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correoElectronico)) {
      return NextResponse.json(
        { error: 'Formato de correo electrónico inválido' },
        { status: 400 }
      );
    }

    // Validar que los strings no estén vacíos
    if (continente.trim() === '' || pais.trim() === '' || 
        beneficioPreferido.trim() === '' || nombre.trim() === '') {
      return NextResponse.json(
        { error: 'Los campos de texto no pueden estar vacíos' },
        { status: 400 }
      );
    }

    // Crear el formulario de viaje con todos los campos validados
    const tripForm = await prisma.tripForm.create({
      data: {
        continente: continente.trim(),
        pais: pais.trim(),
        semanasDuracion,
        mes,
        anio,
        montoTotal,
        ahorroTotal,
        beneficioPreferido: beneficioPreferido.trim(),
        nombre: nombre.trim(),
        correoElectronico: correoElectronico.toLowerCase().trim()
      }
    });

    return NextResponse.json(tripForm, { status: 201 });
  } catch (error) {
    console.error('Error creating trip form:', error);
    return NextResponse.json(
      { error: 'Error al crear el formulario de viaje' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const tripForms = await prisma.tripForm.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100 // Limitar a las últimas 100 entradas
    });

    return NextResponse.json(tripForms);
  } catch (error) {
    console.error('Error fetching trip forms:', error);
    return NextResponse.json(
      { error: 'Error al obtener los formularios' },
      { status: 500 }
    );
  }
}
