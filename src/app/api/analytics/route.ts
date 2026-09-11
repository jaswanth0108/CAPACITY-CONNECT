import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/analytics
export async function GET(req: NextRequest) {
  // 1. User metrics
  const totalUsers = await prisma.user.count();
  const traineesCount = await prisma.user.count({ where: { role: 'TRAINEE' } });
  const trainersCount = await prisma.user.count({ where: { role: 'TRAINER' } });
  const pendingUsersCount = await prisma.user.count({ where: { status: 'PENDING' } });

  // 2. Course & Enrollment metrics
  const totalCourses = await prisma.course.count();
  const totalEnrollments = await prisma.enrollment.count();
  const completedEnrollments = await prisma.enrollment.count({ where: { status: 'COMPLETED' } });
  const inProgressEnrollments = await prisma.enrollment.count({ where: { status: 'IN_PROGRESS' } });
  const completionRate = totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0;

  // 3. Assessment metrics
  const totalAttempts = await prisma.assessmentAttempt.count();
  const passedAttempts = await prisma.assessmentAttempt.count({ where: { passed: true } });
  const allAttempts = await prisma.assessmentAttempt.findMany({ select: { score: true } });
  const avgAssessmentScore = allAttempts.length > 0
    ? Math.round((allAttempts.reduce((sum, a) => sum + a.score, 0) / allAttempts.length) * 10) / 10
    : 0;
  const assessmentPassRate = totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0;

  // 4. Certificates
  const totalCertificates = await prisma.certificate.count();

  // 5. Competency Gap Analysis (Organization Wide)
  const competencies = await prisma.competency.findMany({
    include: {
      scores: true,
      courses: true,
    },
  });

  const orgBenchmark = 70;
  const competencyGapAnalysis = competencies.map((comp) => {
    const scores = comp.scores.map((s) => s.score);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const gap = Math.max(0, orgBenchmark - avgScore);
    const traineeCount = scores.length;
    return {
      id: comp.id,
      name: comp.name,
      category: comp.category,
      icon: comp.icon,
      avgScore,
      targetScore: orgBenchmark,
      gap,
      traineeCount,
      gapSeverity: gap > 40 ? 'HIGH' : gap > 20 ? 'MEDIUM' : 'LOW',
      courseCount: comp.courses.length,
    };
  }).sort((a, b) => b.gap - a.gap);

  // 6. Trainer Capacity & Utilization
  const trainers = await prisma.user.findMany({
    where: { role: 'TRAINER' },
    include: {
      trainerProfile: true,
      courses: {
        include: {
          enrollments: true,
          feedbacks: true,
        },
      },
    },
  });

  const trainerCapacity = trainers.map((t) => {
    const totalCourses = t.courses.length;
    let totalTrainees = 0;
    let completedTrainees = 0;
    for (const c of t.courses) {
      totalTrainees += c.enrollments.length;
      completedTrainees += c.enrollments.filter((e) => e.status === 'COMPLETED').length;
    }
    return {
      trainerId: t.id,
      name: t.name,
      email: t.email,
      rating: t.trainerProfile?.rating || 0,
      totalReviews: t.trainerProfile?.totalReviews || 0,
      specialization: t.trainerProfile?.specialization || 'General',
      available: t.trainerProfile?.available ?? true,
      coursesCount: totalCourses,
      traineesReached: totalTrainees,
      completionRate: totalTrainees > 0 ? Math.round((completedTrainees / totalTrainees) * 100) : 0,
    };
  });

  // 7. Competency Level Distribution
  const allScores = await prisma.competencyScore.findMany({ select: { level: true } });
  const levelDistribution = {
    BEGINNER: allScores.filter((s) => s.level === 'BEGINNER').length,
    DEVELOPING: allScores.filter((s) => s.level === 'DEVELOPING').length,
    PROFICIENT: allScores.filter((s) => s.level === 'PROFICIENT').length,
    ADVANCED: allScores.filter((s) => s.level === 'ADVANCED').length,
    EXPERT: allScores.filter((s) => s.level === 'EXPERT').length,
  };

  return NextResponse.json({
    summary: {
      totalUsers,
      traineesCount,
      trainersCount,
      pendingUsersCount,
      totalCourses,
      totalEnrollments,
      completedEnrollments,
      inProgressEnrollments,
      completionRate,
      totalAttempts,
      passedAttempts,
      avgAssessmentScore,
      assessmentPassRate,
      totalCertificates,
    },
    competencyGapAnalysis,
    trainerCapacity,
    levelDistribution,
  });
}
