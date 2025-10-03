
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const destinations = await prisma.destination.findMany({
      include: {
        currency: true
      },
      orderBy: [
        { continent: 'asc' },
        { country: 'asc' }
      ]
    });

    return NextResponse.json(destinations);
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return NextResponse.json(
      { error: 'Error fetching destinations' },
      { status: 500 }
    );
  }
}
