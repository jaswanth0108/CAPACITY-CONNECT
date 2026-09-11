import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/certificates/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const certificate = await prisma.certificate.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          qualifications: true,
        },
      },
      course: {
        include: {
          competency: true,
          trainer: {
            select: {
              name: true,
              trainerProfile: true,
            },
          },
        },
      },
    },
  });

  if (!certificate) {
    return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
  }

  return NextResponse.json(certificate);
}
