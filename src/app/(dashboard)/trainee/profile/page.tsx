'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { parseJSON } from '@/lib/utils';

export default function TraineeProfilePage() {
  const { data: session } = useSession();
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [interests, setInterests] = useState('');
  const [experienceYears, setExperienceYears] = useState(2);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        let activeUserId = session?.user?.id;
        if (!activeUserId) {
          const uRes = await fetch('/api/users?role=TRAINEE');
          const users = await uRes.json();
          if (users.length > 0) activeUserId = users[0].id;
        }

        if (!activeUserId) return;

        const res = await fetch(`/api/users/${activeUserId}`);
        const data = await res.json();
        setUser(data);
        setName(data.name || '');
        setBio(data.bio || '');
        setSkills(parseJSON<string[]>(data.skills, []).join(', '));
        setQualifications(parseJSON<string[]>(data.qualifications, []).join(', '));
        setInterests(parseJSON<string[]>(data.interests, []).join(', '));
        setExperienceYears(data.experienceYears || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [session?.user?.id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setSaving(true);
    setSaved(false);

    try {
      const skillsArr = skills.split(',').map((s) => s.trim()).filter(Boolean);
      const qualsArr = qualifications.split(',').map((q) => q.trim()).filter(Boolean);
      const interestsArr = interests.split(',').map((i) => i.trim()).filter(Boolean);

      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          bio,
          skills: skillsArr,
          qualifications: qualsArr,
          interests: interestsArr,
          experienceYears: Number(experienceYears),
        }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white">Professional Capacity Profile</h2>
        <p className="text-xs text-slate-400 mt-1">
          Your profile parameters feed directly into the Competency Intelligence Engine to detect gaps and calculate recommendation relevance.
        </p>
      </div>

      <Card className="border-slate-800 bg-slate-900/90 shadow-xl p-6">
        {saved && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs">
            ✓ Profile successfully updated and synced with Competency Intelligence Engine!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
              {name.charAt(0) || 'U'}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{name}</h3>
              <p className="text-xs text-slate-400">{user?.email}</p>
              <span className="text-[10px] text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40 mt-1 inline-block">
                Role: {user?.role}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Total Experience (Years)</label>
            <input
              type="number"
              min="0"
              max="40"
              value={experienceYears}
              onChange={(e) => setExperienceYears(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Current Skills & Technologies (comma separated)
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. JavaScript, Python, SQL, Cloud Architecture"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Qualifications & Degrees (comma separated)
            </label>
            <input
              type="text"
              value={qualifications}
              onChange={(e) => setQualifications(e.target.value)}
              placeholder="e.g. B.Tech Computer Science, PMP, AWS Certified"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Learning Interests & Career Goals (comma separated)
            </label>
            <input
              type="text"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g. Data Analytics, Cloud Architecture, Leadership"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Professional Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Describe your current role and organizational capacity building objectives..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <Button type="submit" variant="primary" className="w-full mt-4" isLoading={saving}>
            Save Changes & Update Competency Profile →
          </Button>
        </form>
      </Card>
    </div>
  );
}
