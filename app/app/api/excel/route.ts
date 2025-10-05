
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { processExcelFile } from '@/lib/excel';
import path from 'path';

export async function GET() {
  try {
    // Leer el archivo Excel de la carpeta data
    const excelPath = path.join(process.cwd(), 'data', 'Dinamica_Presupuesto_ViajeroEventoDeportivo.xlsx');
    const buffer = await fs.readFile(excelPath);
    
    // Procesar el archivo Excel - Convertir Buffer a ArrayBuffer para compatibilidad con Vercel
    const arrayBuffer = new ArrayBuffer(buffer.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buffer.length; i++) {
      view[i] = buffer[i];
    }
    const data = processExcelFile(arrayBuffer);
    
    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error processing Excel file:', error);
    return NextResponse.json({
      success: false,
      error: 'Error al procesar los datos del archivo Excel'
    }, { status: 500 });
  }
}
