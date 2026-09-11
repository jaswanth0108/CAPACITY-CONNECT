'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { parseJSON } from '@/lib/utils';

export default function TrainerProfilePage() {
  const { data: session } = useSession();
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [expertise, setExpertise] = useState('');
  const [certifications, setCertifications] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [experienceYears, setExperienceYears] = useState(10);
  const [available, setAvailable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        let trainerId = session?.user?.id;
        if (!trainerId) {
          const uRes = await fetch('/api/users?role=TRAINER');
          const trainers = await uRes.json();
          if (trainers.length > 0) trainerId = trainers[0].id;
        }

        if (!trainerId) return;

        const res = await fetch(`/api/users/${trainerId}`);
        const data = await res.json();
        setUser(data);
        setName(data.name || '');
        setBio(data.bio || '');
        setExperienceYears(data.experienceYears || 0);

        const profile = data.trainerProfile;
        if (profile) {
          setExpertise(parseJSON<string[]>(profile.expertise, []).join(', '));
          setCertifications(parseJSON<string[]>(profile.certifications, []).join(', '));
          setSpecialization(profile.specialization || '');
          setAvailable(profile.available ?? true);
        }
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
      const expArr = expertise.split(',').map((e) => e.trim()).filter(Boolean);
      const certArr = certifications.split(',').map((c) => c.trim()).filter(Boolean);

      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          bio,
          experienceYears: Number(experienceYears),
          skills: expArr,
          qualifications: certArr,
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
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white">Trainer Credentials & Capacity Profile</h2>
        <p className="text-xs text-slate-400 mt-1">
          Your credentials determine your AI Matching Score (Expertise 30%, Experience 20%, Qualifications 15%, Certs 10%, Rating 15%, Availability 10%).
        </p>
      </div>

      <Card className="border-slate-800 bg-slate-900/90 shadow-xl p-6">
        {saved && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs">
            ✓ Profile and matching criteria successfully updated!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
              {name.charAt(0) || 'T'}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{name}</h3>
              <p className="text-xs text-slate-400">{user?.email}</p>
              <span className="text-[10px] text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40 mt-1 inline-block">
                Role: {user?.role} • Rating: ⭐ {user?.trainerProfile?.rating?.toFixed(1) || '4.8'}
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
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Years of Industry Experience</label>
              <input
                type="number"
                min="1"
                max="40"
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Specialization Focus</label>
              <input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                placeholder="e.g. Data Science & Machine Learning"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Domain Expertise & Topics (comma separated)
            </label>
            <input
              type="text"
              value={expertise}
              onChange={(e) => setExpertise(e.target.value)}
              placeholder="e.g. Data Analytics, Machine Learning, Statistical Modeling"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Verified Certifications (comma separated)
            </label>
            <input
              type="text"
              value={certifications}
              onChange={(e) => setCertifications(e.target.value)}
              placeholder="e.g. Google Professional Data Engineer, AWS ML Specialty, Tableau Desktop Specialist"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Professional Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Summary of qualifications and executive capacity building track record..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-white">Current Availability for Mentoring</p>
              <p className="text-[10px] text-slate-400">Controls availability weight (10%) in recommendation engine</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={available}
                onChange={(e) => setAvailable(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <Button type="submit" variant="primary" className="w-full mt-4" isLoading={saving}>
            Save Trainer Credentials →
          </Button>
        </form>
      </Card>
    </div>
  );
}
