'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function TrainerDashboard() {
  const { data: session } = useSession();
  const [trainerData, setTrainerData] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        let trainerId = session?.user?.id;
        if (!trainerId) {
          const uRes = await fetch('/api/users?role=TRAINER');
          const trainers = await uRes.json();
          if (trainers.length > 0) trainerId = trainers[0].id; // Priya Sharma
        }

        if (!trainerId) return;

        const [userRes, coursesRes, feedbackRes] = await Promise.all([
          fetch(`/api/users/${trainerId}`),
          fetch(`/api/courses?trainerId=${trainerId}`),
          fetch(`/api/feedback?trainerId=${trainerId}`),
        ]);

        const [uData, cData, fData] = await Promise.all([
          userRes.json(),
          coursesRes.json(),
          feedbackRes.json(),
        ]);

        setTrainerData(uData);
        setCourses(Array.isArray(cData) ? cData : []);
        setFeedbacks(Array.isArray(fData) ? fData : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, [session?.user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Aggregate metrics
  let totalTrainees = 0;
  let completedTrainees = 0;
  courses.forEach((c) => {
    totalTrainees += c.enrollments?.length || 0;
    completedTrainees += (c.enrollments || []).filter((e: any) => e.status === 'COMPLETED').length;
  });

  const completionRate = totalTrainees > 0 ? Math.round((completedTrainees / totalTrainees) * 100) : 0;
  const rating = trainerData?.trainerProfile?.rating || 4.8;
  const reviewsCount = trainerData?.trainerProfile?.totalReviews || feedbacks.length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-950/40 to-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60">
              Trainer Studio
            </span>
            <span className="text-xs text-slate-400">• Instructional Leadership</span>
          </div>
          <h2 className="text-2xl font-black text-white">
            Welcome back, {trainerData?.name || 'Priya Sharma'} 🎓
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {trainerData?.trainerProfile?.specialization || 'Data Science & Machine Learning Lead'} • You have{' '}
            <strong className="text-white">{totalTrainees} enrolled trainees</strong> across your courses.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Link href="/trainer/courses/new">
            <Button variant="primary" size="sm">
              + Create New Course
            </Button>
          </Link>
          <Link href="/trainer/assessments">
            <Button variant="outline" size="sm">
              Assessment Studio
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-900/80">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Courses Published</span>
          <p className="text-2xl font-black text-indigo-400 mt-1">{courses.length}</p>
          <p className="text-[10px] text-slate-500 mt-1">Active curriculum programs</p>
        </Card>

        <Card className="bg-slate-900/80">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Trainees Reached</span>
          <p className="text-2xl font-black text-blue-400 mt-1">{totalTrainees}</p>
          <p className="text-[10px] text-slate-500 mt-1">Total enrollments</p>
        </Card>

        <Card className="bg-slate-900/80">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Completion Rate</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">{completionRate}%</p>
          <p className="text-[10px] text-slate-500 mt-1">Graduate success percentage</p>
        </Card>

        <Card className="bg-slate-900/80">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Instructor Rating</span>
          <p className="text-2xl font-black text-amber-400 mt-1 flex items-center gap-1">
            ⭐ {rating.toFixed(1)}
          </p>
          <p className="text-[10px] text-slate-500 mt-1">Based on {reviewsCount} trainee reviews</p>
        </Card>
      </div>

      {/* Courses Overview & Management */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">📚 Active Courses & Curriculums</h3>
            <p className="text-xs text-slate-400 mt-0.5">Manage study resources, assessments, and enrollments</p>
          </div>
          <Link href="/trainer/courses/new">
            <Button variant="primary" size="sm">
              + Add Course
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course) => {
            const enrCount = course.enrollments?.length || 0;
            const resCount = course.resources?.length || 0;
            const assCount = course.assessments?.length || 0;

            return (
              <Card key={course.id} className="border-slate-800 bg-slate-900/90 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                      {course.competency?.name || 'Competency'}
                    </span>
                    <Badge variant="success">Published</Badge>
                  </div>

                  <h4 className="text-base font-bold text-white mb-2">{course.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] mb-4">
                    <div>
                      <span className="text-slate-500 block">Enrolled Trainees</span>
                      <span className="text-slate-200 font-bold">{enrCount}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Study Materials</span>
                      <span className="text-slate-200 font-bold">{resCount} Files</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Assessments</span>
                      <span className="text-slate-200 font-bold">{assCount} Active</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex gap-2">
                  <Link href={`/trainer/courses/${course.id}`} className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full text-xs">
                      Manage Course Studio ⚙️
                    </Button>
                  </Link>
                  <Link href={`/trainer/trainees`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      View Trainees ({enrCount})
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Trainee Feedback & Ratings */}
      <Card className="bg-slate-900/90 border-slate-800">
        <CardHeader>
          <div>
            <CardTitle>Recent Trainee Feedback & Ratings</CardTitle>
            <CardDescription>Qualitative reviews and course evaluation scores</CardDescription>
          </div>
          <Link href="/trainer/feedback">
            <span className="text-xs text-indigo-400 hover:underline">View All →</span>
          </Link>
        </CardHeader>

        {feedbacks.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No feedback entries yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {feedbacks.slice(0, 4).map((f) => (
              <div key={f.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-white">{f.user?.name || 'Trainee'}</span>
                  <span className="text-amber-400 font-semibold">⭐ {f.rating}/5</span>
                </div>
                <p className="text-[11px] text-slate-400 italic leading-relaxed">
                  &ldquo;{f.comment}&rdquo;
                </p>
                <p className="text-[10px] text-indigo-400 mt-2 font-medium">
                  Course: {f.course?.title}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
