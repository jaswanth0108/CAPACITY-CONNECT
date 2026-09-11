'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(res.error);
        setIsLoading(false);
      } else {
        // Redirect according to email/role
        if (email.includes('admin')) {
          router.push('/admin');
        } else if (email.includes('priya') || email.includes('trainer')) {
          router.push('/trainer');
        } else {
          router.push('/trainee');
        }
      }
    } catch (err) {
      setError('An error occurred during login');
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string, demoRole: string) => {
    setEmail(demoEmail);
    setPassword(demoRole === 'admin' ? 'admin123' : demoRole === 'trainer' ? 'trainer123' : 'trainee123');
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Glow effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Brand logo & title */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-400 text-white text-2xl font-black shadow-xl shadow-indigo-500/30 mb-3">
          CC
        </div>
        <h1 className="text-2xl font-black tracking-tight text-white">CAPACITY CONNECT</h1>
        <p className="text-xs text-slate-400 mt-1">Intelligent Organizational Capacity Building Platform</p>
      </div>

      <Card className="w-full max-w-md border-slate-800 bg-slate-900/90 shadow-2xl p-6 sm:p-8">
        <h2 className="text-lg font-bold text-white mb-1">Sign In to Platform</h2>
        <p className="text-xs text-slate-400 mb-6">Access your tailored capacity and competency portal</p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. rahul.kumar@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <Button type="submit" variant="primary" className="w-full mt-2" isLoading={isLoading}>
            Sign In →
          </Button>
        </form>

        {/* Demo Quick Click Credentials */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            ⚡ Quick Demo Accounts (Click to Fill):
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('rahul.kumar@example.com', 'trainee')}
              className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-center transition"
            >
              <span className="block text-xs font-bold text-blue-400">Trainee</span>
              <span className="block text-[10px] text-slate-400">Rahul Kumar</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('priya.sharma@example.com', 'trainer')}
              className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-center transition"
            >
              <span className="block text-xs font-bold text-indigo-400">Trainer</span>
              <span className="block text-[10px] text-slate-400">Priya Sharma</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@capacityconnect.com', 'admin')}
              className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-center transition"
            >
              <span className="block text-xs font-bold text-rose-400">Admin</span>
              <span className="block text-[10px] text-slate-400">Sys Admin</span>
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Do not have an account?{' '}
          <Link href="/register" className="text-blue-400 hover:underline font-semibold">
            Create Profile
          </Link>
        </p>
      </Card>
    </div>
  );
}
