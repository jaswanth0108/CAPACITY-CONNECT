'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { CourseCard } from '@/components/course-card';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function CourseBrowserPage() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState<any[]>([]);
  const [competencies, setCompetencies] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCompetency, setSelectedCompetency] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [cRes, compRes] = await Promise.all([
          fetch('/api/courses'),
          fetch('/api/competencies'),
        ]);
        const [cData, compData] = await Promise.all([cRes.json(), compRes.json()]);
        setCourses(Array.isArray(cData) ? cData : []);
        setCompetencies(Array.isArray(compData) ? compData : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleEnroll = async (courseId: string) => {
    let activeUserId = session?.user?.id;
    if (!activeUserId) {
      const uRes = await fetch('/api/users?role=TRAINEE');
      const users = await uRes.json();
      if (users.length > 0) activeUserId = users[0].id;
    }

    if (!activeUserId) return;

    try {
      setEnrollingId(courseId);
      const res = await fetch(`/api/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: activeUserId }),
      });
      if (res.ok) {
        // Refresh course list
        const updatedRes = await fetch('/api/courses');
        const updated = await updatedRes.json();
        setCourses(updated);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEnrollingId(null);
    }
  };

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchesCompetency =
      selectedCompetency === 'ALL' || c.competencyId === selectedCompetency;
    const matchesDifficulty =
      selectedDifficulty === 'ALL' || c.difficulty === selectedDifficulty;
    return matchesSearch && matchesCompetency && matchesDifficulty;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-white">Course Catalog & Learning Curriculums</h2>
        <p className="text-xs text-slate-400 mt-1">
          Explore courses across technical, leadership, and management domains taught by verified industry trainers.
        </p>
      </div>

      {/* Filter Bar */}
      <Card className="bg-slate-900/80 border-slate-800 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Search Catalog</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by keywords, titles, technologies..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Competency Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Filter by Competency</label>
            <select
              value={selectedCompetency}
              onChange={(e) => setSelectedCompetency(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Competencies</option>
              {competencies.map((comp) => (
                <option key={comp.id} value={comp.id}>
                  {comp.name}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Filter by Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Difficulties</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Results grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800">
          <p className="text-sm text-slate-400">No courses match your filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              currentUserId={session?.user?.id}
              onEnroll={handleEnroll}
              isEnrolling={enrollingId === course.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
