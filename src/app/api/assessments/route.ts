import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/assessments
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get('courseId');

  const where: Record<string, unknown> = { published: true };
  if (courseId) where.courseId = courseId;

  const assessments = await prisma.assessment.findMany({
    where,
    include: {
      course: {
        include: { competency: true, trainer: true }
      },
      questions: true,
      attempts: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(assessments);
}

// POST /api/assessments (Trainer create questionnaire)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { courseId, title, passingScore, timeLimitMinutes, deadline, questions } = body;

  if (!courseId || !title) {
    return NextResponse.json({ error: 'Course ID and title are required' }, { status: 400 });
  }

  const assessment = await prisma.assessment.create({
    data: {
      courseId,
      title,
      passingScore: passingScore || 60,
      timeLimitMinutes: timeLimitMinutes || 30,
      deadline: deadline ? new Date(deadline) : null,
      published: true,
      ...(questions && questions.length > 0 && {
        questions: {
          create: questions.map((q: any, index: number) => ({
            questionText: q.questionText,
            options: JSON.stringify(q.options),
            correctOption: q.correctOption,
            points: q.points || 10,
            orderIndex: index + 1,
          })),
        },
      }),
    },
    include: {
      questions: true,
      course: true,
    },
  });

  return NextResponse.json(assessment, { status: 201 });
}
