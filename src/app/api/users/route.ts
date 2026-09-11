import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// GET /api/users — List users (admin)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get('role');
  const status = searchParams.get('status');

  const where: Record<string, string> = {};
  if (role) where.role = role;
  if (status) where.status = status;

  const users = await prisma.user.findMany({
    where,
    include: { trainerProfile: true },
    orderBy: { createdAt: 'desc' },
  });

  const safeUsers = users.map(({ passwordHash, ...user }) => user);
  return NextResponse.json(safeUsers);
}

// POST /api/users — Register new user
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, name, password, role, bio, skills, qualifications, interests, experienceYears, expertise, certifications, specialization } = body;

  if (!email || !name || !password || !role) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      role,
      status: role === 'ADMIN' ? 'APPROVED' : 'APPROVED', // Auto-approve for hackathon demo
      bio: bio || '',
      skills: JSON.stringify(skills || []),
      qualifications: JSON.stringify(qualifications || []),
      interests: JSON.stringify(interests || []),
      experienceYears: experienceYears || 0,
      ...(role === 'TRAINER' && {
        trainerProfile: {
          create: {
            expertise: JSON.stringify(expertise || []),
            certifications: JSON.stringify(certifications || []),
            specialization: specialization || '',
            available: true,
          },
        },
      }),
    },
    include: { trainerProfile: true },
  });

  const { passwordHash: _, ...safeUser } = user;
  return NextResponse.json(safeUser, { status: 201 });
}
