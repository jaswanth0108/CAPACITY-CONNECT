'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';

export default function TrainerCourseStudioPage() {
  const { id } = useParams<{ id: string }>();

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [resTitle, setResTitle] = useState('');
  const [resType, setResType] = useState('VIDEO');
  const [resUrl, setResUrl] = useState('');
  const [resMinutes, setResMinutes] = useState(45);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function loadCourse() {
      try {
        setLoading(true);
        const res = await fetch(`/api/courses/${id}`);
        const data = await res.json();
        setCourse(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadCourse();
  }, [id]);

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const res = await fetch(`/api/courses/${id}/resources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: resTitle,
          type: resType,
          url: resUrl,
          durationMinutes: Number(resMinutes),
          orderIndex: (course.resources?.length || 0) + 1,
        }),
      });

      if (res.ok) {
        const newRes = await res.json();
        setCourse((prev: any) => ({
          ...prev,
          resources: [...(prev.resources || []), newRes],
        }));
        setShowResourceModal(false);
        setResTitle('');
        setResUrl('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) {
    return <div className="text-center py-16 text-slate-400">Course not found</div>;
  }

  const resources = course.resources || [];
  const enrollments = course.enrollments || [];
  const assessments = course.assessments || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="purple">{course.competency?.name}</Badge>
            <Badge variant="info">{course.difficulty}</Badge>
            <span className="text-xs text-slate-400">• {course.durationHours} hrs</span>
          </div>
          <h2 className="text-2xl font-black text-white">{course.title}</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl line-clamp-1">{course.description}</p>
        </div>

        <div className="flex gap-2">
          <Button variant="primary" size="sm" onClick={() => setShowResourceModal(true)}>
            + Upload Study Resource
          </Button>
          <Link href="/trainer/assessments">
            <Button variant="outline" size="sm">
              Manage Assessments
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Resources list */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-slate-800 bg-slate-900/90">
            <CardHeader>
              <div>
                <CardTitle>Uploaded Learning Materials</CardTitle>
                <CardDescription>Videos, PDF guides, presentations, and documents</CardDescription>
              </div>
              <span className="text-xs text-indigo-400 font-semibold">{resources.length} Modules</span>
            </CardHeader>

            {resources.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                No study resources uploaded yet. Click &ldquo;Upload Study Resource&rdquo; above.
              </div>
            ) : (
              <div className="space-y-2">
                {resources.map((r: any, i: number) => (
                  <div
                    key={r.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-slate-600 font-bold">#{i + 1}</span>
                      <div>
                        <p className="font-bold text-white">{r.title}</p>
                        <p className="text-[10px] text-slate-400">
                          {r.type} {r.durationMinutes ? `• ${r.durationMinutes} mins` : ''}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-medium bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Assessments linked */}
          <Card className="border-slate-800 bg-slate-900/90">
            <CardHeader>
              <div>
                <CardTitle>Linked MCQ Assessments</CardTitle>
                <CardDescription>Evaluations linked to this curriculum</CardDescription>
              </div>
              <Link href="/trainer/assessments">
                <span className="text-xs text-indigo-400 hover:underline">+ New Questionnaire</span>
              </Link>
            </CardHeader>

            {assessments.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs">
                No assessments linked. Create one from the Assessment Studio.
              </div>
            ) : (
              <div className="space-y-2">
                {assessments.map((a: any) => (
                  <div key={a.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white">{a.title}</p>
                      <p className="text-[10px] text-slate-400">Passing score: {a.passingScore}% • {a.timeLimitMinutes} mins</p>
                    </div>
                    <Badge variant="success">Published</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Enrolled Trainees */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-slate-800 bg-slate-900/90">
            <CardHeader>
              <div>
                <CardTitle>Enrolled Trainees</CardTitle>
                <CardDescription>Track participation and progress</CardDescription>
              </div>
              <span className="text-xs text-blue-400 font-bold">{enrollments.length} Trainees</span>
            </CardHeader>

            {enrollments.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                No trainees enrolled yet.
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {enrollments.map((enr: any) => (
                  <div key={enr.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{enr.user?.name || 'Trainee'}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${enr.status === 'COMPLETED' ? 'bg-emerald-950 text-emerald-400' : 'bg-blue-950 text-blue-400'}`}>
                        {enr.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Curriculum Progress:</span>
                      <span className="font-semibold text-slate-200">{enr.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Upload Resource Modal */}
      <Modal
        isOpen={showResourceModal}
        onClose={() => setShowResourceModal(false)}
        title="Upload Learning Material"
        description="Add a video lecture, technical PDF, or presentation deck to this course"
      >
        <form onSubmit={handleAddResource} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Resource Title</label>
            <input
              type="text"
              required
              value={resTitle}
              onChange={(e) => setResTitle(e.target.value)}
              placeholder="e.g. Architecture Deep Dive & Best Practices"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Material Type</label>
              <select
                value={resType}
                onChange={(e) => setResType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="VIDEO">Video Lecture (MP4 / Stream)</option>
                <option value="PDF">PDF Technical Guide</option>
                <option value="PRESENTATION">Presentation Deck (PPTX)</option>
                <option value="DOCUMENT">Documentation / Code Notes</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Duration (Mins)</label>
              <input
                type="number"
                min="5"
                max="300"
                value={resMinutes}
                onChange={(e) => setResMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Resource URL / Path</label>
            <input
              type="text"
              required
              value={resUrl}
              onChange={(e) => setResUrl(e.target.value)}
              placeholder="https://example.com/materials/cloud-guide.pdf"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <Button type="submit" variant="primary" className="w-full" isLoading={uploading}>
            Add Material to Course Syllabus →
          </Button>
        </form>
      </Modal>
    </div>
  );
}
