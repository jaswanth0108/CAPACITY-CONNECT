import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST /api/courses/[id]/enroll
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: courseId } = await params;
  const body = await req.json();
  const { userId, progress, status } = body;

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const existing = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
  });

  if (existing) {
    // If progress/status updates passed
    const updated = await prisma.enrollment.update({
      where: { id: existing.id },
      data: {
        progress: progress !== undefined ? progress : existing.progress,
        status: status || (progress === 100 ? 'COMPLETED' : existing.status),
        completedAt: progress === 100 && !existing.completedAt ? new Date() : existing.completedAt,
      },
    });
    return NextResponse.json(updated);
  }

  const enrollment = await prisma.enrollment.create({
    data: {
      userId,
      courseId,
      status: 'ENROLLED',
      progress: progress || 0,
    },
  });

  return NextResponse.json(enrollment, { status: 201 });
}
