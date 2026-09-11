'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

export default function AssessmentsListPage() {
  const { data: session } = useSession();
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAssessments() {
      try {
        setLoading(true);
        const res = await fetch('/api/assessments');
        const data = await res.json();
        setAssessments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAssessments();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-white">Competency Assessments & MCQ Questionnaires</h2>
        <p className="text-xs text-slate-400 mt-1">
          Validate your skills to upgrade your organizational competency score and earn verified credentials.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : assessments.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
          <p className="text-sm text-slate-400">No assessments scheduled at this moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assessments.map((a) => {
            const attempts = a.attempts || [];
            const userAttempt = session?.user?.id
              ? attempts.find((att: any) => att.userId === session.user.id)
              : attempts.length > 0
              ? attempts[0]
              : null;

            const isPassed = userAttempt?.passed;

            return (
              <Card key={a.id} className="border-slate-800 bg-slate-900/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/60">
                      {a.course?.competency?.name || 'Competency'}
                    </span>
                    {userAttempt && (
                      <Badge variant={isPassed ? 'success' : 'danger'}>
                        {isPassed ? `Passed (${userAttempt.score}%)` : `Failed (${userAttempt.score}%)`}
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white mb-1">{a.title}</h3>
                  <p className="text-xs text-slate-400 mb-4">
                    Course: <strong className="text-slate-300">{a.course?.title}</strong>
                  </p>

                  <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] mb-4">
                    <div>
                      <span className="text-slate-500 block">Passing Mark</span>
                      <span className="text-slate-200 font-semibold">{a.passingScore}%</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Time Limit</span>
                      <span className="text-slate-200 font-semibold">{a.timeLimitMinutes} Mins</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Questions</span>
                      <span className="text-slate-200 font-semibold">{a.questions?.length || 5} MCQs</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">
                    Trainer: {a.course?.trainer?.name || 'Lead Trainer'}
                  </span>
                  <Link href={`/trainee/assessments/${a.id}`}>
                    <Button variant={isPassed ? 'outline' : 'primary'} size="sm">
                      {isPassed ? 'Retake / Review Quiz' : 'Start MCQ Assessment →'}
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
