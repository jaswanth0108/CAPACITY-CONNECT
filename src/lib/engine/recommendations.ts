import prisma from '../prisma';

// ============================================================================
// TRAINER MATCHING ENGINE
// ============================================================================

export interface TrainerMatch {
  trainerId: string;
  trainerName: string;
  trainerEmail: string;
  specialization: string;
  matchScore: number;
  factors: {
    expertiseRelevance: { score: number; weight: number; details: string };
    experience: { score: number; weight: number; details: string };
    qualificationMatch: { score: number; weight: number; details: string };
    certificationMatch: { score: number; weight: number; details: string };
    traineeRating: { score: number; weight: number; details: string };
    availability: { score: number; weight: number; details: string };
  };
  rating: number;
  totalReviews: number;
  expertise: string[];
  certifications: string[];
  experienceYears: number;
  available: boolean;
}

export interface CourseRecommendation {
  courseId: string;
  title: string;
  description: string;
  difficulty: string;
  durationHours: number;
  trainerName: string;
  trainerRating: number;
  competencyName: string;
  relevanceScore: number;
  enrollmentCount: number;
  completionRate: number;
  tags: string[];
}

// ============================================================================
// RECOMMEND TRAINERS FOR A COMPETENCY GAP
// ============================================================================

export async function recommendTrainers(
  competencyName: string,
  limit: number = 5
): Promise<TrainerMatch[]> {
  const trainers = await prisma.user.findMany({
    where: { role: 'TRAINER', status: 'APPROVED' },
    include: {
      trainerProfile: true,
      courses: {
        include: {
          competency: true,
          enrollments: true,
          feedbacks: true,
        },
      },
    },
  });

  const matches: TrainerMatch[] = [];

  for (const trainer of trainers) {
    if (!trainer.trainerProfile) continue;

    const profile = trainer.trainerProfile;
    const expertise = safeParseJSON(profile.expertise);
    const certs = safeParseJSON(profile.certifications);
    const quals = safeParseJSON(trainer.qualifications);

    // Factor 1: Expertise Relevance (30%)
    const expertiseScore = calculateRelevance(expertise, competencyName);
    const expertiseDetails = expertise.filter((e: string) =>
      e.toLowerCase().includes(competencyName.toLowerCase()) ||
      competencyName.toLowerCase().includes(e.toLowerCase())
    ).join(', ') || 'Related domain expertise';

    // Factor 2: Experience (20%)
    const expScore = Math.min(100, trainer.experienceYears * 8);
    const expDetails = `${trainer.experienceYears} years of experience`;

    // Factor 3: Qualification Match (15%)
    const qualScore = calculateRelevance(quals, competencyName);
    const qualDetails = quals.length > 0 ? quals.join(', ') : 'No specific qualifications listed';

    // Factor 4: Certification Match (10%)
    const certScore = certs.length > 0 ? Math.min(100, certs.length * 25) : 0;
    const certDetails = certs.length > 0 ? certs.join(', ') : 'No certifications listed';

    // Factor 5: Trainee Rating (15%)
    const ratingScore = (profile.rating / 5) * 100;
    const ratingDetails = `${profile.rating.toFixed(1)}/5.0 (${profile.totalReviews} reviews)`;

    // Factor 6: Availability (10%)
    const availScore = profile.available ? 100 : 0;
    const availDetails = profile.available ? 'Currently available' : 'Not available';

    const matchScore = Math.round(
      expertiseScore * 0.30 +
      expScore * 0.20 +
      qualScore * 0.15 +
      certScore * 0.10 +
      ratingScore * 0.15 +
      availScore * 0.10
    );

    matches.push({
      trainerId: trainer.id,
      trainerName: trainer.name,
      trainerEmail: trainer.email,
      specialization: profile.specialization || '',
      matchScore,
      factors: {
        expertiseRelevance: { score: expertiseScore, weight: 0.30, details: expertiseDetails },
        experience: { score: expScore, weight: 0.20, details: expDetails },
        qualificationMatch: { score: qualScore, weight: 0.15, details: qualDetails },
        certificationMatch: { score: certScore, weight: 0.10, details: certDetails },
        traineeRating: { score: ratingScore, weight: 0.15, details: ratingDetails },
        availability: { score: availScore, weight: 0.10, details: availDetails },
      },
      rating: profile.rating,
      totalReviews: profile.totalReviews,
      expertise,
      certifications: certs,
      experienceYears: trainer.experienceYears,
      available: profile.available,
    });
  }

  return matches
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}

