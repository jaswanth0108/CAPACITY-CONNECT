import { NextRequest, NextResponse } from 'next/server';
import { recommendTrainers } from '@/lib/engine/recommendations';

// GET /api/recommendations/trainers?competency=xxx
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const competency = searchParams.get('competency') || 'Data Analytics';

  const matches = await recommendTrainers(competency, 6);
  return NextResponse.json(matches);
}
