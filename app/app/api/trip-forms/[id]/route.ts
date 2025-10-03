
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tripForm = await prisma.tripForm.findUnique({
      where: { id: params.id }
    });

    if (!tripForm) {
      return NextResponse.json(
        { error: 'Trip form not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(tripForm);
  } catch (error) {
    console.error('Error fetching trip form:', error);
    return NextResponse.json(
      { error: 'Error fetching trip form' },
      { status: 500 }
    );
  }
}
