'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function TrainerFeedbackPage() {
  const { data: session } = useSession();
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeedback() {
      try {
        setLoading(true);
        let trainerId = session?.user?.id;
        if (!trainerId) {
          const uRes = await fetch('/api/users?role=TRAINER');
          const trainers = await uRes.json();
          if (trainers.length > 0) trainerId = trainers[0].id;
        }

        const res = await fetch(`/api/feedback?trainerId=${trainerId}`);
        const data = await res.json();
        setFeedbacks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadFeedback();
  }, [session?.user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const avgRating = feedbacks.length > 0
    ? Math.round((feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length) * 10) / 10
    : 4.8;

  const ratingCounts = {
    5: feedbacks.filter((f) => f.rating === 5).length,
    4: feedbacks.filter((f) => f.rating === 4).length,
    3: feedbacks.filter((f) => f.rating === 3).length,
    2: feedbacks.filter((f) => f.rating === 2).length,
    1: feedbacks.filter((f) => f.rating === 1).length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white">Trainee Reviews & Rating Intelligence</h2>
        <p className="text-xs text-slate-400 mt-1">
          Learner feedback directly contributes a 15% weight to your AI Trainer Recommendation match score.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Rating summary */}
        <Card className="md:col-span-5 border-slate-800 bg-slate-900/90 text-center p-6 flex flex-col justify-center">
          <span className="text-4xl mb-1">⭐</span>
          <h3 className="text-4xl font-black text-white">{avgRating.toFixed(1)}</h3>
          <p className="text-xs text-amber-400 font-semibold mt-1">Overall Instructor Quality</p>
          <p className="text-[11px] text-slate-400 mb-6">Based on {feedbacks.length} student evaluations</p>

          <div className="space-y-2 text-left text-xs">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingCounts[star as keyof typeof ratingCounts] || 0;
              const pct = feedbacks.length > 0 ? (count / feedbacks.length) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="w-12 text-slate-400 text-[11px]">{star} Stars</span>
                  <div className="flex-1">
                    <Progress value={pct} size="sm" color="amber" />
                  </div>
                  <span className="w-6 text-right text-slate-400 text-[10px]">{count}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Feedback list */}
        <div className="md:col-span-7 space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            Qualitative Reviews & Comments
          </h3>

          {feedbacks.length === 0 ? (
            <p className="text-xs text-slate-500 py-8 text-center bg-slate-900/40 rounded-xl border border-dashed border-slate-800">
              No written reviews yet.
            </p>
          ) : (
            feedbacks.map((f) => (
              <Card key={f.id} className="border-slate-800 bg-slate-900/80 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white text-xs">{f.user?.name || 'Anonymous Trainee'}</span>
                  <span className="text-amber-400 font-semibold text-xs">⭐ {f.rating}/5</span>
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed mb-2">
                  &ldquo;{f.comment}&rdquo;
                </p>
                <p className="text-[10px] text-indigo-400 font-medium">
                  Course: {f.course?.title}
                </p>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
