import { NextRequest, NextResponse } from 'next/server';
import { runSeed } from '@/lib/seed';

export async function GET(req: NextRequest) {
  try {
    const force = req.nextUrl.searchParams.get('force') === 'true';
    const result = await runSeed(force);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to seed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const force = req.nextUrl.searchParams.get('force') === 'true';
    const result = await runSeed(force);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to seed' }, { status: 500 });
  }
}
