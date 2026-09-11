'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Badge } from '../ui/badge';

export function Header() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/notifications?userId=${session.user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setNotifications(data);
            setUnreadCount(data.filter((n) => !n.read).length);
          }
        })
        .catch(() => {});
    }
  }, [session?.user?.id]);

  const markAllAsRead = async () => {
    if (session?.user?.id) {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.user.id, markAll: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    }
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Workflow Tagline indicator */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
          <span className="text-blue-400 font-bold">Identify</span>
          <span className="text-slate-600">→</span>
          <span className="text-indigo-400 font-bold">Recommend</span>
          <span className="text-slate-600">→</span>
          <span className="text-amber-400 font-bold">Learn</span>
          <span className="text-slate-600">→</span>
          <span className="text-purple-400 font-bold">Assess</span>
          <span className="text-slate-600">→</span>
          <span className="text-emerald-400 font-bold">Improve</span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        {/* Notification Bell with dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition"
          >
            🔔
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Notifications</h4>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[10px] text-blue-400 hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-500 py-3 text-center">No notifications yet</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-xl border text-xs ${
                        n.read
                          ? 'bg-slate-950/40 border-slate-900 text-slate-400'
                          : 'bg-slate-950 border-slate-800 text-slate-200'
                      }`}
                    >
                      <p className="font-semibold text-white text-xs">{n.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile avatar + Signout */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-md">
            {session?.user?.name ? session.user.name.charAt(0) : 'U'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-white leading-none">{session?.user?.name || 'Guest'}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{session?.user?.email || 'Not logged in'}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            title="Sign out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition text-xs"
          >
            🚪
          </button>
        </div>
      </div>
    </header>
  );
}
