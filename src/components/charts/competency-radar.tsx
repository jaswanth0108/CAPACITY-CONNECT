'use client';

import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

interface CompetencyRadarProps {
  scores: Array<{
    competencyName: string;
    score: number;
    targetScore?: number;
  }>;
}

export function CompetencyRadarChart({ scores }: CompetencyRadarProps) {
  if (!scores || scores.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-500">
        No competency assessments recorded yet.
      </div>
    );
  }

  const data = scores.map((s) => ({
    subject: s.competencyName,
    current: s.score,
    benchmark: s.targetScore || 70,
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: '#64748b', fontSize: 10 }}
          />
          <Radar
            name="Your Competency Score"
            dataKey="current"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.45}
          />
          <Radar
            name="Org Target Benchmark (70%)"
            dataKey="benchmark"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.15}
            strokeDasharray="4 4"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#f8fafc',
            }}
          />
          <Legend
            wrapperStyle={{
              fontSize: '12px',
              paddingTop: '10px',
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
