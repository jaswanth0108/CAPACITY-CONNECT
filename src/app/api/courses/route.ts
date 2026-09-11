import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/courses
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const competencyId = searchParams.get('competencyId');
  const trainerId = searchParams.get('trainerId');
  const difficulty = searchParams.get('difficulty');
  const search = searchParams.get('search');

  const where: Record<string, unknown> = { published: true };
  if (competencyId) where.competencyId = competencyId;
  if (trainerId) where.trainerId = trainerId;
  if (difficulty) where.difficulty = difficulty;
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
    ];
  }

  const courses = await prisma.course.findMany({
    where,
    include: {
      trainer: { include: { trainerProfile: true } },
      competency: true,
      enrollments: true,
      resources: true,
      feedbacks: true,
      assessments: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(courses);
}

// POST /api/courses
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, description, trainerId, competencyId, difficulty, durationHours, tags } = body;

  if (!title || !trainerId || !competencyId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const course = await prisma.course.create({
    data: {
      title,
      description: description || '',
      trainerId,
      competencyId,
      difficulty: difficulty || 'BEGINNER',
      durationHours: durationHours || 1,
      tags: JSON.stringify(tags || []),
    },
    include: {
      trainer: true,
      competency: true,
    },
  });

  return NextResponse.json(course, { status: 201 });
}
