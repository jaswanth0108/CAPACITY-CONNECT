'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CompetencyRadarChart } from '@/components/charts/competency-radar';
import { CompetencyBadge } from '@/components/competency-badge';
import { CourseCard } from '@/components/course-card';
import { TrainerCard } from '@/components/trainer-card';

export default function TraineeDashboard() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [competencyData, setCompetencyData] = useState<any>({ scores: [], gaps: [] });
  const [recommendedCourses, setRecommendedCourses] = useState<any[]>([]);
  const [recommendedTrainers, setRecommendedTrainers] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);

  // Default fallback to Rahul Kumar demo ID if not logged in yet
  const userId = session?.user?.id || 'rahul-demo';

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);

        // Fetch users to find current user ID or fallback to Rahul Kumar
        let activeUserId = session?.user?.id;
        if (!activeUserId) {
          const usersRes = await fetch('/api/users?role=TRAINEE');
          const users = await usersRes.json();
          if (users.length > 0) {
            activeUserId = users[0].id; // Rahul Kumar
          }
        }

        if (!activeUserId) return;

        // Parallel fetch of all trainee dashboard data
        const [scoresRes, recCoursesRes, recTrainersRes, userRes, certsRes] = await Promise.all([
          fetch(`/api/competencies/scores?userId=${activeUserId}`),
          fetch(`/api/recommendations/courses?userId=${activeUserId}`),
          fetch(`/api/recommendations/trainers?competency=Data Analytics`),
          fetch(`/api/users/${activeUserId}`),
          fetch(`/api/certificates?userId=${activeUserId}`),
        ]);

        const [scoresData, coursesData, trainersData, userData, certsData] = await Promise.all([
          scoresRes.json(),
          recCoursesRes.json(),
          recTrainersRes.json(),
          userRes.json(),
          certsRes.json(),
        ]);

        setCompetencyData(scoresData);
        setRecommendedCourses(Array.isArray(coursesData) ? coursesData : []);
        setRecommendedTrainers(Array.isArray(trainersData) ? trainersData : []);
        if (userData?.enrollments) setEnrollments(userData.enrollments);
        if (Array.isArray(certsData)) setCertificates(certsData);
      } catch (err) {
        console.error('Error loading trainee dashboard:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [session?.user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400">Loading your Capacity Intelligence Dashboard...</p>
        </div>
      </div>
    );
  }

  const radarScores = (competencyData.scores || []).map((s: any) => ({
    competencyName: s.competency?.name || 'Skill',
    score: s.score,
    targetScore: 70,
  }));

  const topGaps = (competencyData.gaps || []).slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-950/40 to-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/60">
              Trainee Portal
            </span>
            <span className="text-xs text-slate-400">• Continuous Capacity Building</span>
          </div>
          <h2 className="text-2xl font-black text-white">
            Welcome back, {session?.user?.name || 'Rahul Kumar'} 👋
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Your current competency profile shows <strong className="text-amber-400">{topGaps.length} priority skill gaps</strong> compared to organizational benchmarks. Review your recommendations below to start upskilling.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Link href="/trainee/recommendations">
            <Button variant="primary" size="sm">
              View AI Recommendations ✨
            </Button>
          </Link>
          <Link href="/trainee/assessments">
            <Button variant="outline" size="sm">
              Assessments ({enrollments.length})
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-900/80">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Identified Gaps</span>
          <p className="text-2xl font-black text-amber-400 mt-1">{competencyData.gaps?.length || 0}</p>
          <p className="text-[10px] text-slate-500 mt-1">Gaps below 70% benchmark</p>
        </Card>

        <Card className="bg-slate-900/80">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Active Courses</span>
          <p className="text-2xl font-black text-blue-400 mt-1">
            {enrollments.filter((e) => e.status !== 'COMPLETED').length}
          </p>
          <p className="text-[10px] text-slate-500 mt-1">In progress learning modules</p>
        </Card>

        <Card className="bg-slate-900/80">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Competency Level</span>
          <p className="text-2xl font-black text-indigo-400 mt-1">Proficient</p>
          <p className="text-[10px] text-slate-500 mt-1">Across 10 measured domains</p>
        </Card>

        <Card className="bg-slate-900/80">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Certificates Earned</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">{certificates.length}</p>
          <p className="text-[10px] text-slate-500 mt-1">Verified credential badges</p>
        </Card>
      </div>

      {/* Section 1: Competency Radar vs Identified Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Chart */}
        <Card className="lg:col-span-7 bg-slate-900/90">
          <CardHeader>
            <div>
              <CardTitle>Competency Assessment Radar</CardTitle>
              <CardDescription>Your current skill scores vs Organizational target benchmark (70%)</CardDescription>
            </div>
            <Link href="/trainee/competencies">
              <span className="text-xs text-blue-400 hover:underline">View All →</span>
            </Link>
          </CardHeader>
          <CompetencyRadarChart scores={radarScores} />
        </Card>

        {/* Priority Skill Gaps */}
        <Card className="lg:col-span-5 bg-slate-900/90 flex flex-col justify-between">
          <div>
            <CardHeader>
              <div>
                <CardTitle className="text-rose-400">⚡ Top Detected Skill Gaps</CardTitle>
                <CardDescription>Targeted competencies requiring immediate upskilling</CardDescription>
              </div>
            </CardHeader>

            <div className="space-y-3 mt-1">
              {topGaps.map((gap: any) => (
                <div
                  key={gap.competencyId}
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{gap.competencyIcon || '🎯'}</span>
                      <span className="text-xs font-bold text-white">{gap.competencyName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="text-slate-400">Current: {gap.currentScore}%</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-amber-400 font-semibold">Deficit: -{gap.gap}%</span>
                    </div>
                  </div>
                  <Badge variant={gap.gapSeverity === 'HIGH' ? 'danger' : 'warning'}>
                    {gap.gapSeverity} Gap
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <Link href="/trainee/recommendations" className="mt-4 block">
            <Button variant="outline" size="sm" className="w-full text-xs">
              Resolve Gaps with Course Recommendations →
            </Button>
          </Link>
        </Card>
      </div>

      {/* Section 2: Explainable Trainer Matching (The Core Innovation!) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🧠 Explainable Trainer Match</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                Core Innovation
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Based on your priority gap in <strong className="text-white">Data Analytics</strong>, here is the algorithmic match:
            </p>
          </div>
          <Link href="/trainee/recommendations" className="text-xs text-blue-400 hover:underline">
            View all matched trainers →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendedTrainers.slice(0, 2).map((trainer) => (
            <TrainerCard
              key={trainer.trainerId}
              trainer={trainer}
              gapCompetency="Data Analytics"
            />
          ))}
        </div>
      </div>

      {/* Section 3: Recommended Courses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">📚 Tailored Course Recommendations</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Curated by the Competency Intelligence Engine to resolve your specific skill deficits
            </p>
          </div>
          <Link href="/trainee/courses" className="text-xs text-blue-400 hover:underline">
            Browse full catalog →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedCourses.slice(0, 3).map((course) => (
            <CourseCard
              key={course.courseId || course.id}
              course={course}
              currentUserId={session?.user?.id}
            />
          ))}
        </div>
      </div>

      {/* Section 4: In Progress Learning Modules */}
      {enrollments.length > 0 && (
        <Card className="bg-slate-900/80">
          <CardHeader>
            <CardTitle>My Current Learning Modules</CardTitle>
            <CardDescription>Track video modules, PDFs, and prepare for MCQs</CardDescription>
          </CardHeader>
          <div className="space-y-3">
            {enrollments.map((enr: any) => (
              <div
                key={enr.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white">{enr.course.title}</h4>
                    <Badge variant={enr.status === 'COMPLETED' ? 'success' : 'info'}>
                      {enr.status}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Instructor: {enr.course.trainer?.name || 'Senior Trainer'} • {enr.course.durationHours} hrs
                  </p>
                </div>
                <div className="w-full sm:w-60 flex items-center gap-3">
                  <div className="flex-1">
                    <Progress value={enr.progress} size="sm" color={enr.progress === 100 ? 'emerald' : 'blue'} />
                  </div>
                  <span className="text-xs font-bold text-slate-300 w-10 text-right">{enr.progress}%</span>
                  <Link href={`/trainee/courses/${enr.course.id}`}>
                    <Button variant="secondary" size="sm" className="text-xs">
                      {enr.progress === 100 ? 'Review' : 'Resume'}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
