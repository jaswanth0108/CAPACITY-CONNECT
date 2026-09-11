'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<'TRAINEE' | 'TRAINER'>('TRAINEE');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [interests, setInterests] = useState('');
  const [experienceYears, setExperienceYears] = useState(2);
  const [specialization, setSpecialization] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const skillsArray = skills.split(',').map((s) => s.trim()).filter(Boolean);
      const qualsArray = qualifications.split(',').map((q) => q.trim()).filter(Boolean);
      const interestsArray = interests.split(',').map((i) => i.trim()).filter(Boolean);

      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          bio,
          skills: skillsArray,
          qualifications: qualsArray,
          interests: interestsArray,
          experienceYears: Number(experienceYears),
          ...(role === 'TRAINER' && {
            expertise: skillsArray,
            certifications: qualsArray,
            specialization,
          }),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed');
        setIsLoading(false);
      } else {
        router.push('/login?registered=true');
      }
    } catch (err) {
      setError('An error occurred during registration');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="w-full max-w-xl my-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-xl font-black shadow-lg mb-2">
            CC
          </div>
          <h1 className="text-xl font-bold text-white">Join Capacity Connect</h1>
          <p className="text-xs text-slate-400">Create your enterprise learning & capability profile</p>
        </div>

        <Card className="border-slate-800 bg-slate-900/90 shadow-2xl p-6 sm:p-8">
          {/* Role selector */}
          <div className="flex gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => setRole('TRAINEE')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                role === 'TRAINEE'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🧑‍🎓 Join as Trainee
            </button>
            <button
              type="button"
              onClick={() => setRole('TRAINER')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                role === 'TRAINER'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🎓 Join as Trainer
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aditi Rao"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. aditi@company.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Experience (Years)</label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {role === 'TRAINER' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Specialization Domain</label>
                <input
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder="e.g. Cloud Architecture & Kubernetes"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {role === 'TRAINER' ? 'Core Expertise / Skills (comma separated)' : 'Current Skills (comma separated)'}
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. Python, SQL, Cloud Architecture, Leadership"
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
              <label className="block text-xs font-semibold text-slate-300 mb-1">Professional Bio / Summary</label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Brief summary of your professional background and learning objectives..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full mt-4" isLoading={isLoading}>
              Complete Registration & Start →
            </Button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-5">
            Already registered?{' '}
            <Link href="/login" className="text-blue-400 hover:underline font-semibold">
              Sign In
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
