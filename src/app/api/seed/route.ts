import { NextResponse } from 'next/server';
import { runSeed } from '@/lib/seed';

export async function GET() {
  try {
    const result = await runSeed();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to seed' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const result = await runSeed();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to seed' }, { status: 500 });
  }
}
