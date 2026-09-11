import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/users/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      trainerProfile: true,
      enrollments: { include: { course: { include: { competency: true, trainer: true } } } },
      competencyScores: { include: { competency: true } },
      certificates: { include: { course: true } },
      feedbacks: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const { passwordHash, ...safeUser } = user;
  return NextResponse.json(safeUser);
}

// PATCH /api/users/[id] — Update user
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  const updateData: Record<string, unknown> = {};
  if (body.name) updateData.name = body.name;
  if (body.bio !== undefined) updateData.bio = body.bio;
  if (body.skills) updateData.skills = JSON.stringify(body.skills);
  if (body.qualifications) updateData.qualifications = JSON.stringify(body.qualifications);
  if (body.interests) updateData.interests = JSON.stringify(body.interests);
  if (body.experienceYears !== undefined) updateData.experienceYears = body.experienceYears;
  if (body.status) updateData.status = body.status;
  if (body.role) updateData.role = body.role;

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    include: { trainerProfile: true },
  });

  const { passwordHash, ...safeUser } = user;
  return NextResponse.json(safeUser);
}

// DELETE /api/users/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
