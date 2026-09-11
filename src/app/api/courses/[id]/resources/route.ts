import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/courses/[id]/resources
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resources = await prisma.resource.findMany({
    where: { courseId: id },
    orderBy: { orderIndex: 'asc' },
  });
  return NextResponse.json(resources);
}

// POST /api/courses/[id]/resources
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { title, type, url, orderIndex, durationMinutes } = body;

  if (!title || !url) {
    return NextResponse.json({ error: 'Title and URL are required' }, { status: 400 });
  }

  const resource = await prisma.resource.create({
    data: {
      courseId: id,
      title,
      type: type || 'DOCUMENT',
      url,
      orderIndex: orderIndex || 0,
      durationMinutes: durationMinutes || null,
    },
  });

  return NextResponse.json(resource, { status: 201 });
}
