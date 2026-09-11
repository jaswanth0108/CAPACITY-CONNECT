import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/competencies
export async function GET(req: NextRequest) {
  const competencies = await prisma.competency.findMany({
    include: {
      scores: true,
      courses: true,
    },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(competencies);
}

// POST /api/competencies
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, description, category, icon } = body;

  if (!name || !description || !category) {
    return NextResponse.json({ error: 'Name, description, and category are required' }, { status: 400 });
  }

  const existing = await prisma.competency.findUnique({ where: { name } });
  if (existing) {
    return NextResponse.json({ error: 'Competency with this name already exists' }, { status: 409 });
  }

  const comp = await prisma.competency.create({
    data: {
      name,
      description,
      category,
      icon: icon || '📊',
    },
  });

  return NextResponse.json(comp, { status: 201 });
}
