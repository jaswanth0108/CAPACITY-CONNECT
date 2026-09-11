import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/notifications?userId=xxx
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(notifications);
}

// PATCH /api/notifications - Mark as read
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, userId, markAll } = body;

  if (markAll && userId) {
    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
    return NextResponse.json({ success: true });
  }

  if (id) {
    const updated = await prisma.notification.update({
      where: { id },
      data: { read: true },
    });
    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
}
