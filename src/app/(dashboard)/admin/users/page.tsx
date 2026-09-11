'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { parseJSON } from '@/lib/utils';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        const res = await fetch('/api/users');
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  const handleUpdateStatus = async (userId: string, newStatus: string) => {
    setActionLoading(userId);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    setActionLoading(userId);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = users.filter((u) => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
    return matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white">User Governance & Role-Based Access Control</h2>
        <p className="text-xs text-slate-400 mt-1">
          Approve registrations, manage organizational roles, and inspect member capability profiles.
        </p>
      </div>

      {/* Filter bar */}
      <Card className="border-slate-800 bg-slate-900/90 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <span className="text-xs text-slate-400 font-semibold mr-2">Filter Role:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
              >
                <option value="ALL">All Roles</option>
                <option value="TRAINEE">Trainees</option>
                <option value="TRAINER">Trainers</option>
                <option value="ADMIN">Admins</option>
              </select>
            </div>

            <div>
              <span className="text-xs text-slate-400 font-semibold mr-2">Filter Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="APPROVED">Approved</option>
                <option value="PENDING">Pending Approval</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          <div className="text-xs text-slate-400">
            Showing <strong className="text-white">{filtered.length}</strong> of {users.length} registered members
          </div>
        </div>
      </Card>

      {/* Users table */}
      <Card className="border-slate-800 bg-slate-900/90">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Member Name & Email</th>
                <th className="py-3 px-4">Role (RBAC)</th>
                <th className="py-3 px-4">Approval Status</th>
                <th className="py-3 px-4">Experience</th>
                <th className="py-3 px-4">Skills & Credentials</th>
                <th className="py-3 px-4 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((u) => {
                const skills: string[] = parseJSON(u.skills, []);
                const isPending = u.status === 'PENDING';

                return (
                  <tr key={u.id} className={`hover:bg-slate-800/30 transition ${isPending ? 'bg-amber-950/10' : ''}`}>
                    <td className="py-3 px-4">
                      <p className="font-bold text-white">{u.name}</p>
                      <p className="text-[11px] text-slate-400">{u.email}</p>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={u.role}
                        disabled={actionLoading === u.id}
                        onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                        className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-[11px] font-semibold text-slate-200 focus:outline-none"
                      >
                        <option value="TRAINEE">TRAINEE</option>
                        <option value="TRAINER">TRAINER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          u.status === 'APPROVED'
                            ? 'success'
                            : u.status === 'PENDING'
                            ? 'warning'
                            : 'danger'
                        }
                      >
                        {u.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-medium">{u.experienceYears} Years</td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {skills.slice(0, 3).map((s, i) => (
                          <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                            {s}
                          </span>
                        ))}
                        {skills.length > 3 && (
                          <span className="text-[10px] text-slate-500">+{skills.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      {isPending ? (
                        <>
                          <Button
                            variant="success"
                            size="sm"
                            className="text-xs"
                            isLoading={actionLoading === u.id}
                            onClick={() => handleUpdateStatus(u.id, 'APPROVED')}
                          >
                            ✓ Approve
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            className="text-xs"
                            isLoading={actionLoading === u.id}
                            onClick={() => handleUpdateStatus(u.id, 'REJECTED')}
                          >
                            ✕ Reject
                          </Button>
                        </>
                      ) : u.status === 'APPROVED' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs text-rose-400 hover:text-rose-300"
                          isLoading={actionLoading === u.id}
                          onClick={() => handleUpdateStatus(u.id, 'REJECTED')}
                        >
                          Revoke Access
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs text-emerald-400"
                          isLoading={actionLoading === u.id}
                          onClick={() => handleUpdateStatus(u.id, 'APPROVED')}
                        >
                          Re-Approve
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
