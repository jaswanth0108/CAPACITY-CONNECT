'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { formatDate } from '@/lib/utils';

export default function AdminAnnouncementsPage() {
  const { data: session } = useSession();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('INFO');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch('/api/announcements');
        const data = await res.json();
        setAnnouncements(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    let adminId = session?.user?.id;
    if (!adminId) {
      const uRes = await fetch('/api/users?role=ADMIN');
      const admins = await uRes.json();
      if (admins.length > 0) adminId = admins[0].id;
    }

    if (!adminId) return;

    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId,
          title,
          content,
          type,
        }),
      });

      if (res.ok) {
        const created = await res.json();
        setAnnouncements((prev) => [created, ...prev]);
        setShowModal(false);
        setTitle('');
        setContent('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Platform Announcements & Milestone Broadcasts</h2>
          <p className="text-xs text-slate-400 mt-1">
            Publish organization-wide alerts, curriculum launch notices, and learner achievement celebrations.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
          + Publish Announcement
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {announcements.map((a) => (
          <Card key={a.id} className="border-slate-800 bg-slate-900/90 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant={a.type === 'ALERT' ? 'danger' : a.type === 'ACHIEVEMENT' ? 'success' : 'info'}>
                  {a.type}
                </Badge>
                <span className="text-[10px] text-slate-500">{formatDate(a.createdAt)}</span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">{a.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{a.content}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500 mt-4">
              Published by: {a.admin?.name || 'Administrator'}
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Publish Organizational Announcement"
        description="Broadcast information to all trainees and trainers"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Announcement Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 🎉 Q3 Cloud Upskilling Challenge Launched!"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Category Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-rose-500"
            >
              <option value="INFO">General Information</option>
              <option value="ACHIEVEMENT">Learner Achievement / Milestone</option>
              <option value="ALERT">Important Alert / Deadline</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Message</label>
            <textarea
              rows={4}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Provide details about the announcement..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-rose-500"
            />
          </div>

          <Button type="submit" variant="primary" className="w-full" isLoading={submitting}>
            Broadcast Announcement →
          </Button>
        </form>
      </Modal>
    </div>
  );
}
