import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/announcements
export async function GET(req: NextRequest) {
  const announcements = await prisma.announcement.findMany({
    where: { published: true },
    include: {
      admin: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(announcements);
}

// POST /api/announcements (Admin create)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { adminId, title, content, type } = body;

  if (!adminId || !title || !content) {
    return NextResponse.json({ error: 'Admin ID, title, and content are required' }, { status: 400 });
  }

  const announcement = await prisma.announcement.create({
    data: {
      adminId,
      title,
      content,
      type: type || 'INFO',
      published: true,
    },
  });

  return NextResponse.json(announcement, { status: 201 });
}
