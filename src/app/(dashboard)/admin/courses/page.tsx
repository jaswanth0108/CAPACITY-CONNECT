'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadCourses() {
      try {
        setLoading(true);
        const res = await fetch('/api/courses');
        const data = await res.json();
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  const handleTogglePublish = async (courseId: string, currentPublished: boolean) => {
    setTogglingId(courseId);
    try {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !currentPublished }),
      });
      if (res.ok) {
        setCourses((prev) =>
          prev.map((c) => (c.id === courseId ? { ...c, published: !currentPublished } : c))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white">Course Catalog & Content Governance</h2>
        <p className="text-xs text-slate-400 mt-1">
          Review curriculum quality, manage availability in recommendation algorithms, and audit enrollments.
        </p>
      </div>

      <Card className="border-slate-800 bg-slate-900/90">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Course Title</th>
                <th className="py-3 px-4">Target Competency</th>
                <th className="py-3 px-4">Instructor</th>
                <th className="py-3 px-4">Difficulty</th>
                <th className="py-3 px-4">Enrollments</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {courses.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 px-4 font-bold text-white max-w-xs">{c.title}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/50 text-[10px]">
                      {c.competency?.name || 'Domain'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{c.trainer?.name}</td>
                  <td className="py-3 px-4">
                    <Badge variant={c.difficulty === 'BEGINNER' ? 'success' : c.difficulty === 'INTERMEDIATE' ? 'warning' : 'danger'}>
                      {c.difficulty}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-slate-200 font-semibold">{c.enrollments?.length || 0} Trainees</td>
                  <td className="py-3 px-4">
                    <Badge variant={c.published ? 'success' : 'default'}>
                      {c.published ? 'Published' : 'Draft'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant={c.published ? 'outline' : 'success'}
                      size="sm"
                      className="text-xs"
                      isLoading={togglingId === c.id}
                      onClick={() => handleTogglePublish(c.id, c.published)}
                    >
                      {c.published ? 'Unpublish' : 'Publish'}
                    </Button>
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
