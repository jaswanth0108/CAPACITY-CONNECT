import { NextRequest, NextResponse } from 'next/server';
import { recommendCourses } from '@/lib/engine/recommendations';

// GET /api/recommendations/courses?userId=xxx
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const recommendations = await recommendCourses(userId, 8);
  return NextResponse.json(recommendations);
}
