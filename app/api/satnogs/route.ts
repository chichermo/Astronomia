import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(
      'https://db.satnogs.org/api/telemetry/?format=json'
    );
    if (!response.ok) {
      throw new Error('Error al obtener datos de SatNOGS');
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error en el proxy de SatNOGS:', error);
    return NextResponse.json(
      { error: 'No se pudieron obtener los datos de SatNOGS' },
      { status: 500 }
    );
  }
}