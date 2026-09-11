'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CompetencyBadge } from '@/components/competency-badge';

export default function CompetenciesPage() {
  const { data: session } = useSession();
  const [competencies, setCompetencies] = useState<any[]>([]);
  const [scores, setScores] = useState<any[]>([]);
  const [gaps, setGaps] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        let activeUserId = session?.user?.id;
        if (!activeUserId) {
          const uRes = await fetch('/api/users?role=TRAINEE');
          const users = await uRes.json();
          if (users.length > 0) activeUserId = users[0].id;
        }

        const [compRes, scoresRes] = await Promise.all([
          fetch('/api/competencies'),
          fetch(`/api/competencies/scores?userId=${activeUserId}`),
        ]);

        const [compData, scoresData] = await Promise.all([
          compRes.json(),
          scoresRes.json(),
        ]);

        setCompetencies(Array.isArray(compData) ? compData : []);
        setScores(scoresData?.scores || []);
        setGaps(scoresData?.gaps || []);
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
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const scoreMap = new Map(scores.map((s: any) => [s.competencyId, s]));
  const gapMap = new Map(gaps.map((g: any) => [g.competencyId, g]));

  const categories = ['ALL', 'Technical', 'Management', 'Soft Skills'];
  const filtered = selectedCategory === 'ALL'
    ? competencies
    : competencies.filter((c) => c.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🎯 Competency Intelligence Framework</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time evaluation across 5 tiers: Beginner (0-20) → Developing (21-40) → Proficient (41-60) → Advanced (61-80) → Expert (81-100)
          </p>
        </div>
        <div className="flex items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs rounded-xl font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Competencies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((comp) => {
          const userScore = scoreMap.get(comp.id);
          const gapInfo = gapMap.get(comp.id);
          const currentScore = userScore?.score || 0;
          const currentLevel = userScore?.level || 'BEGINNER';
          const hasGap = !!gapInfo && gapInfo.gap > 0;

          return (
            <Card key={comp.id} className="border-slate-800 bg-slate-900/80">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{comp.icon || '📊'}</span>
                  <div>
                    <h3 className="text-sm font-bold text-white">{comp.name}</h3>
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      {comp.category}
                    </span>
                  </div>
                </div>
                <CompetencyBadge level={currentLevel} score={currentScore} showScore />
              </div>

              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                {comp.description}
              </p>

              {/* Progress bar vs benchmark */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800/80 mb-3">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Current Competency:</span>
                  <span className="font-bold text-white">{currentScore}%</span>
                </div>
                <Progress
                  value={currentScore}
                  size="sm"
                  color={
                    currentScore >= 81 ? 'emerald' : currentScore >= 61 ? 'purple' : currentScore >= 41 ? 'blue' : 'amber'
                  }
                />
                <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
                  <span>Beginner (0)</span>
                  <span className="text-emerald-400 font-semibold">Org Target: 70%</span>
                  <span>Expert (100)</span>
                </div>
              </div>

              {/* Gap Status & Action */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                {hasGap ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-rose-400 font-bold">
                      Deficit: -{gapInfo.gap}%
                    </span>
                    <Badge variant={gapInfo.gapSeverity === 'HIGH' ? 'danger' : 'warning'}>
                      {gapInfo.gapSeverity} Gap
                    </Badge>
                  </div>
                ) : (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    ✓ Meets Org Target
                  </span>
                )}

                <Link href={`/trainee/recommendations?competency=${encodeURIComponent(comp.name)}`}>
                  <Button variant="outline" size="sm" className="text-xs">
                    Find Trainers & Courses →
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
