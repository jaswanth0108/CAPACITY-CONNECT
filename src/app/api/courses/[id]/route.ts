import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/courses/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      trainer: { include: { trainerProfile: true } },
      competency: true,
      resources: { orderBy: { orderIndex: 'asc' } },
      enrollments: { include: { user: { select: { id: true, name: true, email: true } } } },
      assessments: { include: { questions: true, attempts: true } },
      feedbacks: { include: { user: { select: { name: true } } } },
    },
  });

  if (!course) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 });
  }

  return NextResponse.json(course);
}

// PATCH /api/courses/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  const updateData: Record<string, unknown> = {};
  if (body.title) updateData.title = body.title;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.difficulty) updateData.difficulty = body.difficulty;
  if (body.durationHours) updateData.durationHours = body.durationHours;
  if (body.tags) updateData.tags = JSON.stringify(body.tags);
  if (body.published !== undefined) updateData.published = body.published;
  if (body.competencyId) updateData.competencyId = body.competencyId;

  const course = await prisma.course.update({
    where: { id },
    data: updateData,
    include: { trainer: true, competency: true },
  });

  return NextResponse.json(course);
}

// DELETE /api/courses/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.course.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
