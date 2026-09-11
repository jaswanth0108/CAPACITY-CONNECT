'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CompetencyGapBarChart, TrainerUtilizationBarChart, LevelDistributionPieChart } from '@/components/charts/analytics-charts';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
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
    loadAnalytics();
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
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-950/40 via-purple-950/40 to-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/60">
              Admin & Executive Control
            </span>
            <span className="text-xs text-slate-400">• Organization-wide Oversight</span>
          </div>
          <h2 className="text-2xl font-black text-white">Capacity Intelligence & Governance ⚡</h2>
          <p className="text-xs text-slate-300 mt-1">
            Real-time analytics across {summary.totalUsers} registered organization members and {summary.totalCourses} capacity curriculums.
          </p>
        </div>

        <div className="flex gap-2">
          {summary.pendingUsersCount > 0 && (
            <Link href="/admin/users">
              <Button variant="danger" size="sm" className="animate-pulse">
                Approve {summary.pendingUsersCount} Pending Users ⚠️
              </Button>
            </Link>
          )}
          <Link href="/admin/announcements">
            <Button variant="outline" size="sm">
              📢 Post Announcement
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="bg-slate-900/80 p-4">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Members</span>
          <p className="text-2xl font-black text-white mt-1">{summary.totalUsers}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">{summary.traineesCount} Trainees, {summary.trainersCount} Trainers</p>
        </Card>

        <Card className="bg-slate-900/80 p-4">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Curriculums</span>
          <p className="text-2xl font-black text-blue-400 mt-1">{summary.totalCourses}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">{summary.totalEnrollments} Active Enrollments</p>
        </Card>

        <Card className="bg-slate-900/80 p-4">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Completion Rate</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">{summary.completionRate}%</p>
          <p className="text-[10px] text-slate-500 mt-0.5">{summary.completedEnrollments} Completed</p>
        </Card>

        <Card className="bg-slate-900/80 p-4">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Assessment Avg</span>
          <p className="text-2xl font-black text-indigo-400 mt-1">{summary.avgAssessmentScore}%</p>
          <p className="text-[10px] text-slate-500 mt-0.5">{summary.assessmentPassRate}% Pass Rate</p>
        </Card>

        <Card className="bg-slate-900/80 p-4">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Certificates</span>
          <p className="text-2xl font-black text-amber-400 mt-1">{summary.totalCertificates}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Verified Credentials</p>
        </Card>

        <Card className="bg-slate-900/80 p-4">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Pending Approvals</span>
          <p className={`text-2xl font-black mt-1 ${summary.pendingUsersCount > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
            {summary.pendingUsersCount}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Awaiting RBAC Approval</p>
        </Card>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Competency Gap Deficits */}
        <Card className="lg:col-span-8 bg-slate-900/90">
          <CardHeader>
            <div>
              <CardTitle className="text-rose-400">⚡ Top Organizational Competency Gaps</CardTitle>
              <CardDescription>Deficit between Organization Benchmark (70%) and Trainee Average Score</CardDescription>
            </div>
            <Link href="/admin/analytics">
              <span className="text-xs text-blue-400 hover:underline">Full Analytics →</span>
            </Link>
          </CardHeader>
          <CompetencyGapBarChart data={gaps} />
        </Card>

        {/* Competency Level Distribution */}
        <Card className="lg:col-span-4 bg-slate-900/90">
          <CardHeader>
            <div>
              <CardTitle>Skill Tier Distribution</CardTitle>
              <CardDescription>Members across 5 competency levels</CardDescription>
            </div>
          </CardHeader>
          <LevelDistributionPieChart distribution={distribution} />
        </Card>
      </div>

      {/* Trainer Utilization & Capacity */}
      <Card className="bg-slate-900/90">
        <CardHeader>
          <div>
            <CardTitle>🎓 Trainer Capacity & Instructional Utilization</CardTitle>
            <CardDescription>Trainee reach, completion efficiency, and instructor review metrics</CardDescription>
          </div>
        </CardHeader>
        <TrainerUtilizationBarChart data={trainers} />
      </Card>

      {/* Detailed Gaps Table */}
      <Card className="bg-slate-900/90">
        <CardHeader>
          <div>
            <CardTitle>Organizational Competency Gap Matrix</CardTitle>
            <CardDescription>Ranked by highest severity gap deficit</CardDescription>
          </div>
          <Link href="/admin/competencies">
            <span className="text-xs text-blue-400 hover:underline">Manage Framework →</span>
          </Link>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Competency Domain</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Org Average Score</th>
                <th className="py-3 px-4">Target Benchmark</th>
                <th className="py-3 px-4">Deficit / Gap</th>
                <th className="py-3 px-4">Severity Tier</th>
                <th className="py-3 px-4">Available Courses</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {gaps.map((g: any) => (
                <tr key={g.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                    <span>{g.icon || '📊'}</span>
                    <span>{g.name}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{g.category}</td>
                  <td className="py-3 px-4 font-semibold text-slate-200">{g.avgScore}%</td>
                  <td className="py-3 px-4 text-emerald-400 font-semibold">{g.targetScore}%</td>
                  <td className="py-3 px-4 font-black text-rose-400">-{g.gap}%</td>
                  <td className="py-3 px-4">
                    <Badge variant={g.gapSeverity === 'HIGH' ? 'danger' : g.gapSeverity === 'MEDIUM' ? 'warning' : 'success'}>
                      {g.gapSeverity}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{g.courseCount} Courses</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
