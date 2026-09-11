'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function TrainerTraineesPage() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        let trainerId = session?.user?.id;
        if (!trainerId) {
          const uRes = await fetch('/api/users?role=TRAINER');
          const trainers = await uRes.json();
          if (trainers.length > 0) trainerId = trainers[0].id;
        }

        const res = await fetch(`/api/courses?trainerId=${trainerId}`);
        const data = await res.json();
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [session?.user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Collect all enrollments
  const allEnrollments: any[] = [];
  courses.forEach((course) => {
    (course.enrollments || []).forEach((enr: any) => {
      allEnrollments.push({
        ...enr,
        courseTitle: course.title,
        competencyName: course.competency?.name,
      });
    });
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white">Trainee Participation & Performance Analytics</h2>
        <p className="text-xs text-slate-400 mt-1">
          Monitor trainee learning progress, completion rates, and assessment readiness across your curriculums.
        </p>
      </div>

      <Card className="border-slate-800 bg-slate-900/90">
        <CardHeader>
          <div>
            <CardTitle>Active Trainee Cohort</CardTitle>
            <CardDescription>{allEnrollments.length} total active and completed learner enrollments</CardDescription>
          </div>
        </CardHeader>

        {allEnrollments.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No trainees enrolled in your courses yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Trainee Name</th>
                  <th className="py-3 px-4">Enrolled Course</th>
                  <th className="py-3 px-4">Competency</th>
                  <th className="py-3 px-4">Curriculum Progress</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {allEnrollments.map((enr, i) => (
                  <tr key={i} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-4 font-semibold text-white">
                      {enr.user?.name || `Trainee #${i + 1}`}
                    </td>
                    <td className="py-3 px-4 text-slate-300">{enr.courseTitle}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800/40 text-[10px]">
                        {enr.competencyName || 'Technical'}
                      </span>
                    </td>
                    <td className="py-3 px-4 w-44">
                      <div className="flex items-center gap-2">
                        <Progress value={enr.progress} size="sm" color={enr.progress === 100 ? 'emerald' : 'blue'} />
                        <span className="text-[11px] font-bold text-slate-200">{enr.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={enr.status === 'COMPLETED' ? 'success' : 'info'}>
                        {enr.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
