import prisma from '../prisma';
import { getCompetencyLevel } from '../utils';

// ============================================================================
// COMPETENCY SCORING ENGINE
// ============================================================================

export interface CompetencyGap {
  competencyId: string;
  competencyName: string;
  competencyIcon: string;
  currentScore: number;
  currentLevel: string;
  targetScore: number;
  gap: number;
  gapSeverity: 'LOW' | 'MEDIUM' | 'HIGH';
}

const ORG_BENCHMARK = 70; // Organization target competency score

export async function calculateCompetencyScore(
  userId: string,
  competencyId: string
): Promise<number> {
  // Factor 1: Assessment Average (50%)
  const assessmentAvg = await getAssessmentAverage(userId, competencyId);

  // Factor 2: Course Progress (25%)
  const courseProgress = await getCourseProgress(userId, competencyId);

  // Factor 3: Skill Relevance (15%)
  const skillRelevance = await getSkillRelevance(userId, competencyId);

  // Factor 4: Experience Bonus (10%)
  const experienceBonus = await getExperienceBonus(userId);

  const score = Math.min(100, Math.round(
    assessmentAvg * 0.50 +
    courseProgress * 0.25 +
    skillRelevance * 0.15 +
    experienceBonus * 0.10
  ));

  return score;
}

async function getAssessmentAverage(userId: string, competencyId: string): Promise<number> {
  const attempts = await prisma.assessmentAttempt.findMany({
    where: {
      userId,
      assessment: { course: { competencyId } },
      completedAt: { not: null },
    },
    select: { score: true },
  });

  if (attempts.length === 0) return 0;
  return attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length;
}

async function getCourseProgress(userId: string, competencyId: string): Promise<number> {
  const enrollments = await prisma.enrollment.findMany({
    where: {
      userId,
      course: { competencyId },
    },
    select: { progress: true },
  });

  if (enrollments.length === 0) return 0;
  return enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length;
}

async function getSkillRelevance(userId: string, competencyId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { skills: true, interests: true },
  });

  const competency = await prisma.competency.findUnique({
    where: { id: competencyId },
    select: { name: true, category: true },
  });

  if (!user || !competency) return 0;

  try {
    const skills = JSON.parse(user.skills) as string[];
    const interests = JSON.parse(user.interests) as string[];
    const allTerms = [...skills, ...interests].map(s => s.toLowerCase());
    const compName = competency.name.toLowerCase();
    const compCategory = competency.category.toLowerCase();

    let relevance = 0;
    for (const term of allTerms) {
      if (compName.includes(term) || term.includes(compName) || compCategory.includes(term)) {
        relevance += 20;
      }
    }

    return Math.min(100, relevance);
  } catch {
    return 0;
  }
}

async function getExperienceBonus(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { experienceYears: true },
  });

  if (!user) return 0;
  // Scale: 0 years = 0, 10+ years = 100
  return Math.min(100, user.experienceYears * 10);
}

// ============================================================================
// GAP DETECTION
// ============================================================================

export async function detectCompetencyGaps(userId: string): Promise<CompetencyGap[]> {
  const competencies = await prisma.competency.findMany();
  const scores = await prisma.competencyScore.findMany({
    where: { userId },
    include: { competency: true },
  });

  const scoreMap = new Map(scores.map(s => [s.competencyId, s]));
  const gaps: CompetencyGap[] = [];

  for (const comp of competencies) {
    const existingScore = scoreMap.get(comp.id);
    const currentScore = existingScore?.score ?? 0;
    const gap = Math.max(0, ORG_BENCHMARK - currentScore);

    if (gap > 0) {
      gaps.push({
        competencyId: comp.id,
        competencyName: comp.name,
        competencyIcon: comp.icon,
        currentScore,
        currentLevel: getCompetencyLevel(currentScore),
        targetScore: ORG_BENCHMARK,
        gap,
        gapSeverity: gap > 40 ? 'HIGH' : gap > 20 ? 'MEDIUM' : 'LOW',
      });
    }
  }

  // Sort by gap severity (highest first)
  return gaps.sort((a, b) => b.gap - a.gap);
}

// ============================================================================
// UPDATE COMPETENCY AFTER ASSESSMENT
// ============================================================================

export async function updateCompetencyAfterAssessment(
  userId: string,
  assessmentId: string
): Promise<void> {
  const assessment = await prisma.assessment.findUnique({
    where: { id: assessmentId },
    include: { course: true },
  });

  if (!assessment) return;

  const newScore = await calculateCompetencyScore(userId, assessment.course.competencyId);
  const newLevel = getCompetencyLevel(newScore);

  await prisma.competencyScore.upsert({
    where: {
      userId_competencyId: {
        userId,
        competencyId: assessment.course.competencyId,
      },
    },
    update: { score: newScore, level: newLevel, assessedAt: new Date() },
    create: {
      userId,
      competencyId: assessment.course.competencyId,
      score: newScore,
      level: newLevel,
    },
  });
}
