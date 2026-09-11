'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function NewCoursePage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [competencyId, setCompetencyId] = useState('');
  const [difficulty, setDifficulty] = useState('BEGINNER');
  const [durationHours, setDurationHours] = useState(20);
  const [tags, setTags] = useState('');
  const [competencies, setCompetencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCompetencies() {
      try {
        setLoading(true);
        const res = await fetch('/api/competencies');
        const data = await res.json();
        setCompetencies(Array.isArray(data) ? data : []);
        if (data.length > 0) setCompetencyId(data[0].id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCompetencies();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    let trainerId = session?.user?.id;
    if (!trainerId) {
      const uRes = await fetch('/api/users?role=TRAINER');
      const trainers = await uRes.json();
      if (trainers.length > 0) trainerId = trainers[0].id;
    }

    if (!trainerId) {
      setError('No trainer profile authenticated');
      setIsSubmitting(false);
      return;
    }

    try {
      const tagsArray = tags.split(',').map((t) => t.trim()).filter(Boolean);

      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          trainerId,
          competencyId,
          difficulty,
          durationHours: Number(durationHours),
          tags: tagsArray,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to create course');
        setIsSubmitting(false);
      } else {
        const created = await res.json();
        router.push(`/trainer/courses/${created.id}`);
      }
    } catch (err) {
      setError('An error occurred');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white">Create New Course Curriculum</h2>
        <p className="text-xs text-slate-400 mt-1">
          Publish a targeted capacity-building curriculum to address specific organizational competency gaps.
        </p>
      </div>

      <Card className="border-slate-800 bg-slate-900/90 shadow-xl p-6">
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Course Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Enterprise Cloud Architecture & Kubernetes Hands-on"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Description</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the objectives, syllabus structure, and practical skills trainees will acquire..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Competency Domain</label>
              <select
                value={competencyId}
                onChange={(e) => setCompetencyId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              >
                {competencies.map((comp) => (
                  <option key={comp.id} value={comp.id}>
                    {comp.name} ({comp.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Curriculum Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="BEGINNER">Beginner (Foundational)</option>
                <option value="INTERMEDIATE">Intermediate (Practitioner)</option>
                <option value="ADVANCED">Advanced (Specialist)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Estimated Hours</label>
              <input
                type="number"
                min="1"
                max="200"
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tags (comma separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. AWS, Docker, Kubernetes, CI/CD"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full mt-4" isLoading={isSubmitting}>
            Create Course & Open Studio Studio →
          </Button>
        </form>
      </Card>
    </div>
  );
}
