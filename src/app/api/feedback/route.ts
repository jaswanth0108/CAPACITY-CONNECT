import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/feedback?courseId=xxx or trainerId=xxx
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get('courseId');
  const trainerId = searchParams.get('trainerId');

  const where: Record<string, unknown> = {};
  if (courseId) where.courseId = courseId;
  if (trainerId) where.course = { trainerId };

  const feedbacks = await prisma.feedback.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, avatar: true } },
      course: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(feedbacks);
}

// POST /api/feedback
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, courseId, rating, comment } = body;

  if (!userId || !courseId || rating === undefined) {
    return NextResponse.json({ error: 'User ID, course ID, and rating are required' }, { status: 400 });
  }

  const feedback = await prisma.feedback.upsert({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
    update: {
      rating: Number(rating),
      comment: comment || '',
    },
    create: {
      userId,
      courseId,
      rating: Number(rating),
      comment: comment || '',
    },
  });

  // Recalculate trainer's average rating
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { trainerId: true },
  });

  if (course) {
    const allTrainerFeedbacks = await prisma.feedback.findMany({
      where: {
        course: { trainerId: course.trainerId },
      },
      select: { rating: true },
    });

    if (allTrainerFeedbacks.length > 0) {
      const avg = allTrainerFeedbacks.reduce((sum, f) => sum + f.rating, 0) / allTrainerFeedbacks.length;
      await prisma.trainerProfile.updateMany({
        where: { userId: course.trainerId },
        data: {
          rating: Math.round(avg * 10) / 10,
          totalReviews: allTrainerFeedbacks.length,
        },
      });
    }
  }

  return NextResponse.json(feedback, { status: 201 });
}
