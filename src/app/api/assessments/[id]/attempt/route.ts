import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { updateCompetencyAfterAssessment } from '@/lib/engine/competency';
import { issueCertificate } from '@/lib/engine/certificates';

// POST /api/assessments/[id]/attempt
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: assessmentId } = await params;
  const body = await req.json();
  const { userId, answers, timeTakenSeconds } = body;

  if (!userId || !answers) {
    return NextResponse.json({ error: 'User ID and answers are required' }, { status: 400 });
  }

  const assessment = await prisma.assessment.findUnique({
    where: { id: assessmentId },
    include: {
      questions: true,
      course: true,
    },
  });

  if (!assessment) {
    return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
  }

  // Calculate score
  const questionsMap = new Map(assessment.questions.map(q => [q.id, q]));
  let totalPoints = 0;
  let earnedPoints = 0;

  const evaluatedAnswers: {
    questionId: string;
    selectedOption: number;
    isCorrect: boolean;
  }[] = [];

  for (const q of assessment.questions) {
    totalPoints += q.points;
    const selected = answers[q.id];
    const isCorrect = selected !== undefined && Number(selected) === q.correctOption;
    if (isCorrect) {
      earnedPoints += q.points;
    }
    evaluatedAnswers.push({
      questionId: q.id,
      selectedOption: selected !== undefined ? Number(selected) : -1,
      isCorrect,
    });
  }

  const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100 * 10) / 10 : 0;
  const passed = score >= assessment.passingScore;

  // Create attempt in database
  const attempt = await prisma.assessmentAttempt.create({
    data: {
      userId,
      assessmentId,
      score,
      passed,
      timeTakenSeconds: timeTakenSeconds || null,
      completedAt: new Date(),
      answers: {
        create: evaluatedAnswers,
      },
    },
    include: {
      answers: true,
    },
  });

  // If passed, update course enrollment progress to 100% and completed
  if (passed) {
    await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId: assessment.courseId,
        },
      },
      update: {
        progress: 100,
        status: 'COMPLETED',
        completedAt: new Date(),
      },
      create: {
        userId,
        courseId: assessment.courseId,
        progress: 100,
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });

    // Auto-issue Certificate
    await issueCertificate(userId, assessment.courseId);
  }

  // Run Competency Intelligence Engine to recalculate & update competency level
  await updateCompetencyAfterAssessment(userId, assessmentId);

  // Return full attempt details
  return NextResponse.json({
    attemptId: attempt.id,
    score,
    passed,
    passingScore: assessment.passingScore,
    totalQuestions: assessment.questions.length,
    earnedPoints,
    totalPoints,
    completedAt: attempt.completedAt,
    evaluatedAnswers,
  });
}
