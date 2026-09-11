'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { Badge } from '../ui/badge';

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const role = session?.user?.role || 'TRAINEE';

  const traineeLinks = [
    { name: 'Dashboard', href: '/trainee', icon: '📊' },
    { name: 'My Competencies', href: '/trainee/competencies', icon: '🎯' },
    { name: 'Recommendations', href: '/trainee/recommendations', icon: '✨' },
    { name: 'Browse Courses', href: '/trainee/courses', icon: '📚' },
    { name: 'Assessments', href: '/trainee/assessments', icon: '📝' },
    { name: 'Certificates', href: '/trainee/certificates', icon: '🏆' },
    { name: 'My Profile', href: '/trainee/profile', icon: '👤' },
  ];

  const trainerLinks = [
    { name: 'Trainer Dashboard', href: '/trainer', icon: '📈' },
    { name: 'My Courses', href: '/trainer/courses', icon: '📚' },
    { name: 'Create Course', href: '/trainer/courses/new', icon: '➕' },
    { name: 'Assessments Studio', href: '/trainer/assessments', icon: '📝' },
    { name: 'Trainee Progress', href: '/trainer/trainees', icon: '👥' },
    { name: 'Reviews & Feedback', href: '/trainer/feedback', icon: '⭐' },
    { name: 'Trainer Profile', href: '/trainer/profile', icon: '🎓' },
  ];

  const adminLinks = [
    { name: 'Admin Overview', href: '/admin', icon: '⚡' },
    { name: 'Organization Analytics', href: '/admin/analytics', icon: '📊' },
    { name: 'User & Role Management', href: '/admin/users', icon: '👥' },
    { name: 'Course Catalog', href: '/admin/courses', icon: '📚' },
    { name: 'Competency Framework', href: '/admin/competencies', icon: '🎯' },
    { name: 'Announcements', href: '/admin/announcements', icon: '📢' },
  ];

  const links = role === 'ADMIN' ? adminLinks : role === 'TRAINER' ? trainerLinks : traineeLinks;

  // Quick switcher for hackathon judges
  const handleQuickSwitch = async (email: string, targetRole: string) => {
    await signIn('credentials', {
      email,
      password: targetRole === 'ADMIN' ? 'admin123' : targetRole === 'TRAINER' ? 'trainer123' : 'trainee123',
      callbackUrl: targetRole === 'ADMIN' ? '/admin' : targetRole === 'TRAINER' ? '/trainer' : '/trainee',
    });
  };

  return (
    <aside className="w-64 min-h-screen border-r border-slate-800 bg-slate-950/95 flex flex-col justify-between shrink-0 p-4">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-4 mb-6 border-b border-slate-800/80">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-400 flex items-center justify-center text-white text-lg font-black shadow-lg shadow-indigo-500/30">
            CC
          </div>
          <div>
            <h1 className="text-sm font-black tracking-wide text-white leading-none">
              CAPACITY CONNECT
            </h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-1">
              Org Intelligence
            </p>
          </div>
        </div>

        {/* Current Role Banner */}
        <div className="px-2 mb-4">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Current Role:</span>
            <Badge
              variant={
                role === 'ADMIN' ? 'danger' : role === 'TRAINER' ? 'purple' : 'info'
              }
            >
              {role}
            </Badge>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/trainee' && link.href !== '/trainer' && link.href !== '/admin' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <span className="text-base">{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Quick Role Switcher for Hackathon Demo */}
      <div className="pt-4 border-t border-slate-800/80">
        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold px-2 mb-2">
          ⚡ Hackathon Demo Switcher
        </p>
        <div className="grid grid-cols-3 gap-1 px-1">
          <button
            onClick={() => handleQuickSwitch('rahul.kumar@example.com', 'TRAINEE')}
            className={`px-1.5 py-1 text-[10px] rounded font-medium transition ${
              role === 'TRAINEE'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Trainee
          </button>
          <button
            onClick={() => handleQuickSwitch('priya.sharma@example.com', 'TRAINER')}
            className={`px-1.5 py-1 text-[10px] rounded font-medium transition ${
              role === 'TRAINER'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Trainer
          </button>
          <button
            onClick={() => handleQuickSwitch('admin@capacityconnect.com', 'ADMIN')}
            className={`px-1.5 py-1 text-[10px] rounded font-medium transition ${
              role === 'ADMIN'
                ? 'bg-rose-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Admin
          </button>
        </div>
      </div>
    </aside>
  );
}
