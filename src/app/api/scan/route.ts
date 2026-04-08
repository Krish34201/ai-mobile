import { NextResponse } from 'next/server';
import { getBalances } from '../../../../backend/balanceAggregator';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { seed } = body;

    if (!seed || typeof seed !== 'string') {
      return NextResponse.json({ error: 'Seed phrase is required' }, { status: 400 });
    }

    // Per security rules, NEVER log the seed phrase
    console.log('Received balance scan request.');

    const balances = await getBalances(seed);

    return NextResponse.json(balances);

  } catch (error: any) {
    if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    
    if (error.message === 'Invalid seed phrase') {
        return NextResponse.json({ error: 'Invalid seed phrase provided' }, { status: 400 });
    }

    console.error('[API /api/scan ERROR]', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}
