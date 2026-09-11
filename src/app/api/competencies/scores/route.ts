import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { detectCompetencyGaps } from '@/lib/engine/competency';
import { getCompetencyLevel } from '@/lib/utils';

// GET /api/competencies/scores?userId=xxx
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    // Return all scores if no userId
    const allScores = await prisma.competencyScore.findMany({
      include: {
        competency: true,
        user: { select: { id: true, name: true, email: true, role: true } },
      },
    });
    return NextResponse.json(allScores);
  }

  // Get user's current scores
  const userScores = await prisma.competencyScore.findMany({
    where: { userId },
    include: { competency: true },
    orderBy: { score: 'desc' },
  });

  // Calculate gaps
  const gaps = await detectCompetencyGaps(userId);

  return NextResponse.json({
    scores: userScores,
    gaps,
  });
}

// POST /api/competencies/scores - update or set score
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, competencyId, score } = body;

  if (!userId || !competencyId || score === undefined) {
    return NextResponse.json({ error: 'User ID, competency ID, and score are required' }, { status: 400 });
  }

  const numScore = Math.max(0, Math.min(100, Number(score)));
  const level = getCompetencyLevel(numScore);

  const updated = await prisma.competencyScore.upsert({
    where: {
      userId_competencyId: {
        userId,
        competencyId,
      },
    },
    update: {
      score: numScore,
      level,
      assessedAt: new Date(),
    },
    create: {
      userId,
      competencyId,
      score: numScore,
      level,
    },
    include: {
      competency: true,
    },
  });

  return NextResponse.json(updated);
}
