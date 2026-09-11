import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { issueCertificate } from '@/lib/engine/certificates';

// GET /api/certificates?userId=xxx
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  const where: Record<string, unknown> = {};
  if (userId) where.userId = userId;

  const certificates = await prisma.certificate.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, email: true } },
      course: {
        include: {
          competency: true,
          trainer: { select: { name: true } },
        },
      },
    },
    orderBy: { issuedAt: 'desc' },
  });

  return NextResponse.json(certificates);
}

// POST /api/certificates
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, courseId } = body;

  if (!userId || !courseId) {
    return NextResponse.json({ error: 'User ID and course ID are required' }, { status: 400 });
  }

  const certificate = await issueCertificate(userId, courseId);
  return NextResponse.json(certificate, { status: 201 });
}
