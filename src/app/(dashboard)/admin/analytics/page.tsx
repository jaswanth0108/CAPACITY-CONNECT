'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CompetencyGapBarChart, TrainerUtilizationBarChart, LevelDistributionPieChart } from '@/components/charts/analytics-charts';
import { Badge } from '@/components/ui/badge';

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch('/api/analytics');
        const data = await res.json();
        setAnalytics(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const summary = analytics?.summary || {};
  const gaps = analytics?.competencyGapAnalysis || [];
  const trainers = analytics?.trainerCapacity || [];
  const distribution = analytics?.levelDistribution || {};

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-white">Executive Capacity & Competency Analytics</h2>
        <p className="text-xs text-slate-400 mt-1">
          Deep-dive telemetry into organizational talent capability, deficit areas, training ROI, and certification metrics.
        </p>
      </div>

      {/* Row 1: High level gap chart & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-8 border-slate-800 bg-slate-900/90">
          <CardHeader>
            <div>
              <CardTitle className="text-rose-400">Competency Gap Deficit Ranking</CardTitle>
              <CardDescription>Comparison against 70% Organizational Competency Target</CardDescription>
            </div>
          </CardHeader>
          <CompetencyGapBarChart data={gaps} />
        </Card>

        <Card className="lg:col-span-4 border-slate-800 bg-slate-900/90">
          <CardHeader>
            <div>
              <CardTitle>Member Competency Levels</CardTitle>
              <CardDescription>Distribution across 5 standard tiers</CardDescription>
            </div>
          </CardHeader>
          <LevelDistributionPieChart distribution={distribution} />
        </Card>
      </div>

      {/* Row 2: Trainer Capacity & Utilization */}
      <Card className="border-slate-800 bg-slate-900/90">
        <CardHeader>
          <div>
            <CardTitle>Trainer Capacity, Reach & Pass Rates</CardTitle>
            <CardDescription>Number of trainees mentored and course completion ratios</CardDescription>
          </div>
        </CardHeader>
        <TrainerUtilizationBarChart data={trainers} />
      </Card>

      {/* Detailed metrics table */}
      <Card className="border-slate-800 bg-slate-900/90">
        <CardHeader>
          <div>
            <CardTitle>Competency Domain Performance Table</CardTitle>
            <CardDescription>Comprehensive audit across all 10 tracked organizational competencies</CardDescription>
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Domain Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Assessed Members</th>
                <th className="py-3 px-4">Org Average Score</th>
                <th className="py-3 px-4">Target Benchmark</th>
                <th className="py-3 px-4">Deficit / Gap</th>
                <th className="py-3 px-4">Severity Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {gaps.map((g: any) => (
                <tr key={g.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                    <span>{g.icon}</span>
                    <span>{g.name}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{g.category}</td>
                  <td className="py-3 px-4 text-slate-200">{g.traineeCount} Trainees</td>
                  <td className="py-3 px-4 font-semibold text-slate-200">{g.avgScore}%</td>
                  <td className="py-3 px-4 text-emerald-400 font-semibold">{g.targetScore}%</td>
                  <td className="py-3 px-4 font-black text-rose-400">-{g.gap}%</td>
                  <td className="py-3 px-4">
                    <Badge variant={g.gapSeverity === 'HIGH' ? 'danger' : g.gapSeverity === 'MEDIUM' ? 'warning' : 'success'}>
                      {g.gapSeverity}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
