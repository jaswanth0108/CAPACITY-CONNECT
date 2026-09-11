'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CourseCard } from '@/components/course-card';
import { TrainerCard } from '@/components/trainer-card';

function RecommendationsContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const initialCompetency = searchParams.get('competency') || 'Data Analytics';

  const [selectedCompetency, setSelectedCompetency] = useState(initialCompetency);
  const [courses, setCourses] = useState<any[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [gaps, setGaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const competencyOptions = [
    'Data Analytics',
    'Cloud Computing',
    'Cybersecurity',
    'Project Management',
    'AI & Machine Learning',
    'DevOps',
    'Software Engineering',
    'Agile Methodologies',
  ];

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        setLoading(true);
        let activeUserId = session?.user?.id;
        if (!activeUserId) {
          const uRes = await fetch('/api/users?role=TRAINEE');
          const users = await uRes.json();
          if (users.length > 0) activeUserId = users[0].id;
        }

        const [recCoursesRes, recTrainersRes, scoresRes] = await Promise.all([
          fetch(`/api/recommendations/courses?userId=${activeUserId}`),
          fetch(`/api/recommendations/trainers?competency=${encodeURIComponent(selectedCompetency)}`),
          fetch(`/api/competencies/scores?userId=${activeUserId}`),
        ]);

        const [coursesData, trainersData, scoresData] = await Promise.all([
          recCoursesRes.json(),
          recTrainersRes.json(),
          scoresRes.json(),
        ]);

        setCourses(Array.isArray(coursesData) ? coursesData : []);
        setTrainers(Array.isArray(trainersData) ? trainersData : []);
        setGaps(scoresData?.gaps || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, [selectedCompetency, session?.user?.id]);

  const currentGap = gaps.find((g) => g.competencyName.toLowerCase() === selectedCompetency.toLowerCase());

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
            Competency Intelligence Engine
          </span>
          <span className="text-xs text-slate-400">• Algorithmic Recommendation</span>
        </div>
        <h2 className="text-2xl font-black text-white">Intelligent Course & Trainer Matching</h2>
        <p className="text-xs text-slate-300 mt-1">
          Transparent, explainable recommendations tailored directly to your detected skill deficiencies.
        </p>
      </div>

      {/* Target Competency Gap Selector */}
      <Card className="bg-slate-900/90 border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Select Target Competency Gap:
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{selectedCompetency}</span>
              {currentGap && (
                <Badge variant={currentGap.gapSeverity === 'HIGH' ? 'danger' : 'warning'}>
                  {currentGap.gapSeverity} Gap (-{currentGap.gap}%)
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {competencyOptions.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCompetency(c)}
                className={`px-3 py-1.5 text-xs rounded-xl font-medium transition ${
                  selectedCompetency === c
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Loading state */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Section 1: Explainable Trainer Match Cards */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>🎓 Matched Certified Trainers</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                    Explainable AI Match
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Algorithmic scoring factoring Expertise, Experience, Qualifications, Certifications, Ratings & Availability
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trainers.map((trainer) => (
                <TrainerCard
                  key={trainer.trainerId}
                  trainer={trainer}
                  gapCompetency={selectedCompetency}
                />
              ))}
            </div>
          </div>

          {/* Section 2: Recommended Courses */}
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-white">📚 Recommended Learning Curriculums</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Targeted courses calculated to close your {selectedCompetency} competency deficit
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <CourseCard
                  key={course.courseId || course.id}
                  course={course}
                  currentUserId={session?.user?.id}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function RecommendationsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <RecommendationsContent />
    </Suspense>
  );
}
