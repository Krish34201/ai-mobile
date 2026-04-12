import { NextResponse } from 'next/server';
import { getBalances } from '../../../../backend/balanceAggregator';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { seeds } = body; // Expecting an array of seed phrases

    if (!seeds || !Array.isArray(seeds) || seeds.length === 0) {
      return NextResponse.json({ error: 'Seed phrases are required' }, { status: 400 });
    }

    // Per security rules, NEVER log the seed phrase
    console.log(`Received balance scan request for ${seeds.length} wallets.`);

    const balanceChecks = seeds.map(async (seed: string) => {
      try {
        const balances = await getBalances(seed);
        const hasBalance = Object.values(balances).some(b => (b as number) > 0.00001);
        if (hasBalance) {
          return { seed, balances };
        }
      } catch (error: any) {
        // Swallow invalid seed errors, as they are expected.
        if (error.message !== 'Invalid seed phrase') {
            // console.error(`[API /api/scan] Error processing seed: ${error.message}`);
        }
      }
      return null;
    });

    const results = await Promise.all(balanceChecks);
    const walletsWithBalance = results.filter(Boolean);

    // Only return wallets that actually have a balance to optimize network traffic to client
    return NextResponse.json(walletsWithBalance);

  } catch (error: any) {
    if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    
    console.error('[API /api/scan ERROR]', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}
