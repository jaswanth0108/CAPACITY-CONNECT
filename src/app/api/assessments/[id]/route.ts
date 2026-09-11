import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/assessments/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const assessment = await prisma.assessment.findUnique({
    where: { id },
    include: {
      course: {
        include: { competency: true, trainer: true }
      },
      questions: {
        orderBy: { orderIndex: 'asc' },
      },
      attempts: {
        include: {
          user: { select: { id: true, name: true, email: true } },
          answers: true,
        },
      },
    },
  });

  if (!assessment) {
    return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
  }

  return NextResponse.json(assessment);
}

// PATCH /api/assessments/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  const updateData: Record<string, unknown> = {};
  if (body.title) updateData.title = body.title;
  if (body.passingScore !== undefined) updateData.passingScore = body.passingScore;
  if (body.timeLimitMinutes !== undefined) updateData.timeLimitMinutes = body.timeLimitMinutes;
  if (body.deadline !== undefined) updateData.deadline = body.deadline ? new Date(body.deadline) : null;
  if (body.published !== undefined) updateData.published = body.published;

  const assessment = await prisma.assessment.update({
    where: { id },
    data: updateData,
    include: { questions: true },
  });

  return NextResponse.json(assessment);
}
