import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/competencies/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const comp = await prisma.competency.findUnique({
    where: { id },
    include: {
      courses: {
        include: {
          trainer: { include: { trainerProfile: true } },
          enrollments: true,
        },
      },
      scores: {
        include: {
          user: { select: { id: true, name: true, email: true, role: true } },
        },
      },
    },
  });

  if (!comp) {
    return NextResponse.json({ error: 'Competency not found' }, { status: 404 });
  }

  return NextResponse.json(comp);
}

// PATCH /api/competencies/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  const updateData: Record<string, unknown> = {};
  if (body.name) updateData.name = body.name;
  if (body.description) updateData.description = body.description;
  if (body.category) updateData.category = body.category;
  if (body.icon) updateData.icon = body.icon;

  const updated = await prisma.competency.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(updated);
}