// ============================================================================
// RECOMMEND COURSES FOR A USER
// ============================================================================

export async function recommendCourses(
  userId: string,
  limit: number = 6
): Promise<CourseRecommendation[]> {
  // Get user's competency gaps
  const scores = await prisma.competencyScore.findMany({
    where: { userId },
    include: { competency: true },
  });

  const existingEnrollments = await prisma.enrollment.findMany({
    where: { userId },
    select: { courseId: true },
  });

  const enrolledCourseIds = new Set(existingEnrollments.map(e => e.courseId));

  // Get all published courses not already enrolled
  const courses = await prisma.course.findMany({
    where: {
      published: true,
      id: { notIn: Array.from(enrolledCourseIds) },
    },
    include: {
      trainer: { include: { trainerProfile: true } },
      competency: true,
      enrollments: true,
      feedbacks: true,
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { skills: true, interests: true, experienceYears: true },
  });

  const scoreMap = new Map(scores.map(s => [s.competencyId, s.score]));

  const recommendations: CourseRecommendation[] = [];

  for (const course of courses) {
    // Factor 1: Competency Match (40%) - higher if user has a gap in this competency
    const userScore = scoreMap.get(course.competencyId) ?? 0;
    const gap = Math.max(0, 70 - userScore); // 70 = org benchmark
    const competencyMatch = Math.min(100, gap * 2);

    // Factor 2: Difficulty Fit (25%) - appropriate for user's level
    const difficultyFit = calculateDifficultyFit(course.difficulty, userScore);

    // Factor 3: Trainer Rating (20%)
    const trainerRating = course.trainer.trainerProfile
      ? (course.trainer.trainerProfile.rating / 5) * 100
      : 50;

    // Factor 4: Popularity (15%)
    const totalEnrollments = course.enrollments.length;
    const completed = course.enrollments.filter(e => e.status === 'COMPLETED').length;
    const completionRate = totalEnrollments > 0 ? (completed / totalEnrollments) * 100 : 50;
    const popularityScore = Math.min(100, totalEnrollments * 10 + completionRate * 0.5);

    const relevanceScore = Math.round(
      competencyMatch * 0.40 +
      difficultyFit * 0.25 +
      trainerRating * 0.20 +
      popularityScore * 0.15
    );

    recommendations.push({
      courseId: course.id,
      title: course.title,
      description: course.description,
      difficulty: course.difficulty,
      durationHours: course.durationHours,
      trainerName: course.trainer.name,
      trainerRating: course.trainer.trainerProfile?.rating ?? 0,
      competencyName: course.competency.name,
      relevanceScore,
      enrollmentCount: totalEnrollments,
      completionRate: Math.round(completionRate),
      tags: safeParseJSON(course.tags),
    });
  }

  return recommendations
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit);
}

// ============================================================================
// HELPERS
// ============================================================================

function safeParseJSON(str: string): string[] {
  try {
    return JSON.parse(str);
  } catch {
    return [];
  }
}

function calculateRelevance(items: string[], target: string): number {
  if (items.length === 0) return 0;
  const targetLower = target.toLowerCase();
  let matches = 0;

  for (const item of items) {
    const itemLower = item.toLowerCase();
    if (
      itemLower.includes(targetLower) ||
      targetLower.includes(itemLower) ||
      targetLower.split(' ').some(word => itemLower.includes(word)) ||
      itemLower.split(' ').some(word => targetLower.includes(word))
    ) {
      matches++;
    }
  }

  return Math.min(100, (matches / items.length) * 100 + matches * 15);
}

function calculateDifficultyFit(difficulty: string, userScore: number): number {
  // Match course difficulty to user's level
  const userLevel = userScore < 30 ? 'BEGINNER' : userScore < 60 ? 'INTERMEDIATE' : 'ADVANCED';

  if (difficulty === userLevel) return 100;
  if (
    (difficulty === 'BEGINNER' && userLevel === 'INTERMEDIATE') ||
    (difficulty === 'INTERMEDIATE' && userLevel === 'ADVANCED')
  ) return 60; // Slightly below user level
  if (
    (difficulty === 'INTERMEDIATE' && userLevel === 'BEGINNER') ||
    (difficulty === 'ADVANCED' && userLevel === 'INTERMEDIATE')
  ) return 80; // One step above (good stretch)

  return 40; // Too far apart
}
